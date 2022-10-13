import {WAMLType} from './../types/waml';
import {logger} from './logger';
import {WAML} from '../types/waml';
import {WeakAura} from '../types/weakauras';
import {get, merge, set} from 'lodash';
import {parseFromFile} from './serialize';
import {dirname, resolve} from 'path';
import {isGroupWAML, isGroupWeakAura} from './is-group';
import {deepForEach} from './deep-for-each';
import {Serializable, SerializableValue} from '../types/serializable';

function validate(waml: WAML) {
  // from and type are mutually exclusive (also count the wa data for type)
  if (Boolean(waml.type || waml.wa?.d?.regionType) === Boolean(waml.from)) {
    throw new Error(
      'WAML validation: "from" and "type" fields are mutually exclusive'
    );
  }

  // type must be valid if provided
  if (waml.type && !Object.values(WAMLType).includes(waml.type)) {
    throw new Error(`WAML validation: unrecognized type ${waml.type}`);
  }
}

function interpolateVariables(waml: WAML): WAML {
  deepForEach(waml, (obj, key, value) => {
    if (typeof value !== 'string') {
      // only interpolate strings
      return;
    }

    const wholeStringMatch = value.match(/^([$_]){(.+?)}$/);
    if (wholeStringMatch) {
      // the entire field is the variable, replace the whole value and maintain types
      const [original, type, content] = wholeStringMatch;

      let variableValue: SerializableValue;
      if (type === '$') {
        // variable insertion
        variableValue = get(waml.variables, content);
      } else if (type === '_') {
        // self insertion
        variableValue = get(waml, content);
      }

      if (variableValue !== undefined) {
        logger.debug(
          `interpolateVariables: Found whole-field interpolation ${original}, replacing with exact variable`,
          variableValue
        );
        (obj as Serializable)[key] = variableValue;
      }
      return;
    }

    const applied = value.replace(
      /([$_!]){(.+?)}/g,
      (original, type, content) => {
        let value: SerializableValue;
        if (type === '$') {
          // variable interpolation
          value = get(waml.variables, content);
        } else if (type === '_') {
          // self interpolation
          value = get(waml, content);
        } else {
          // escaping
          value = content;
        }

        // (value was stringified)
        if (value !== undefined) {
          logger.debug(
            `interpolateVariables: Found interpolation ${original}, replaced with ${value}`
          );
          return String(value);
        } else {
          logger.debug(
            `interpolateVariables: Found interpolation ${original}, but couldn't replace`
          );
          return original;
        }
      }
    );

    // technically we could be string-indexing an array here, but that seems to work fine
    (obj as Serializable)[key] = applied;
  });

  return waml;
}

// if the waml inherits from something (from/type are defined), then compile that child and apply this waml's fields on
// top of it
function resolveInheritance(waml: WAML, cwd: string): WAML {
  let templateWa: WeakAura;
  if (waml.from) {
    // inheriting from another waml file; load it in, compile it (which executes this function recursively as well),
    // and get the final weakaura data
    const templateFile = resolve(`${cwd}/${waml.from}`);
    logger.debug(
      'resolveInheritance: resolved templateFile location',
      cwd,
      '/',
      waml.from
    );
    const template = parseFromFile(templateFile);
    templateWa = compile(template, dirname(templateFile));
  } else if (waml.type) {
    const template = parseFromFile(
      resolve(__dirname, `../templates/${waml.type}.yml`)
    );
    // casting here since we loaded from a built-in template; we know 'wa' is good
    templateWa = template.wa as WeakAura;
  } else {
    // no inheritance
    return waml;
  }

  const mergedWa = merge(templateWa, waml.wa);
  waml.wa = mergedWa;

  // delete waml.from;
  // delete waml.type;

  return waml;
}

export function compile<T extends WeakAura>(waml: WAML, cwd: string): T {
  validate(waml);

  // apply templates all the way down
  logger.debug('compile: WAML before applying templates', waml, cwd);
  waml = resolveInheritance(waml, cwd);
  logger.debug('compile: WAML after applying templates', waml, cwd);

  if (!waml.wa?.d) {
    // we should have weakauras data by now if everything is valid
    throw new Error(
      "compile: didn't have wa.d field after applying templates. Broken WAML?"
    );
  }

  // apply name and uid overrides
  if (waml.name) {
    set(waml, 'wa.d.id', waml.name);
  }
  if (waml.uid) {
    set(waml, 'wa.d.uid', waml.uid);
  }

  // compile and insert children
  if (isGroupWAML(waml) && waml.children) {
    logger.debug(
      'compile: This WAML is a group',
      waml.name,
      waml.children.length
    );
    waml.wa.c ??= [];

    for (const childWaml of waml.children) {
      const childWa = compile(childWaml, cwd);
      childWa.d.parent = waml.wa.d.id;

      waml.wa.d.controlledChildren ??= [];
      waml.wa.d.controlledChildren.push(childWa.d.id);

      waml.wa.c.push(childWa.d);

      if (isGroupWeakAura(childWa) && childWa.c) {
        // nested group; claim its children
        waml.wa.c.push(...childWa.c);
      }
    }
  }

  // apply variable interpolation
  waml = interpolateVariables(waml);

  // making the (bold?) assumption that we have full WeakAura object after everything
  return waml.wa as T;
}

export function decompile(wa: WeakAura): WAML {
  return {
    wa,
  };
}

import {logger} from './logger';
import {WAML} from '../types/waml';
import {WeakAura} from '../types/weakauras';
import {get, merge, set} from 'lodash';
import {parse, parseFromFile, stringify} from './serialize';
import {dirname, resolve} from 'path';
import {isGroupWAML, isGroupWeakAura} from './is-group';
import {deepForEach} from './deep-for-each';
import {Serializable} from '../types/serializable';

function validate(waml: WAML) {
  // TODO :)
}

function applyTemplate(waml: WAML, cwd?: string): WAML {
  if (!cwd) {
    cwd = resolve('.');
  }
  let template: WAML;
  if (waml.from) {
    const templateFile = resolve(`${cwd}/${encodeURIComponent(waml.from)}`);
    template = parseFromFile(templateFile);
    template = applyTemplate(template, dirname(templateFile));
  } else if (waml.type) {
    template = parseFromFile(
      resolve(__dirname, `../templates/${encodeURIComponent(waml.type)}.yml`)
    );
  } else {
    return waml;
  }

  // NOTE: idk why i had this before, but keeping it here and commented in case an infinite loops pops up or something
  // remove importing fields
  // delete template.from;
  // delete template.type;
  // delete waml.from;
  // delete waml.type;

  const applied = merge(template, waml);
  logger.debug('WAML after applying template layer', applied);
  return applied;
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
      logger.debug(
        `interpolateVariables: Found whole-field interpolation ${value}, replacing with exact variable`
      );
      const [original, type, content] = wholeStringMatch;
      if (type === '$') {
        // variable insertion
        (obj as Serializable)[key] = get(waml.variables, content);
      } else if (type === '_') {
        // self insertion
        (obj as Serializable)[key] = get(waml, content);
      }
      return;
    }

    const applied = value.replace(
      /([$_!]){(.+?)}/g,
      (original, type, content) => {
        let value = original;
        if (type === '$') {
          // variable interpolation
          value = String(get(waml.variables, content));
        } else if (type === '_') {
          // self interpolation
          value = String(get(waml, content));
        } else {
          // escaping
          value = content;
        }

        if (value !== original) {
          logger.debug(
            `interpolateVariables: Found interpolation ${original}, replaced with ${value}`
          );
        } else {
          logger.debug(
            `interpolateVariables: Found interpolation ${original}, but couldn't replace`
          );
        }

        return value;
      }
    );

    // technically we could be string-indexing an array here, but that seems to work fine
    (obj as Serializable)[key] = applied;
  });

  return waml;
}

export function compile<T extends WeakAura>(waml: WAML, cwd: string): T {
  validate(waml);

  logger.debug('WAML before applying templates', waml);

  // apply templates all the way down
  waml = applyTemplate(waml, cwd);

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
    logger.debug('This WAML is a group', waml.name, waml.children.length);
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

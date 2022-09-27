import {logger} from './logger';
import {WAML} from '../types/waml';
import {WeakAura} from '../types/weakauras';
import {get, merge, set} from 'lodash';
import {parse, parseFromFile, stringify} from './serialize';
import {dirname, resolve} from 'path';

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

  // remove importing fields
  delete template.from;
  delete template.type;
  delete waml.from;
  delete waml.type;

  const applied = merge(template, waml);
  logger.debug('WAML after applying template layer', applied);
  return applied;
}

function interpolateVariables(waml: WAML): WAML {
  // this might haunt me later, but it seems cozy to just stringify the whole thing, run interpolation, and then parse
  // the whole thing again.
  // this does mean you could inject/break the yaml via variables, but surely nobody will do that by mistake
  // also, with this there isn't a way to use an entire object as a variable, although that might be handy to have in
  // the future
  const stringified = stringify(waml);

  const applied = stringified.replace(
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

  return parse(applied);
}

export function compile(waml: WAML, cwd: string): WeakAura {
  validate(waml);

  logger.debug('WAML before applying templates', waml);

  // apply templates all the way down
  waml = applyTemplate(waml, cwd);

  if (!waml.wa) {
    // we should have weakauras data by now if everything is valid
    throw new Error(
      "compile: didn't have wa field after applying templates. Broken WAML?"
    );
  }

  // apply name and uid overrides
  if (waml.name) {
    set(waml, 'wa.d.id', waml.name);
  }
  if (waml.uid) {
    set(waml, 'wa.d.uid', waml.uid);
  }

  // apply variable interpolation
  waml = interpolateVariables(waml);

  // making the (bold?) assumption that we have full WeakAura object after everything
  return waml.wa as WeakAura;
}

export function decompile(wa: WeakAura): WAML {
  return {
    wa,
  };
}

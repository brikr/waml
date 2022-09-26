import {logger} from './logger';
import {WAML} from '../types/waml';
import {WeakAura} from '../types/weakauras';
import {merge, set} from 'lodash';
import {parseFromFile} from './serialize';
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

  // making the (bold?) assumption that we have full WeakAura object after everything
  return waml.wa as WeakAura;
}

export function decompile(wa: WeakAura): WAML {
  return {
    wa,
  };
}

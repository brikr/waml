import {logger} from './logger';
import {WAML} from '../types/waml';
import {WeakAura} from '../types/weakauras';
import {merge} from 'lodash';
import {parseFromFile} from './serialize';
import {resolve} from 'path';

function validate(waml: WAML) {
  // TODO :)
}

function applyTemplate(waml: WAML): WAML {
  let template: WAML;
  if (waml.from) {
    template = parseFromFile(waml.from);
  } else if (waml.type) {
    template = parseFromFile(
      resolve(__dirname, `../templates/${encodeURIComponent(waml.type)}.yml`)
    );
    logger.debug('Compiling from template:', template);
  } else {
    return waml;
  }

  return merge(template, waml);
}

export function compile(waml: WAML): WeakAura {
  validate(waml);

  // apply templates all the way down
  waml = applyTemplate(waml);

  if (!waml.wa) {
    // we should have weakauras data by now if everything is valid
    throw new Error(
      "compile: didn't have wa field after applying templates. Broken WAML?"
    );
  }

  logger.debug('WAML after applying templates', waml);

  // apply name and uid overrides
  if (waml.name) {
    waml.wa.d.id = waml.name;
  }
  if (waml.uid) {
    waml.wa.d.uid = waml.uid;
  }

  return waml.wa;
}

export function decompile(wa: WeakAura): WAML {
  return {
    wa,
  };
}

import {decodeSync, encodeSync} from 'node-weakauras-parser';
import {WAML, WeakAura} from '../types';
import {stringify as yamlStringify, parse as yamlParse} from 'yaml';

export function decodeWeakAura(s: string): WeakAura {
  return decodeSync(s);
}

export function encodeWeakAura(wa: WeakAura): string {
  return encodeSync(wa);
}

export function stringify(waml: WAML): string {
  const yaml = yamlStringify(waml);

  return `---\n${yaml}`;
}

function validate(waml: WAML) {
  // TODO :)
  return;
}

export function parse(s: string): WAML {
  const parsed = yamlParse(s);
  validate(parsed);
  return parsed;
}

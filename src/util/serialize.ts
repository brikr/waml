import {readFileSync} from 'fs';
import {decodeSync, encodeSync} from 'node-weakauras-parser';
import {WeakAura} from '../types/weakauras';
import {stringify as yamlStringify, parse as yamlParse} from 'yaml';
import {WAML} from '../types/waml';
import {logger} from './logger';

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

export function parse<T extends WAML>(s: string): T {
  const parsed = yamlParse(s);
  validate(parsed);
  return parsed;
}

export function parseFromFile<T extends WAML>(file: string): T {
  logger.debug('parseFromFile: Parsing template from file', file);
  const yaml = readFileSync(file, {encoding: 'utf8', flag: 'r'}).trim();
  return parse(yaml);
}

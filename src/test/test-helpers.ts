import {dirname} from 'path';
import {WAML} from '../types/waml';
import {compile} from '../util/compile';
import {parseFromFile} from '../util/serialize';
import {WeakAura} from './../types/weakauras';

export function loadAndCompileFromFile(file: string): {
  wa: WeakAura;
  waml: WAML;
} {
  const waml = parseFromFile(file);
  const wa = compile(waml, dirname(file));
  return {wa, waml};
}

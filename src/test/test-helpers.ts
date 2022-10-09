import {dirname} from 'path';
import {WAML} from '../types/waml';
import {compile} from '../util/compile';
import {parseFromFile} from '../util/serialize';
import {WeakAura} from './../types/weakauras';

export function loadAndCompileFromTestFile<T extends WeakAura, U extends WAML>(
  filename: string
): {
  wa: T;
  waml: U;
} {
  const file = `${__dirname}/testdata/${filename}`;
  const waml = parseFromFile<U>(file);
  const wa = compile<T>(waml, dirname(file));
  return {wa, waml};
}

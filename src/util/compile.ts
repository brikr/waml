import {WAML, WeakAura} from '../types';

export function compile(waml: WAML): WeakAura {
  // start with provided wa data
  const {wa} = waml;

  return wa;
}

export function decompile(wa: WeakAura): WAML {
  return {
    wa,
  };
}

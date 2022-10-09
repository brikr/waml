import {GroupWeakAura, WeakAura} from './../types/weakauras';
import {GroupWAML, WAML} from '../types/waml';

export function isGroupWeakAura(wa: WeakAura): wa is GroupWeakAura {
  if (wa.d.regionType === 'group' || wa.d.regionType === 'dynamicgroup') {
    return true;
  } else {
    return false;
  }
}

export function isGroupWAML(waml: WAML): waml is GroupWAML {
  if (waml.type === 'group' || waml.type === 'dynamic-group') {
    return true;
  } else {
    return false;
  }
}

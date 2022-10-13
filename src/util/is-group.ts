import {
  GroupWeakAura,
  WARegionType,
  WeakAura,
  WAGroupRegionType,
} from './../types/weakauras';
import {GroupWAML, WAML} from '../types/waml';

function isGroupWeakAuraRegionType(
  type: WARegionType
): type is WAGroupRegionType {
  return Object.values<WARegionType>(WAGroupRegionType).includes(type);
}

export function isGroupWeakAura(wa: WeakAura): wa is GroupWeakAura {
  return isGroupWeakAuraRegionType(wa.d.regionType);
}

export function isGroupWAML(waml: WAML): waml is GroupWAML {
  if (
    waml.type === 'group' ||
    waml.type === 'dynamic-group' ||
    (waml.wa?.d?.regionType && isGroupWeakAuraRegionType(waml.wa.d.regionType))
  ) {
    return true;
  } else {
    return false;
  }
}

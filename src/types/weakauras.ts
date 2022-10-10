import {Serializable} from './serializable';

// can extend Serializable later if there's specific fields we want to give known types to
export interface WeakAura extends Serializable {
  // addon version string when the aura was made
  s: string;
  // data version. only values i've seen are 1421 (pre nested groups) and 2000 (post nested groups)
  v: number;
  // this is only ever 'd' from what i can tell
  m: 'd';
  // the actual data
  d: WeakAuraData;
}

export interface GroupWeakAura extends WeakAura {
  d: GroupWeakAuraData;
  c: WeakAuraData[];
}

export interface WeakAuraData extends Serializable {
  id: string;
  uid?: string;
  regionType: RegionType;

  // present if this weakaura is part of a nested group
  parent?: string;
}

export interface GroupWeakAuraData extends WeakAuraData {
  regionType: GroupRegionType;

  // present if this weakaura is part of a nested group
  controlledChildren?: string[];
}

export type RegionType =
  | GroupRegionType
  | 'model'
  | 'aurabar'
  | 'progresstexture'
  | 'stopmotion'
  | 'text'
  | 'texture';

export type GroupRegionType = 'dynamicgroup' | 'group';

import {Serializable} from './serializable';

// can extend Serializable later if there's specific fields we want to give known types to
export interface WeakAura extends Serializable {
  s: string;
  v: number;
  m: 'd'; // never seen this be anything else
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
}

export interface GroupWeakAuraData extends WeakAuraData {
  regionType: GroupRegionType;
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

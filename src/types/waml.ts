import {Serializable} from './serializable';
import {WeakAura, RegionType, GroupWeakAura} from './weakauras';

export type Type =
  | GroupType
  | 'model'
  | 'progress-bar'
  | 'progress-texture'
  | 'stop-motion'
  | 'text'
  | 'texture';

export type GroupType = 'dynamic-group' | 'group';

export const TYPE_TO_REGION_TYPE: {[key in Type]: RegionType} = {
  'dynamic-group': 'dynamicgroup',
  group: 'group',
  model: 'model',
  'progress-bar': 'aurabar',
  'progress-texture': 'progresstexture',
  'stop-motion': 'stopmotion',
  text: 'text',
  texture: 'texture',
};

// the contents of a .yml file
export interface WAML extends Serializable {
  // weakaura name
  name?: string;
  // unique identifier that WA uses to detect updates/duplicates
  uid?: string;

  // variables
  variables?: Serializable;

  // from and type are mutually exclusive
  // template file that we are importing from
  from?: string;
  // weakaura type. under the hood, it's importing from a built-in template
  type?: Type;

  // raw weakaura data, or partial weakaura data
  wa?: Partial<WeakAura>;
}

export interface GroupWAML extends WAML {
  children?: Array<WAML>;

  type?: GroupType;

  wa?: Partial<GroupWeakAura>;
}

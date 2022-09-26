import {WeakAura, RegionType} from './weakauras';

export type Type =
  | 'dynamic-group'
  | 'group'
  | 'model'
  | 'progress-bar'
  | 'progress-texture'
  | 'stop-motion'
  | 'text'
  | 'texture';

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
export interface WAML {
  // weakaura name
  name?: string;
  // unique identifier that WA uses to detect updates/duplicates
  uid?: string;

  // from and type are mutually exclusive
  // template file that we are importing from
  from?: string;
  // weakaura type. under the hood, it's importing from a built-in template
  type?: Type;

  // raw weakaura data, or partial weakaura data
  wa?: Partial<WeakAura>;
}

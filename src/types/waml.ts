import {Serializable} from './serializable';
import {WeakAura, GroupWeakAura} from './weakauras';

export enum WAMLSingleType {
  ICON = 'icon',
  MODEL = 'model',
  PROGRESS_BAR = 'progress-bar',
  PROGRESS_TEXTURE = 'progress-texture',
  STOP_MOTION = 'stop-motion',
  TEXT = 'text',
  TEXTURE = 'texture',
}

export enum WAMLGroupType {
  DYNAMIC_GROUP = 'dynamic-group',
  GROUP = 'group',
}

export type WAMLType = WAMLSingleType | WAMLGroupType;
export const WAMLType = {...WAMLSingleType, ...WAMLGroupType};

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
  type?: WAMLType;

  // raw weakaura data, or partial weakaura data
  wa?: Partial<WeakAura>;
}

export interface GroupWAML extends WAML {
  children?: Array<WAML>;

  type?: WAMLGroupType;

  wa?: Partial<GroupWeakAura>;
}

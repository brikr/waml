import {array, InferType, object, ObjectSchema, string} from 'yup';
import {waSchema, groupWaSchema, GroupWeakAura, WeakAura} from './weakauras';
import {partial} from './yup-partial';
import {Serializable} from './serializable';

const groupTypes = ['dynamic-group', 'group'];
const types = [
  ...groupTypes,
  'model',
  'progress-bar',
  'progress-texture',
  'stop-motion',
  'text',
  'texture',
];

export const wamlSchema: ObjectSchema<WAML> = object({
  name: string().optional(),
  uid: string().optional(),

  variables: object().optional(),

  from: string().when('type', {
    is: (value: string) => Boolean(value),
    then: schema =>
      schema.oneOf([undefined], 'from and type are mutually exclusive'),
    otherwise: schema => schema.required(),
  }),
  type: string().oneOf(types).optional(),

  wa: partial(waSchema),
});

export const groupWamlSchema = wamlSchema.shape({
  children: array().of(wamlSchema).required(),

  type: string().oneOf(groupTypes).optional(),

  wa: groupWaSchema.optional(),
});

// export type WAML = InferType<typeof wamlSchema>;
// export type GroupWAML = InferType<typeof groupWamlSchema>;

export type Type =
  | GroupType
  | 'model'
  | 'progress-bar'
  | 'progress-texture'
  | 'stop-motion'
  | 'text'
  | 'texture';

export type GroupType = 'dynamic-group' | 'group';

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

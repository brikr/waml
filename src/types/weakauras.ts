import {object, string, number, array, InferType} from 'yup';

const groupRegionTypes = ['dynamicgroup', 'group'];
const regionTypes = [
  ...groupRegionTypes,
  'model',
  'aurabar',
  'progresstexture',
  'stopmotion',
  'text',
  'texture',
];

const waDataSchema = object({
  id: string().required(),
  uid: string().optional(),
  regionType: string().oneOf(regionTypes).required(),
  parent: string().optional(),
});

export const waSchema = object({
  s: string().required(),
  v: number().oneOf([1421, 2000]).required(),
  m: string().oneOf(['m']).required(),
  d: waDataSchema.required(),
});

const groupWaDataSchema = waDataSchema.shape({
  regionType: string().oneOf(groupRegionTypes).required(),
  controlledChildren: array().of(string()).optional(),
});

export const groupWaSchema = waSchema.shape({
  d: groupWaDataSchema,
  c: array().of(waDataSchema).required(),
});

export type WeakAuraData = InferType<typeof waDataSchema>;
export type WeakAura = InferType<typeof waSchema>;
export type GroupWeakAuraData = InferType<typeof groupWaDataSchema>;
export type GroupWeakAura = InferType<typeof groupWaSchema>;

// can extend Serializable later if there's specific fields we want to give known types to
// export interface WeakAura extends Serializable {
//   // addon version string when the aura was made
//   s: string;
//   // data version. only values i've seen are 1421 (pre nested groups) and 2000 (post nested groups)
//   v: number;
//   // this is only ever 'd' from what i can tell
//   m: 'd';
//   // the actual data
//   d: WeakAuraData;
// }

// export interface GroupWeakAura extends WeakAura {
//   d: GroupWeakAuraData;
//   c: WeakAuraData[];
// }

// export interface WeakAuraData extends Serializable {
//   id: string;
//   uid?: string;
//   regionType: RegionType;

//   // present if this weakaura is part of a nested group
//   parent?: string;
// }

// export interface GroupWeakAuraData extends WeakAuraData {
//   regionType: GroupRegionType;

//   // present if this weakaura is part of a nested group
//   controlledChildren?: string[];
// }

// export type RegionType =
//   | GroupRegionType
//   | 'model'
//   | 'aurabar'
//   | 'progresstexture'
//   | 'stopmotion'
//   | 'text'
//   | 'texture';

// export type GroupRegionType = 'dynamicgroup' | 'group';

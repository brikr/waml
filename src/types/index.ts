type Atom = string | number | boolean;

interface Serializable {
  [key: string]: Atom | Serializable;
}

// can extend Serializable later if there's specific fields we want to give known types to
export type WeakAura = Serializable;

// the contents of a .yaml file
export interface WAML {
  wa: WeakAura;
}

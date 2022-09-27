export type Atom = string | number | boolean | undefined;

export interface Serializable {
  [key: string]: Atom | Serializable | Array<Atom | Serializable>;
}

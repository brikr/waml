export type Atom = string | number | boolean | null | undefined;

export interface Serializable {
  [key: string]: Atom | Serializable | Array<Atom | Serializable>;
}

export function isAtom(a: unknown): a is Atom {
  if (
    ['string', 'number', 'boolean', 'undefined'].includes(typeof a) ||
    a === null
  ) {
    return true;
  } else {
    return false;
  }
}

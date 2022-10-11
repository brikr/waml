import {Atom, isAtom, Serializable} from '../types/serializable';

type Iterable = Serializable | Array<Atom | Serializable>;

export function deepForEach(
  obj: Iterable,
  fn: (obj: Iterable, key: string, value: Atom) => void,
  depth = 0
) {
  if (depth > 100) {
    throw new Error('Max depth reached when iterating through object');
  }

  for (const [key, value] of Object.entries(obj)) {
    if (isAtom(value)) {
      // run operator function
      fn(obj, key, value);
    } else {
      // iterate deeper
      deepForEach(value, fn, depth + 1);
    }
  }
}

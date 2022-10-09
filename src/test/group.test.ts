import {GroupWAML} from '../types/waml';
import {GroupWeakAura} from './../types/weakauras';
import {loadAndCompileFromTestFile} from './test-helpers';

describe('group', () => {
  it('compiles a group weakaura', () => {
    const {wa, waml} = loadAndCompileFromTestFile<GroupWeakAura, GroupWAML>(
      'group.yml'
    );

    expect(wa.c.length).toEqual(2);
    expect(wa.c[0].regionType).toEqual(waml.children?.[0].type);
  });
});

import {GroupWAML} from '../types/waml';
import {
  GroupWeakAura,
  WeakAuraData,
  GroupWeakAuraData,
} from './../types/weakauras';
import {loadAndCompileFromTestFile} from './test-helpers';

describe('group', () => {
  it('compiles a group weakaura', () => {
    const {wa, waml} = loadAndCompileFromTestFile<GroupWeakAura, GroupWAML>(
      'group.yml'
    );

    expect(wa.c.length).toEqual(2);
    expect(wa.c[0].regionType).toEqual(waml.children?.[0].type);
  });

  it('compiles a nested group weakaura', () => {
    const {wa} = loadAndCompileFromTestFile<GroupWeakAura, GroupWAML>(
      'nested-group.yml'
    );

    expect(wa.c.length).toEqual(6);

    const children: {[id: string]: WeakAuraData} = {};

    for (const child of wa.c) {
      children[child.id] = child;
    }

    expect(wa.d.controlledChildren).toEqual([
      'outer-group/text',
      'inner-group',
    ]);
    expect(wa.d.parent).toBeUndefined();

    expect(
      (children['inner-group'] as GroupWeakAuraData).controlledChildren
    ).toEqual(['inner-group/text', 'inner-group/text2', 'very-inner-group']);

    expect(children['inner-group'].parent).toEqual('outer-group');
    expect(children['inner-group/text'].parent).toEqual('inner-group');
    expect(children['inner-group/text2'].parent).toEqual('inner-group');
    expect(children['very-inner-group'].parent).toEqual('inner-group');

    expect(
      (children['very-inner-group'] as GroupWeakAuraData).controlledChildren
    ).toEqual(['very-inner-group/text']);
    expect(children['very-inner-group/text'].parent).toEqual(
      'very-inner-group'
    );
  });
});

import {loadAndCompileFromTestFile} from './test-helpers';

describe('templates', () => {
  test('built-in template', () => {
    const {wa, waml} = loadAndCompileFromTestFile(
      'text-from-builtin-template.yml'
    );

    // should have type from built-in template
    expect(wa.d.regionType).toEqual('text');

    // name should be overwritten
    expect(wa.d.id).toEqual(waml.name);
  });

  test('custom template', () => {
    const {wa, waml} = loadAndCompileFromTestFile(
      'text-from-custom-template.yml'
    );

    // should have type from built-in template
    expect(wa.d.regionType).toEqual('text');

    // should have uid from custom template
    expect(wa.d.uid).toEqual('texto');

    // name should be overwritten
    expect(wa.d.id).toEqual(waml.name);
  });

  test.skip('template with variables', () => {
    // TODO
  });
});

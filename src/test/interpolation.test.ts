import {loadAndCompileFromTestFile} from './test-helpers';

describe('interpolation', () => {
  test('interpolate from variables', () => {
    const {wa, waml} = loadAndCompileFromTestFile(
      'interpolate-from-variables.yml'
    );

    expect(wa.d.displayText).toEqual(waml.variables?.text);
  });

  test('interpolate from self', () => {
    const {wa} = loadAndCompileFromTestFile('interpolate-from-self.yml');

    expect(wa.d.displayText).toEqual(wa.d.selfPoint);
  });

  test('do not interpolate escaped', () => {
    const {wa} = loadAndCompileFromTestFile('interpolate-escaped.yml');

    expect(wa.d.displayText).toEqual('${text}');
  });
});

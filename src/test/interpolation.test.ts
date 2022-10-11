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

  describe('complex interpolation', () => {
    const {wa} = loadAndCompileFromTestFile('interpolate-complex.yml');

    test('inline text and numbers', () => {
      expect(wa.d.inlineText).toEqual('the text says I am text');
      expect(wa.d.inlineNumber).toEqual('the number is 0');
    });

    test('whole-field number maintains number type', () => {
      expect(wa.d.number).toEqual(0);
    });

    test('whole-field object', () => {
      expect(wa.d.object).toEqual({key: 'value'});
    });

    test('whole-field array', () => {
      expect(wa.d.array).toEqual(['texto', {key: 'value'}]);
    });

    test('array fields', () => {
      expect(wa.d.otherArray).toEqual([
        0,
        'the text says I am text',
        {key: 'value'},
      ]);
    });
  });
});

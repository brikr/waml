import {loadAndCompileFromFile} from './test-helpers';

describe('interpolation', () => {
  test('interpolate from variables', () => {
    const {wa, waml} = loadAndCompileFromFile(
      `${__dirname}/testdata/interpolate-from-variables.yml`
    );

    expect(wa.d.displayText).toEqual(waml.variables?.text);
  });

  test('interpolate from self', () => {
    const {wa} = loadAndCompileFromFile(
      `${__dirname}/testdata/interpolate-from-self.yml`
    );

    expect(wa.d.displayText).toEqual(wa.d.selfPoint);
  });

  test('do not interpolate escaped', () => {
    const {wa} = loadAndCompileFromFile(
      `${__dirname}/testdata/interpolate-escaped.yml`
    );

    expect(wa.d.displayText).toEqual('${text}');
  });
});

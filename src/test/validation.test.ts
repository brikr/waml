import {WAML, WAMLType} from '../types/waml';
import {compile} from '../util/compile';

describe('validation', () => {
  test('from and type are mutually exclusive', () => {
    const waml: WAML = {
      from: 'thing.yml',
      type: WAMLType.TEXT,
    };

    expect(() => compile(waml, '')).toThrow('mutually exclusive');
  });

  test('type must be valid', () => {
    const waml = {
      type: 'fake',
    } as unknown as WAML;

    expect(() => compile(waml, '')).toThrow('unrecognized type');
  });
});

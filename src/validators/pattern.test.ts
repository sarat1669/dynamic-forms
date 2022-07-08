import pattern from './pattern';

describe('pattern', () => {
  it('should return undefined for valid patterns', () => {
    expect(pattern('abc', {pattern: 'abc'})).toBe(undefined);
  });

  it('should return error message for invalid patterns', () => {
    expect(pattern('def', {pattern: 'abc'})).toBe("doesn't match pattern abc");
  });

  it('should return undefined when no input is undefined', () => {
    expect(pattern(undefined, {pattern: 'abc'})).toBe(
      "doesn't match pattern abc"
    );
  });
});

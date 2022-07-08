import max from './max';

describe('max', () => {
  it('should return undefined for valid numbers', () => {
    expect(max(0, {max: 10})).toBe(undefined);
  });

  it('should return error message for invalid numbers', () => {
    expect(max(11, {max: 10})).toBe('should be maximum 10');
  });

  it('should return undefined when no input is undefined', () => {
    expect(max(undefined, {max: 10})).toBe(undefined);
  });
});

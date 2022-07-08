import maxLength from './maxLength';

describe('max', () => {
  describe('string', () => {
    it('should return undefined for valid length', () => {
      expect(maxLength('', {maxLength: 10})).toBe(undefined);
    });

    it('should return error message for invalid length', () => {
      expect(maxLength('hello world', {maxLength: 10})).toBe(
        'length should be maximum 10'
      );
    });

    it('should return undefined when no input is undefined', () => {
      expect(maxLength(undefined, {maxLength: 10})).toBe(undefined);
    });
  });

  describe('array', () => {
    it('should return undefined for valid length', () => {
      expect(maxLength([], {maxLength: 10})).toBe(undefined);
    });

    it('should return error message for invalid length', () => {
      expect(
        maxLength([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], {maxLength: 10})
      ).toBe('length should be maximum 10');
    });

    it('should return undefined when no input is undefined', () => {
      expect(maxLength(undefined, {maxLength: 10})).toBe(undefined);
    });
  });
});

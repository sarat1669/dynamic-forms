import minLength from './minLength';

describe('min', () => {
  describe('string', () => {
    it('should return undefined for valid length', () => {
      expect(minLength('Hello World', {minLength: 10})).toBe(undefined);
    });

    it('should return error message for invalid length', () => {
      expect(minLength('hellowrld', {minLength: 10})).toBe(
        'length should be minimum 10'
      );
    });

    it('should return undefined when no input is undefined', () => {
      expect(minLength(undefined, {minLength: 10})).toBe(
        'length should be minimum 10'
      );
    });
  });

  describe('array', () => {
    it('should return undefined for valid length', () => {
      expect(minLength([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], {minLength: 10})).toBe(
        undefined
      );
    });

    it('should return error message for invalid length', () => {
      expect(minLength([], {minLength: 10})).toBe(
        'length should be minimum 10'
      );
    });

    it('should return undefined when no input is undefined', () => {
      expect(minLength(undefined, {minLength: 10})).toBe(
        'length should be minimum 10'
      );
    });
  });
});

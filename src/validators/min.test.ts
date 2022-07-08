import min from './min';

describe('min', () => {
  describe('string', () => {
    it('should return undefined for valid numbers', () => {
      expect(min(10, {min: 10})).toBe(undefined);
    });

    it('should return error message for invalid numbers', () => {
      expect(min(0, {min: 10})).toBe('should be minimum 10');
    });

    it('should return undefined when no input is undefined', () => {
      expect(min(undefined, {min: 10})).toBe('should be minimum 10');
    });
  });
});

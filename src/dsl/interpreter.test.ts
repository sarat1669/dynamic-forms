import interpret from './interpreter';

describe('interpret', () => {
  describe('string as rule', () => {
    it('should return the same string', () => {
      expect(interpret('hello', {}, {})).toBe('hello');
    });
  });

  describe('null', () => {
    it('should return null', () => {
      expect(interpret({type: 'null', arguments: []}, {}, {})).toBe(null);
    });
  });

  describe('undefined', () => {
    it('should return undefined', () => {
      expect(interpret({type: 'undefined', arguments: []}, {}, {})).toBe(
        undefined
      );
    });
  });

  describe('true', () => {
    it('should return true', () => {
      expect(interpret({type: 'true', arguments: []}, {}, {})).toBe(true);
    });
  });

  describe('false', () => {
    it('should return false', () => {
      expect(interpret({type: 'false', arguments: []}, {}, {})).toBe(false);
    });
  });

  describe('integer', () => {
    it('should return integer', () => {
      expect(interpret({type: 'integer', arguments: ['1669']}, {}, {})).toBe(
        1669
      );
    });

    it('should return NaN for other characters', () => {
      expect(interpret({type: 'integer', arguments: ['a']}, {}, {})).toBe(NaN);
    });
  });

  describe('float', () => {
    it('should return float', () => {
      expect(interpret({type: 'float', arguments: ['16.69']}, {}, {})).toBe(
        16.69
      );
    });

    it('should return NaN for other characters', () => {
      expect(interpret({type: 'float', arguments: ['a']}, {}, {})).toBe(NaN);
    });
  });

  describe('string', () => {
    it('should return string', () => {
      expect(interpret({type: 'string', arguments: ['Sarat']}, {}, {})).toBe(
        'Sarat'
      );
    });
  });

  describe('!', () => {
    it('should return false for true as input', () => {
      expect(
        interpret(
          {type: '!', arguments: [{type: 'true', arguments: []}]},
          {},
          {}
        )
      ).toBe(false);
    });

    it('should return false given a string', () => {
      expect(
        interpret(
          {type: '!', arguments: [{type: 'string', arguments: ['1669']}]},
          {},
          {}
        )
      ).toBe(false);
    });

    it('should return true given 0', () => {
      expect(
        interpret(
          {type: '!', arguments: [{type: 'integer', arguments: ['0']}]},
          {},
          {}
        )
      ).toBe(true);
    });

    it('should return true given null', () => {
      expect(
        interpret(
          {type: '!', arguments: [{type: 'null', arguments: []}]},
          {},
          {}
        )
      ).toBe(true);
    });
  });

  describe('+', () => {
    it('should sum two integers', () => {
      expect(
        interpret(
          {
            type: '+',
            arguments: [
              {type: 'integer', arguments: ['200']},
              {type: 'integer', arguments: ['7']},
            ],
          },
          {},
          {}
        )
      ).toBe(1669);
    });
  });

  it('should sum two floats', () => {
    expect(
      interpret(
        {
          type: '+',
          arguments: [
            {type: 'float', arguments: ['199.9']},
            {type: 'float', arguments: ['7.1']},
          ],
        },
        {},
        {}
      )
    ).toBe(1669.0);
  });

  it('should concat two strings', () => {
    expect(
      interpret(
        {
          type: '+',
          arguments: [
            {type: 'string', arguments: ['20']},
            {type: 'string', arguments: ['7']},
          ],
        },
        {},
        {}
      )
    ).toBe('1669');
  });

  it('should concat a string and a number into string', () => {
    expect(
      interpret(
        {
          type: '+',
          arguments: [
            {type: 'string', arguments: ['20']},
            {type: 'integer', arguments: ['7']},
          ],
        },
        {},
        {}
      )
    ).toBe('1669');
  });

  describe('-', () => {
    it('should return the difference of two integers', () => {
      expect(
        interpret(
          {
            type: '-',
            arguments: [
              {type: 'integer', arguments: ['210']},
              {type: 'integer', arguments: ['3']},
            ],
          },
          {},
          {}
        )
      ).toBe(1669);
    });
  });

  it('should return the difference of two floats', () => {
    expect(
      interpret(
        {
          type: '-',
          arguments: [
            {type: 'float', arguments: ['209.9']},
            {type: 'float', arguments: ['2.9']},
          ],
        },
        {},
        {}
      )
    ).toBe(1669.0);
  });

  describe('abs', () => {
    it('should return abs value of a negative integer', () => {
      expect(
        interpret(
          {
            type: 'abs',
            arguments: [{type: 'integer', arguments: ['-1669']}],
          },
          {},
          {}
        )
      ).toBe(1669);
    });

    it('should return abs value of a positive integer', () => {
      expect(
        interpret(
          {
            type: 'abs',
            arguments: [{type: 'integer', arguments: ['1669']}],
          },
          {},
          {}
        )
      ).toBe(1669);
    });

    it('should return abs value of a negative float', () => {
      expect(
        interpret(
          {
            type: 'abs',
            arguments: [{type: 'float', arguments: ['-206.99']}],
          },
          {},
          {}
        )
      ).toBe(206.99);
    });

    it('should return abs value of a positive float', () => {
      expect(
        interpret(
          {
            type: 'abs',
            arguments: [{type: 'float', arguments: ['206.98']}],
          },
          {},
          {}
        )
      ).toBe(206.98);
    });
  });

  describe('!=', () => {
    it('should check for in equality', () => {
      expect(
        interpret(
          {
            type: '!=',
            arguments: [
              {type: 'true', arguments: []},
              {type: 'false', arguments: []},
            ],
          },
          {},
          {}
        )
      ).toBe(true);
    });
  });

  describe('&&', () => {
    it('should return true when both sides evaluate to true', () => {
      expect(
        interpret(
          {
            type: '&&',
            arguments: [
              {type: 'true', arguments: []},
              {type: 'true', arguments: []},
            ],
          },
          {},
          {}
        )
      ).toBe(true);
    });

    it('should return false when either side evaluates to false', () => {
      expect(
        interpret(
          {
            type: '&&',
            arguments: [
              {type: 'true', arguments: []},
              {type: 'false', arguments: []},
            ],
          },
          {},
          {}
        )
      ).toBe(false);
    });
  });

  describe('||', () => {
    it('should return true when either sides evaluate to true', () => {
      expect(
        interpret(
          {
            type: '||',
            arguments: [
              {type: 'true', arguments: []},
              {type: 'false', arguments: []},
            ],
          },
          {},
          {}
        )
      ).toBe(true);
    });

    it('should return false when both sides evaluates to false', () => {
      expect(
        interpret(
          {
            type: '||',
            arguments: [
              {type: 'false', arguments: []},
              {type: 'false', arguments: []},
            ],
          },
          {},
          {}
        )
      ).toBe(false);
    });
  });

  describe('*', () => {
    it('should return product of two integers', () => {
      expect(
        interpret(
          {
            type: '*',
            arguments: [
              {type: 'integer', arguments: ['200']},
              {type: 'integer', arguments: ['7']},
            ],
          },
          {},
          {}
        )
      ).toBe(1400);
    });

    it('should return product of two floats', () => {
      expect(
        interpret(
          {
            type: '*',
            arguments: [
              {type: 'float', arguments: ['12.1']},
              {type: 'float', arguments: ['11.2']},
            ],
          },
          {},
          {}
        )
      ).toBe(135.51999999999998);
    });
  });

  describe('++', () => {
    it('should increment an integer', () => {
      expect(
        interpret(
          {
            type: '++',
            arguments: [{type: 'integer', arguments: ['206']}],
          },
          {},
          {}
        )
      ).toBe(1669);
    });

    it('should increment a float', () => {
      expect(
        interpret(
          {
            type: '++',
            arguments: [{type: 'float', arguments: ['12.1']}],
          },
          {},
          {}
        )
      ).toBe(13.1);
    });
  });

  describe('--', () => {
    it('should decrement an integer', () => {
      expect(
        interpret(
          {
            type: '--',
            arguments: [{type: 'integer', arguments: ['208']}],
          },
          {},
          {}
        )
      ).toBe(1669);
    });

    it('should decrement a float', () => {
      expect(
        interpret(
          {
            type: '--',
            arguments: [{type: 'float', arguments: ['14.1']}],
          },
          {},
          {}
        )
      ).toBe(13.1);
    });
  });

  describe('/', () => {
    it('should divide two integers and return the quotient', () => {
      expect(
        interpret(
          {
            type: '/',
            arguments: [
              {type: 'integer', arguments: ['208']},
              {type: 'integer', arguments: ['2']},
            ],
          },
          {},
          {}
        )
      ).toBe(104);
    });

    it('should divide two floats and return the quotient', () => {
      expect(
        interpret(
          {
            type: '/',
            arguments: [
              {type: 'float', arguments: ['14.2']},
              {type: 'float', arguments: ['2.0']},
            ],
          },
          {},
          {}
        )
      ).toBe(7.1);
    });
  });

  describe('<', () => {
    it('should compare two values', () => {
      expect(
        interpret(
          {
            type: '<',
            arguments: [
              {type: 'float', arguments: ['14.2']},
              {type: 'float', arguments: ['2.0']},
            ],
          },
          {},
          {}
        )
      ).toBe(false);
    });
  });

  describe('>', () => {
    it('should compare two values', () => {
      expect(
        interpret(
          {
            type: '>',
            arguments: [
              {type: 'float', arguments: ['14.2']},
              {type: 'float', arguments: ['2.0']},
            ],
          },
          {},
          {}
        )
      ).toBe(true);
    });
  });

  describe('<=', () => {
    it('should compare two values', () => {
      expect(
        interpret(
          {
            type: '<=',
            arguments: [
              {type: 'float', arguments: ['14.2']},
              {type: 'float', arguments: ['2.0']},
            ],
          },
          {},
          {}
        )
      ).toBe(false);
    });

    it('should compare two equal values', () => {
      expect(
        interpret(
          {
            type: '<=',
            arguments: [
              {type: 'float', arguments: ['14.2']},
              {type: 'float', arguments: ['14.2']},
            ],
          },
          {},
          {}
        )
      ).toBe(true);
    });
  });

  describe('<>', () => {
    it('should concat two strings', () => {
      expect(
        interpret(
          {
            type: '<>',
            arguments: [
              {type: 'string', arguments: ['14.2']},
              {type: 'string', arguments: ['2.0']},
            ],
          },
          {},
          {}
        )
      ).toBe('14.22.0');
    });
  });

  describe('==', () => {
    it('should compare two values', () => {
      expect(
        interpret(
          {
            type: '==',
            arguments: [
              {type: 'float', arguments: ['14.2']},
              {type: 'float', arguments: ['2.0']},
            ],
          },
          {},
          {}
        )
      ).toBe(false);
    });

    it('should compare two equal values', () => {
      expect(
        interpret(
          {
            type: '==',
            arguments: [
              {type: 'float', arguments: ['14.2']},
              {type: 'float', arguments: ['14.2']},
            ],
          },
          {},
          {}
        )
      ).toBe(true);
    });
  });

  describe('>=', () => {
    it('should compare two values', () => {
      expect(
        interpret(
          {
            type: '>=',
            arguments: [
              {type: 'float', arguments: ['14.2']},
              {type: 'float', arguments: ['2.0']},
            ],
          },
          {},
          {}
        )
      ).toBe(true);
    });

    it('should compare two equal values', () => {
      expect(
        interpret(
          {
            type: '>=',
            arguments: [
              {type: 'float', arguments: ['14.2']},
              {type: 'float', arguments: ['14.2']},
            ],
          },
          {},
          {}
        )
      ).toBe(true);
    });
  });

  describe('rem', () => {
    it('should divide two integers and return the remainder', () => {
      expect(
        interpret(
          {
            type: 'rem',
            arguments: [
              {type: 'integer', arguments: ['208']},
              {type: 'integer', arguments: ['2']},
            ],
          },
          {},
          {}
        )
      ).toBe(0);
    });

    it('should divide two floats and return the remainder', () => {
      expect(
        interpret(
          {
            type: 'rem',
            arguments: [
              {type: 'float', arguments: ['14.2']},
              {type: 'float', arguments: ['2.0']},
            ],
          },
          {},
          {}
        )
      ).toBe(0.1999999999999993);
    });
  });

  describe('includes', () => {
    it('should check if element exists in an array', () => {
      expect(
        interpret(
          {
            type: 'includes',
            arguments: [
              {
                type: 'list',
                arguments: [
                  {type: 'float', arguments: ['14.2']},
                  {type: 'integer', arguments: ['2']},
                ],
              },
              {type: 'float', arguments: ['14.2']},
            ],
          },
          {},
          {}
        )
      ).toBe(true);
    });

    it('should return false if no array is given', () => {
      expect(
        interpret(
          {
            type: 'includes',
            arguments: [
              {
                type: 'undefined',
                arguments: [],
              },
              {type: 'float', arguments: ['14.2']},
            ],
          },
          {},
          {}
        )
      ).toBe(false);
    });
  });

  describe('list', () => {
    it('should return an array', () => {
      expect(
        interpret(
          {
            type: 'list',
            arguments: [
              {type: 'float', arguments: ['14.2']},
              {type: 'integer', arguments: ['2']},
            ],
          },
          {},
          {}
        )
      ).toMatchObject([14.2, 2]);
    });
  });

  describe('ternary', () => {
    it('should return evaluated second argument when true', () => {
      expect(
        interpret(
          {
            type: 'ternary',
            arguments: [
              {type: 'true', arguments: []},
              {type: 'float', arguments: ['14.2']},
              {type: 'integer', arguments: ['2']},
            ],
          },
          {},
          {}
        )
      ).toBe(14.2);
    });

    it('should return evaluated thrid argument when false', () => {
      expect(
        interpret(
          {
            type: 'ternary',
            arguments: [
              {type: 'false', arguments: []},
              {type: 'float', arguments: ['14.2']},
              {type: 'integer', arguments: ['2']},
            ],
          },
          {},
          {}
        )
      ).toBe(2);
    });
  });

  describe('sum', () => {
    it('should return sum of numbers in an array', () => {
      expect(
        interpret(
          {
            type: 'sum',
            arguments: [
              {
                type: 'list',
                arguments: [
                  {type: 'float', arguments: ['14.2']},
                  {type: 'integer', arguments: ['2']},
                ],
              },
            ],
          },
          {},
          {}
        )
      ).toBe(16.2);
    });
  });

  describe('object', () => {
    it('should throw error when entries are invalid', () => {
      expect(() =>
        interpret(
          {
            type: 'object',
            arguments: [
              {type: 'list', arguments: [{type: 'true', arguments: []}]},
            ],
          },
          {},
          {}
        )
      ).toThrow('Iterator value true is not an entry object');
    });

    it('should return object using entries', () => {
      expect(
        interpret(
          {
            type: 'object',
            arguments: [
              {
                type: 'list',
                arguments: [
                  {
                    type: 'list',
                    arguments: [
                      {type: 'string', arguments: ['hello']},
                      {type: 'string', arguments: ['world']},
                    ],
                  },
                  {
                    type: 'list',
                    arguments: [
                      {type: 'string', arguments: ['marco']},
                      {
                        type: 'object',
                        arguments: [
                          {
                            type: 'list',
                            arguments: [
                              {
                                type: 'list',
                                arguments: [
                                  {type: 'string', arguments: ['firstName']},
                                  {type: 'string', arguments: ['Marco']},
                                ],
                              },
                              {
                                type: 'list',
                                arguments: [
                                  {type: 'string', arguments: ['lastName']},
                                  {type: 'string', arguments: ['Polo']},
                                ],
                              },
                              {
                                type: 'list',
                                arguments: [
                                  {
                                    type: 'string',
                                    arguments: ['favouriteNumbers'],
                                  },
                                  {
                                    type: 'list',
                                    arguments: [
                                      {type: 'integer', arguments: ['1']},
                                      {type: 'integer', arguments: ['9']},
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {},
          {}
        )
      ).toMatchObject({
        hello: 'world',
        marco: {
          firstName: 'Marco',
          lastName: 'Polo',
          favouriteNumbers: [1, 9],
        },
      });
    });
  });

  describe('context', () => {
    it('should retrieve value from context', () => {
      expect(
        interpret(
          {
            type: 'context',
            arguments: [{type: 'string', arguments: ['name']}],
          },
          {},
          {name: 'Sarat'}
        )
      ).toBe('Sarat');
    });
  });

  describe('fact', () => {
    it('should retrieve value from state', () => {
      expect(
        interpret(
          {
            type: 'fact',
            arguments: [{type: 'string', arguments: ['name']}],
          },
          {name: 'Sarat'},
          {}
        )
      ).toBe('Sarat');
    });
  });

  describe('invalid AST', () => {
    it('should throw an error', () => {
      expect(() => interpret(JSON.parse('{}'), {}, {})).toThrow('Invalid AST');
    });
  });
});

import {
  isInput,
  filterState,
  filterFormFields,
  determineStateAndFormFields,
} from './utils';

describe('isInput', () => {
  it("should return true for input FormField's", () => {
    expect(
      isInput({
        type: 'input',
        path: [{type: 'true', arguments: []}],
        properties: {
          type: {type: 'static', value: '123'},
          required: {type: 'static', value: false},
        },
      })
    ).toBe(true);
  });

  it("should return false for readonly FormField's", () => {
    expect(
      isInput({
        type: 'readonly',
        properties: {
          type: {type: 'static', value: '123'},
          required: {type: 'static', value: false},
        },
      })
    ).toBe(false);
  });
});

describe('filterState', () => {
  it("remove all properties from state, whose path isn't defined by FormField's", () => {
    expect(
      filterState(
        [
          {
            type: 'input',
            path: [{type: 'string', arguments: ['hello']}],
            properties: {
              type: {type: 'static', value: '123'},
              required: {type: 'static', value: false},
            },
          },
          {
            type: 'readonly',
            properties: {
              type: {type: 'static', value: '123'},
              required: {type: 'static', value: false},
            },
          },
        ],
        {
          hello: 'world',
          pitter: 'patter',
          rain: 'drops',
        },
        {}
      )
    ).toMatchObject({hello: 'world'});
  });
});

describe('filterFormFields', () => {
  it("filter FormField's by their isVisibility", () => {
    expect(
      filterFormFields(
        [
          {
            field: {
              type: 'input',
              path: [{type: 'string', arguments: ['hello']}],
              properties: {
                type: {type: 'static', value: '123'},
                required: {type: 'static', value: false},
              },
            },
            isVisible: {type: 'true', arguments: []},
          },
          {
            field: {
              type: 'input',
              path: [{type: 'string', arguments: ['world']}],
              properties: {
                type: {type: 'static', value: '123'},
                required: {type: 'static', value: false},
              },
            },
            isVisible: {type: 'false', arguments: []},
          },
        ],
        {
          hello: 'world',
          pitter: 'patter',
          rain: 'drops',
        },
        {}
      )
    ).toMatchObject([
      {
        type: 'input',
        path: [{type: 'string', arguments: ['hello']}],
        properties: {
          type: {type: 'static', value: '123'},
          required: {type: 'static', value: false},
        },
      },
    ]);
  });
});

describe('determineStateAndFormFields', () => {
  expect(
    determineStateAndFormFields({hello: true, world: false}, {}, [
      {
        field: {
          type: 'input',
          path: [{type: 'string', arguments: ['hello']}],
          properties: {
            type: {type: 'static', value: '123'},
            required: {type: 'static', value: false},
          },
        },
        isVisible: {
          type: '==',
          arguments: [
            {
              type: 'fact',
              arguments: [{type: 'string', arguments: ['hello']}],
            },
            {type: 'true', arguments: []},
          ],
        },
      },
      {
        field: {
          type: 'input',
          path: [{type: 'string', arguments: ['world']}],
          properties: {
            type: {type: 'static', value: '123'},
            required: {type: 'static', value: false},
          },
        },
        isVisible: {
          type: '==',
          arguments: [
            {
              type: 'fact',
              arguments: [{type: 'string', arguments: ['world']}],
            },
            {type: 'true', arguments: []},
          ],
        },
      },
    ])
  ).toMatchObject([
    {hello: true},
    [
      {
        type: 'input',
        path: [{type: 'string', arguments: ['hello']}],
        properties: {
          type: {type: 'static', value: '123'},
          required: {type: 'static', value: false},
        },
      },
    ],
  ]);
});

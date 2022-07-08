import update from './updater';

describe('update', () => {
  let object: any;

  beforeEach(() => {
    object = {
      id: 1,
      name: 'Sarat',
      email: 'sarat1669@gmail.com',
      office: {
        floor: 1,
        seat: 101,
        city: 'Bangalore',
      },
      phone: [
        {
          type: 'work',
          isdCode: '+91',
          number: '9876543210',
        },
        {
          type: 'landline',
          isdCode: '+91',
          stateCode: '080',
          number: '76543210',
        },
      ],
    };
  });

  it('should create an object if none is given', () => {
    expect(update(null, ['hello'], 'world')).toMatchObject({hello: 'world'});
  });

  it('should create a nested object if none is given', () => {
    expect(update(null, ['hello', 'kitty'], 'world')).toMatchObject({
      hello: {kitty: 'world'},
    });
  });

  it('updates data in an object', () => {
    expect(update({}, ['hello'], 'world')).toMatchObject({hello: 'world'});
  });

  it('updates data in a nested object', () => {
    expect(update(object, ['office', 'floor'], 2)).toMatchObject({
      id: 1,
      name: 'Sarat',
      email: 'sarat1669@gmail.com',
      office: {
        floor: 2,
        seat: 101,
        city: 'Bangalore',
      },
      phone: [
        {
          type: 'work',
          isdCode: '+91',
          number: '9876543210',
        },
        {
          type: 'landline',
          isdCode: '+91',
          stateCode: '080',
          number: '76543210',
        },
      ],
    });
  });

  it('updates data from an array', () => {
    expect(update(object, ['phone', '1', 'stateCode'], '040')).toMatchObject({
      id: 1,
      name: 'Sarat',
      email: 'sarat1669@gmail.com',
      office: {
        floor: 1,
        seat: 101,
        city: 'Bangalore',
      },
      phone: [
        {
          type: 'work',
          isdCode: '+91',
          number: '9876543210',
        },
        {
          type: 'landline',
          isdCode: '+91',
          stateCode: '040',
          number: '76543210',
        },
      ],
    });
  });

  it('should return value as the new object for empty path', () => {
    expect(update(object, [], 'world')).toBe('world');
  });
});

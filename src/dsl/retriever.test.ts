import retrieve from './retriever';

describe('retrieve', () => {
  const object = {
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

  it('should return undefined if object is null', () => {
    expect(retrieve(null, ['hello', 'world'])).toBe(undefined);
  });

  it('retrieves data from an object', () => {
    expect(retrieve(object, ['name'])).toBe(object.name);
  });

  it('retrieves data from a nested object', () => {
    expect(retrieve(object, ['office', 'city'])).toBe(object.office.city);
  });

  it('retrieves data from an array', () => {
    expect(retrieve(object, ['phone', '1', 'stateCode'])).toBe(
      object.phone[1].stateCode
    );
  });

  it('should return undefined for non existent path', () => {
    expect(retrieve(object, ['hello', 'world'])).toBe(undefined);
  });
});

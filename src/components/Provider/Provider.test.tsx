import React, {useContext} from 'react';
import {act, render, screen} from '@testing-library/react';

import Provider from './Provider';
import Context, {ContextValue} from '../../Context';
import {InputFormField, SchemaItem} from '../../../types';

const schema = [
  {
    field: {
      type: 'input',
      path: [{type: 'string', arguments: ['input1']}],
      properties: {
        type: {type: 'static', value: '123'},
        required: {type: 'static', value: false},
      },
    },
    isVisible: {
      type: '!=',
      arguments: [
        {
          type: 'fact',
          arguments: [{type: 'string', arguments: ['input1']}],
        },
        {type: 'undefined', arguments: []},
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
        value: {
          type: 'interpreted',
          value: {type: 'string', arguments: ['123']},
        },
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
] as SchemaItem[];

const schema2 = [
  {
    isVisible: {type: 'true', arguments: []},
    field: {
      type: 'input',
      validators: ['minLength', 'maxLength'],
      path: [{type: 'string', arguments: ['firstName']}],
      properties: {
        minLength: {type: 'static', value: 3},
        maxLength: {type: 'static', value: 7},
        type: {type: 'static', value: 'string'},
        required: {type: 'static', value: true},
      },
    },
  },
  {
    isVisible: {type: 'true', arguments: []},
    field: {
      type: 'input',
      path: [{type: 'string', arguments: ['lastName']}],
      properties: {
        type: {type: 'static', value: 'string'},
        required: {type: 'static', value: true},
      },
    },
  },
  {
    isVisible: {type: 'true', arguments: []},
    field: {
      type: 'input',
      path: [{type: 'string', arguments: ['middleName']}],
      properties: {
        type: {type: 'static', value: 'string'},
        required: {type: 'static', value: false},
      },
    },
  },
] as SchemaItem[];

describe('Provider', () => {
  it("should render it's children", () => {
    render(<Provider schema={schema}>Hello World</Provider>);
    expect(screen.getByText(/Hello World/i)).toBeTruthy();
  });

  describe('with schema 1', () => {
    describe('Context', () => {
      let onEvent: jest.MockedFunction<any>, context: ContextValue;

      const Sample = () => {
        const currentContext = useContext(Context);
        context = currentContext;
        return <div>Hello</div>;
      };

      beforeEach(() => {
        onEvent = jest.fn();

        render(
          <Provider
            schema={schema}
            onEvent={onEvent}
            defaultValue={{hello: true, input1: 'Hello'}}
          >
            <Sample />
          </Provider>
        );
      });

      describe('getValue', () => {
        it('should fetch the value', () => {
          expect(context.getValue(schema[0].field as InputFormField)).toBe(
            'Hello'
          );
        });

        it('should return interpreted value if value property is set', () => {
          expect(context.getValue(schema[1].field as InputFormField)).toBe(
            '123'
          );
        });
      });

      describe('setValue', () => {
        it('should set the value', async () => {
          const field = schema[0].field as InputFormField;
          act(() => context.setValue(field, 'Hola!'));
          await Promise.resolve();
          expect(context.getValue(field)).toBe('Hola!');
        });

        it('should set the latest value', async () => {
          const field = schema[0].field as InputFormField;
          act(() => {
            context.setValue(field, 'Hola!');
            context.setValue(field, 'Yolo!');
          });
          await Promise.resolve();
          expect(context.getValue(field)).toBe('Yolo!');
        });
      });

      describe('onEvent', () => {
        it('should emit when setValue is called', () => {
          const field = schema[0].field as InputFormField;
          act(() => context.setValue(field, 'Hola!'));
          expect(onEvent).toHaveBeenCalledWith(
            field,
            {input1: 'Hola!'},
            'change',
            'Hola!'
          );
        });

        it('should emit when emitEvent is called', () => {
          const field = schema[0].field as InputFormField;
          act(() => context.emitEvent(field, 'Marco', 'Polo'));
          expect(onEvent).toHaveBeenCalledWith(
            field,
            {input1: 'Hello'},
            'Marco',
            'Polo'
          );
        });
      });

      describe('getProperties', () => {
        it('should return static properties when getProperties is called', () => {
          const properties = context.getProperties(schema[0].field);
          expect(properties).toMatchObject({type: '123', required: false});
        });

        it('should return interpreted properties when getProperties is called', () => {
          const properties = context.getProperties(schema[1].field);
          expect(properties).toMatchObject({
            type: '123',
            value: '123',
            required: false,
          });
        });
      });
    });
  });

  describe('with schema 2', () => {
    describe('Context', () => {
      let onEvent: jest.MockedFunction<any>, context: ContextValue;

      const Sample = () => {
        const currentContext = useContext(Context);
        context = currentContext;
        return <div>Hello</div>;
      };

      beforeEach(() => {
        onEvent = jest.fn();

        render(
          <Provider
            validators={{}}
            schema={schema2}
            onEvent={onEvent}
            defaultValue={{firstName: undefined, lastName: 'Balla'}}
          >
            <Sample />
          </Provider>
        );
      });

      describe('getError', () => {
        it('should return error when required field is not present', () => {
          const field = schema2[0].field as InputFormField;
          const error = context.getError(field);
          expect(error).toBeDefined();
          expect(error).toMatchObject({
            isVisible: false,
            message: 'This is a required field',
          });
        });

        it('should not return error when required field is present', () => {
          const field = schema2[1].field as InputFormField;
          const error = context.getError(field);
          expect(error).toBeDefined();
          expect(error).toMatchObject({isVisible: false, message: undefined});
        });

        it('should return error when required field is present but empty', async () => {
          const field = schema2[0].field as InputFormField;
          act(() => context.setValue(field, ''));
          await Promise.resolve();
          const error = context.getError(field);
          expect(error).toMatchObject({
            isVisible: true,
            message: 'This is a required field',
          });
        });

        it('should return error which is visble onBlur', async () => {
          const field = schema2[0].field as InputFormField;
          act(() => context.onBlur(field));
          await Promise.resolve();
          const error = context.getError(field);
          expect(error).toBeDefined();
          expect(error).toMatchObject({
            isVisible: true,
            message: 'This is a required field',
          });
        });
      });

      describe('isValid', () => {
        it('it should be false when required fields are not present', () => {
          expect(context.isValid).toBe(false);
        });

        it('it should be true when required fields are present', async () => {
          const field = schema2[0].field as InputFormField;
          act(() => context.setValue(field, 'Sarat Chandra'));
          await Promise.resolve();
          let error = context.getError(field);
          expect(error).toBeDefined();
          expect(error).toMatchObject({
            isVisible: true,
            message: 'length should be maximum 7',
          });
          expect(context.isValid).toBe(false);
          act(() => context.setValue(field, 'Sa'));
          await Promise.resolve();
          error = context.getError(field);
          expect(error).toBeDefined();
          expect(error).toMatchObject({
            isVisible: true,
            message: 'length should be minimum 3',
          });
          expect(context.isValid).toBe(false);
          act(() => context.setValue(field, 'Sarat'));
          await Promise.resolve();
          error = context.getError(field);
          expect(error).toBeDefined();
          expect(error).toMatchObject({
            isVisible: true,
            message: undefined,
          });
          expect(context.isValid).toBe(true);
        });
      });

      describe('setErrorsVisible', () => {
        it('should set all errors to be visible', async () => {
          const field = schema2[0].field as InputFormField;
          let error = context.getError(field);
          expect(error).toBeDefined();
          expect(error?.isVisible).toBe(false);
          const field2 = schema2[1].field as InputFormField;
          let error2 = context.getError(field2);
          expect(error2).toBeDefined();
          expect(error2?.isVisible).toBe(false);
          act(() => context.setErrorsVisible());
          await Promise.resolve();
          error = context.getError(field);
          expect(error).toBeDefined();
          expect(error?.isVisible).toBe(true);
          error2 = context.getError(field2);
          expect(error2).toBeDefined();
          expect(error2?.isVisible).toBe(true);
        });
      });
    });
  });
});

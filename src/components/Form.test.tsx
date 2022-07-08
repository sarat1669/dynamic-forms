import React, {useContext} from 'react';
import {act, render, screen} from '@testing-library/react';

import Form from './Form';
import Context, {ContextValue} from '../Context';
import {InputFormField, SchemaItem} from '../../types';

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

const onEvent = jest.fn();
let context: ContextValue;
const onChange = jest.fn();

const Sample = () => {
  const currentContext = useContext(Context);
  context = currentContext;
  return <div>Hello World</div>;
};

describe('Form', () => {
  beforeEach(() => {
    render(
      <Form
        schema={schema}
        onEvent={onEvent}
        onChange={onChange}
        defaultValue={{hello: true, input1: 'Hello'}}
      >
        <Sample />
      </Form>
    );
  });

  it("should render it's children", () => {
    expect(screen.getByText(/Hello World/i)).toBeTruthy();
  });

  describe('onEvent', () => {
    it('should emit when setValue is called', () => {
      const field = schema[0].field as InputFormField;
      act(() => context.setValue(field, 'Hola!'));
      expect(onChange).toHaveBeenCalledWith({input1: 'Hola!'});
      expect(onEvent).toHaveBeenCalledWith(field, 'change', 'Hola!');
    });

    it('should emit when emitEvent is called', () => {
      const field = schema[0].field as InputFormField;
      act(() => context.emitEvent(field, 'Marco', 'Polo'));
      expect(onEvent).toHaveBeenCalledWith(field, 'Marco', 'Polo');
    });
  });
});

describe('Custom Form', () => {
  it('should render a custom component', () => {
    render(
      <Form
        as="select"
        name="hello"
        schema={schema}
        onEvent={onEvent}
        onChange={onChange}
        defaultValue={{hello: true, input1: 'Hello'}}
      >
        Hello
      </Form>
    );

    const span = screen.getByRole('combobox', {name: ''});
    expect(span).toBeInTheDocument();
  });
});

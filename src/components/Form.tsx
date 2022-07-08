import React, {ReactNode} from 'react';

import Provider from './Provider/Provider';
import {Schema, FormField, OverwritableType} from '../../types';

export interface FormProps<T> {
  as?: T;
  context?: any;
  schema: Schema;
  defaultValue?: any;
  children: ReactNode;
  onChange?: (state: any) => void;
  onEvent?: (formField: FormField, eventName: string, eventData?: any) => void;
  validators?: Record<
    string,
    (value: any, properties: Record<any, any>) => string | undefined
  >;
}

export default function Form<T extends React.ElementType>({
  as,
  schema,
  onEvent,
  onChange,
  children,
  context = {},
  validators = {},
  defaultValue = {},
  ...otherProps
}: OverwritableType<FormProps<T>, T>) {
  const handleEvent = (
    formField: FormField,
    state: any,
    eventName: string,
    eventData?: any
  ) => {
    if (eventName === 'change') onChange && onChange(state);
    onEvent && onEvent(formField, eventName, eventData);
  };

  const Renderer = as ? as : 'form';

  return (
    <Provider
      schema={schema}
      context={context}
      onEvent={handleEvent}
      validators={validators}
      defaultValue={defaultValue}
    >
      <Renderer {...otherProps}>{children}</Renderer>
    </Provider>
  );
}

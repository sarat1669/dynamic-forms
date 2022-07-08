import {createContext} from 'react';
import {FormField, InputFormField} from '../types';

export type ContextValue = {
  isValid: boolean;
  formFields?: FormField[];
  setErrorsVisible: () => void;
  onBlur: (inputFormField: InputFormField) => void;
  getValue: (inputFormField: InputFormField) => any;
  getProperties: (formField: FormField) => Record<any, any>;
  setValue: (inputFormField: InputFormField, value: any) => void;
  emitEvent: (formField: FormField, eventName: string, eventData: any) => void;
  getError: (
    inputFormField: InputFormField
  ) => {isVisible: boolean; message: string} | undefined;
};

const Context = createContext<ContextValue>({
  isValid: false,
  formFields: undefined,
  setErrorsVisible: () => {},
  onBlur: (_inputFormField: InputFormField): any => {},
  getValue: (_inputFormField: InputFormField): any => {},
  getProperties: (_formField: FormField): Record<any, any> => ({}),
  setValue: (_inputFormField: InputFormField, _value: any): any => {},
  getError: (
    _inputFormField: InputFormField
  ): {isVisible: boolean; message: string} | undefined => undefined,
  emitEvent: (
    _formField: FormField,
    _eventName: string,
    _eventData: any
  ): void => {},
});

export default Context;

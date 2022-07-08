import React, {useState, ReactNode} from 'react';
import structuredClone from '@ungap/structured-clone';

import Context from '../../Context';
import update from '../../dsl/updater';
import retrieve from '../../dsl/retriever';
import interpret from '../../dsl/interpreter';
import * as defaultValidators from '../../validators';
import {determineStateAndFormFields, isInput} from './utils';
import {FormField, InputFormField, Schema, Value} from '../../../types';

export type ProviderProps = {
  context?: any;
  schema: Schema;
  defaultValue?: any;
  children: ReactNode;
  validators?: Record<
    string,
    (value: any, properties: Record<any, any>) => string | undefined
  >;
  onEvent?: (
    formField: FormField,
    state: any,
    eventName: string,
    eventData?: any
  ) => void;
};

export default function Provider({
  schema,
  onEvent,
  children,
  // Context is a read-only store for form elements
  // Can be used to store user details, roles, etc
  context = {},
  defaultValue = {},
  validators: customValidators = {},
}: ProviderProps) {
  // The actual state of the form is stored in this
  // This is analogous to FormData
  const [state, setState] = useState(defaultValue);
  const [errors, setErrors] = useState({});

  const validators: Record<
    any,
    (value: any, properties: Record<any, any>) => string | undefined
  > = {...defaultValidators, ...customValidators};

  // eslint-disable-next-line prefer-const
  let [currentState, formFields] = determineStateAndFormFields(
    state,
    context,
    schema
  );

  const emitEvent = (
    formField: FormField,
    eventName: string,
    eventData?: any
  ) => {
    onEvent && onEvent(formField, currentState, eventName, eventData);
  };

  // Handle change can be called multiple times by different useEffects.
  const handleOnChange = (facts: string[], value: any) => {
    currentState = update(structuredClone(currentState), facts, value);
    setState(currentState);
    return currentState;
  };

  const getPropertyValue = (value?: Value) => {
    if (!value) return undefined;
    if (value.type === 'static') {
      return value.value;
    } else {
      return interpret(value.value, currentState, context);
    }
  };

  // Returns the value of the field set in the state
  const getValue = (inputFormField: InputFormField) => {
    if (inputFormField.properties?.value) {
      return interpret(
        inputFormField.properties.value.value,
        currentState,
        context
      );
    } else {
      return retrieve(
        currentState,
        inputFormField.path.map((x) => interpret(x, currentState, context))
      );
    }
  };

  // Evaluates the properties of the field and returns an object
  const getProperties = (formField: FormField) => {
    return Object.entries(formField.properties).reduce((acc, [key, value]) => {
      acc[key] = getPropertyValue(value as Value);
      return acc;
    }, {} as Record<any, any>);
  };

  const determineErrors = (
    currentState: any,
    currentErrors: any,
    inputFormField: InputFormField,
    setVisible: boolean = false
  ): any => {
    const properties = getProperties(inputFormField);
    const isRequired = properties?.required;
    const errorMessage = properties?.errorMessage;

    const facts = inputFormField.path.map((x) =>
      interpret(x, currentState, context)
    );
    const value = getValue(inputFormField);
    const isVisible = setVisible
      ? true
      : retrieve(errors, facts)?.isVisible || false;
    if (
      !isRequired ||
      (value !== null &&
        value !== undefined &&
        !(typeof value === 'string' && value === '') &&
        !(Array.isArray(value) && value.length === 0) &&
        !(typeof value === 'object' && Object.entries(value).length === 0)) ||
      typeof value === 'number' ||
      typeof value === 'bigint' ||
      typeof value === 'boolean'
    )
      return update(currentErrors, facts, {
        isVisible,
        message: inputFormField.validators
          ?.map((validator) => {
            if (validators[validator]) {
              return validators[validator](value, properties);
            } else {
              console.warn(
                `Validator '${validator}' not registered. '${validator}' validation is being skipped`
              );
              return undefined;
            }
          })
          .filter((e) => e !== undefined)[0],
      });
    return update(currentErrors, facts, {
      isVisible,
      message: errorMessage || 'This is a required field',
    });
  };

  const currentErrors = formFields
    .filter(isInput)
    .reduce(
      (errors, inputFormField) =>
        determineErrors(currentState, errors, inputFormField),
      {}
    );

  const onBlur = (inputFormField: InputFormField) => {
    setErrors(
      determineErrors(currentState, currentErrors, inputFormField, true)
    );
  };

  // Returns the error message for the field
  const getError = (
    inputFormField: InputFormField
  ): {message: string; isVisible: boolean} | undefined => {
    return retrieve(
      currentErrors,
      inputFormField.path.map((x) => interpret(x, currentState, context))
    );
  };

  // Sets the value of the field in the state
  const setValue = (inputFormField: InputFormField, value: any) => {
    handleOnChange(
      inputFormField.path.map((x) => interpret(x, currentState, context)),
      value
    );
    setErrors(
      determineErrors(currentState, currentErrors, inputFormField, true)
    );
    onEvent && onEvent(inputFormField, currentState, 'change', value);
  };

  // Validate required or not
  const isValid = formFields.filter(isInput).every((formField) => {
    return (
      retrieve(
        currentErrors,
        formField.path.map((p) => interpret(p, currentState, context))
      )?.message === undefined
    );
  });

  const setErrorsVisible = () => {
    setErrors(
      formFields.filter(isInput).reduce((errors, inputFormField) => {
        const facts = inputFormField.path.map((x) =>
          interpret(x, currentState, context)
        );
        return update(errors, [...facts, 'isVisible'], true);
      }, currentErrors)
    );
  };

  return (
    <Context.Provider
      value={{
        onBlur,
        isValid,
        getValue,
        setValue,
        getError,
        emitEvent,
        formFields,
        getProperties,
        setErrorsVisible,
      }}
    >
      {children}
    </Context.Provider>
  );
}

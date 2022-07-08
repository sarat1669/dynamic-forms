import deepEqual from 'deep-equal';

import update from '../../dsl/updater';
import retrieve from '../../dsl/retriever';
import interpret from '../../dsl/interpreter';
import {Schema, FormField, InputFormField} from '../../../types';

// Filters input FormFields
export function isInput(formField: FormField): formField is InputFormField {
  return formField.type === 'input';
}

// Removes garbage data
export function filterState(formFields: FormField[], state: any, context: any) {
  return formFields
    .filter(isInput)
    .map((f) => f.path.map((x) => interpret(x, state, context)))
    .reduce((acc, cur) => {
      return update(acc, cur, retrieve(state, cur));
    }, {});
}

// Evaluates the expressions associated with FormFields
// And determines which ones to render
export function filterFormFields(schema: Schema, state: any, context: any) {
  return schema
    .filter(({isVisible}) => interpret(isVisible, state, context))
    .map(({field}) => field);
}

export function determineStateAndFormFields(
  state: any,
  context: any,
  schema: Schema
): [any, FormField[]] {
  let formFields: FormField[] = filterFormFields(schema, state, context);
  let oldFormFields: FormField[] = [];

  let oldState = state;
  let currentState = state;

  currentState = filterState(formFields, oldState, context);

  // Repeat until the state and FormFields are determined
  while (
    !deepEqual(oldState, currentState) ||
    !deepEqual(oldFormFields, formFields)
  ) {
    oldState = currentState;
    currentState = filterState(formFields, currentState, context);
    oldFormFields = formFields;
    formFields = filterFormFields(schema, currentState, context);
  }

  return [currentState, formFields];
}

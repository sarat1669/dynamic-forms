import {FC} from 'react';
import {ContextValue} from './Context';
import {FormProps} from './components/Form';
import {ASTNode, FormField, InputFormField} from '../types';
import {ProviderProps} from './components/Provider/Provider';

export function retrieve(state: any, facts: string[]): any;
export function update(state: any, facts: string[], value: any): any;
export function isInput(formField: FormField): formField is InputFormField;
export declare const Context: ContextValue,
  Form: FC<FormProps<any>>,
  Provider: FC<ProviderProps>;
export function interpret(
  rule: string | ASTNode,
  state: any,
  context: any
): any;

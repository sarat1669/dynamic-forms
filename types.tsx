import {ElementType, ComponentPropsWithoutRef} from 'react';

//
// DSL

type UndefinedNode = {
  type: 'undefined';
  arguments: [];
};

type NullNode = {
  type: 'null';
  arguments: [];
};

type TrueNode = {
  type: 'true';
  arguments: [];
};

type FalseNode = {
  type: 'false';
  arguments: [];
};

type IntegerNode = {
  type: 'integer';
  arguments: [string];
};

type FloatNode = {
  type: 'float';
  arguments: [string];
};

type StringNode = {
  type: 'string';
  arguments: [string];
};

type NotNode = {
  type: '!';
  arguments: [ASTNode];
};

type PlusNode = {
  type: '+';
  arguments: [ASTNode, ASTNode];
};

type MinusNode = {
  type: '-';
  arguments: [ASTNode, ASTNode];
};

type AbsNode = {
  type: 'abs';
  arguments: [ASTNode];
};

type NotEqualsNode = {
  type: '!=';
  arguments: [ASTNode, ASTNode];
};

type AndNode = {
  type: '&&';
  arguments: [ASTNode, ASTNode];
};

type OrNode = {
  type: '||';
  arguments: ASTNode[];
};

type MultiplyNode = {
  type: '*';
  arguments: [ASTNode, ASTNode];
};

type IncrementNode = {
  type: '++';
  arguments: [ASTNode];
};

type DecrementNode = {
  type: '--';
  arguments: [ASTNode];
};

type DivideNode = {
  type: '/';
  arguments: [ASTNode, ASTNode];
};

type LessThanNode = {
  type: '<';
  arguments: [ASTNode, ASTNode];
};

type GreaterThanNode = {
  type: '>';
  arguments: [ASTNode, ASTNode];
};

type LessThanOrEqualsNode = {
  type: '<=';
  arguments: [ASTNode, ASTNode];
};

type ConcatNode = {
  type: '<>';
  arguments: [ASTNode, ASTNode];
};

type EqualsNode = {
  type: '==';
  arguments: [ASTNode, ASTNode];
};

type GreaterThanOrEqualsNode = {
  type: '>=';
  arguments: [ASTNode, ASTNode];
};

type RemNode = {
  type: 'rem';
  arguments: [ASTNode, ASTNode];
};

type IncludesNode = {
  type: 'includes';
  arguments: [ASTNode, ASTNode];
};

type ListNode = {
  type: 'list';
  arguments: ASTNode[];
};

type ObjectNode = {
  type: 'object';
  arguments: [ASTNode];
};

type SumNode = {
  type: 'sum';
  arguments: [ASTNode];
};

type TernaryNode = {
  type: 'ternary';
  arguments: [ASTNode, ASTNode, ASTNode];
};

type FactNode = {
  type: 'fact';
  arguments: ASTNode[];
};

type ContextNode = {
  type: 'context';
  arguments: ASTNode[];
};

export type ASTNode =
  | NullNode
  | UndefinedNode
  | TrueNode
  | FalseNode
  | IntegerNode
  | FloatNode
  | StringNode
  | NotNode
  | PlusNode
  | MinusNode
  | AbsNode
  | NotEqualsNode
  | AndNode
  | OrNode
  | MultiplyNode
  | IncrementNode
  | DecrementNode
  | DivideNode
  | LessThanNode
  | GreaterThanNode
  | LessThanOrEqualsNode
  | ConcatNode
  | EqualsNode
  | GreaterThanOrEqualsNode
  | RemNode
  | IncludesNode
  | ListNode
  | ObjectNode
  | SumNode
  | TernaryNode
  | FactNode
  | ContextNode;

//
// JSON Configuration

export type SchemaItem = {
  field: FormField;
  isVisible: ASTNode;
};

export type Schema = SchemaItem[];

export type StaticValue = {
  type: 'static';
  value: any;
};

export type InterpretedValue = {
  value: ASTNode;
  type: 'interpreted';
};

export type Value = StaticValue | InterpretedValue;

export interface BaseFormField {
  type: string;
  properties: Properties;
  metadata?: Record<any, any>;
}

export type Properties = {
  // A property's value can be static / interpreted
  [key: string]: Value;
};

export type ReadOnlyProperties = Properties & {
  // Type determines which element to render
  type: {type: 'static'; value: string};
};

export interface ReadOnlyFormField extends BaseFormField {
  type: 'readonly';
  properties: ReadOnlyProperties;
}

export type InputProperties = ReadOnlyProperties & {
  // All input properties will have required field
  required: Value;
  errorMessage?: Value;
  value?: {type: 'interpeted'; value: ASTNode};
};

export interface InputFormField extends BaseFormField {
  type: 'input';
  // Path expressed as a chain for deep element access and update
  path: ASTNode[];
  validators?: string[];
  properties: InputProperties;
}

export type FormField = InputFormField | ReadOnlyFormField;

//
// Overwritable Type

export type Prefer<P, T> = P & Omit<T, keyof P>;

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export type ElementPropsWithoutRef<T extends ElementType> = Pick<
  ComponentPropsWithoutRef<T>,
  keyof ComponentPropsWithoutRef<T>
>;

export type OverwritableType<OwnProps, Type extends ElementType> = Prefer<
  OwnProps,
  ElementPropsWithoutRef<Type>
>;

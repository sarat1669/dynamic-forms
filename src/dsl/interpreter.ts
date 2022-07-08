import retrieve from './retriever';
import {ASTNode} from '../../types';

export default function interpret(
  rule: string | ASTNode,
  state: any,
  context: any
): any {
  if (typeof rule === 'string') return rule;
  const {type, arguments: args} = rule;

  switch (type) {
    case 'null':
      return null;
    case 'undefined':
      return undefined;
    case 'true':
      return true;
    case 'false':
      return false;
    case 'integer': {
      const [integer] = args;
      return parseInt(integer);
    }
    case 'float': {
      const [float] = args;
      return parseFloat(float);
    }
    case 'string': {
      const [word] = args;
      return String(word);
    }
    case '!': {
      const [arg] = args;
      return !interpret(arg, state, context);
    }
    case '+': {
      const [left, right] = args;
      return interpret(left, state, context) + interpret(right, state, context);
    }
    case '-': {
      const [left, right] = args;
      return interpret(left, state, context) - interpret(right, state, context);
    }
    case 'abs': {
      const [arg] = args;
      return Math.abs(interpret(arg, state, context));
    }
    case '!=': {
      const [left, right] = args;
      return (
        interpret(left, state, context) !== interpret(right, state, context)
      );
    }
    case '&&': {
      const [left, right] = args;
      return (
        interpret(left, state, context) && interpret(right, state, context)
      );
    }
    case '||': {
      return args.some((arg) => interpret(arg, state, context));
    }
    case '*': {
      const [left, right] = args;
      return interpret(left, state, context) * interpret(right, state, context);
    }
    case '++': {
      const [arg] = args;
      return interpret(arg, state, context) + 1;
    }
    case '--': {
      const [arg] = args;
      return interpret(arg, state, context) - 1;
    }
    case '/': {
      const [left, right] = args;
      return interpret(left, state, context) / interpret(right, state, context);
    }
    case '<': {
      const [left, right] = args;
      return interpret(left, state, context) < interpret(right, state, context);
    }
    case '>': {
      const [left, right] = args;
      return interpret(left, state, context) > interpret(right, state, context);
    }
    case '<=': {
      const [left, right] = args;
      return (
        interpret(left, state, context) <= interpret(right, state, context)
      );
    }
    case '<>': {
      const [left, right] = args;
      return interpret(left, state, context).concat(
        interpret(right, state, context)
      );
    }
    case '==': {
      const [left, right] = args;
      return (
        interpret(left, state, context) === interpret(right, state, context)
      );
    }
    case '>=': {
      const [left, right] = args;
      return (
        interpret(left, state, context) >= interpret(right, state, context)
      );
    }
    case 'rem': {
      const [left, right] = args;
      return interpret(left, state, context) % interpret(right, state, context);
    }
    case 'includes': {
      const [left, right] = args;
      return (interpret(left, state, context) || []).includes(
        interpret(right, state, context)
      );
    }
    case 'list': {
      return args.map((arg) => interpret(arg, state, context));
    }
    case 'ternary': {
      const [condition, truthy, falsy] = args;

      return interpret(condition, state, context)
        ? interpret(truthy, state, context)
        : interpret(falsy, state, context);
    }
    case 'sum': {
      const array = interpret(args[0], state, context);
      return array.reduce((sum: number, cur: number) => sum + cur, 0);
    }
    case 'object': {
      const array = interpret(args[0], state, context);
      return Object.fromEntries(array);
    }
    case 'context': {
      return retrieve(
        context,
        args.map((arg) => interpret(arg, state, context))
      );
    }
    case 'fact': {
      return retrieve(
        state,
        args.map((arg) => interpret(arg, state, context))
      );
    }
    default:
      throw 'Invalid AST';
  }
}

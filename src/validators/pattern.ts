const pattern = (value: any, properties: Record<string, any>) =>
  properties.pattern && !new RegExp(properties.pattern).test(value)
    ? `doesn't match pattern ${properties.pattern}`
    : undefined;

export default pattern;

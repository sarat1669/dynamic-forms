const max = (value: any, properties: Record<string, any>) =>
  value !== undefined && properties.max && value > properties.max
    ? `should be maximum ${properties.max}`
    : undefined;

export default max;

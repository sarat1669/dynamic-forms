const minLength = (value: any, properties: Record<string, any>) =>
  value === undefined ||
  (properties.minLength && value.length < properties.minLength)
    ? `length should be minimum ${properties.minLength}`
    : undefined;

export default minLength;

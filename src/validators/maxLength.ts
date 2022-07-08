const maxLength = (value: any, properties: Record<string, any>) =>
  value !== undefined &&
  properties.maxLength &&
  value.length > properties.maxLength
    ? `length should be maximum ${properties.maxLength}`
    : undefined;

export default maxLength;

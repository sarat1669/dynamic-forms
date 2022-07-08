const min = (value: any, properties: Record<string, any>) =>
  value === undefined || (properties.min && value < properties.min)
    ? `should be minimum ${properties.min}`
    : undefined;

export default min;

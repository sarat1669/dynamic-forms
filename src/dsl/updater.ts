export default function update(state: any, facts: string[], value: any): any {
  if (!state) state = {};
  if (facts.length === 0) return value;
  facts = [...facts];
  const last = facts.pop();
  const toBeUpdated = facts.reduce((acc, fact) => {
    if (acc[fact]) {
      return acc[fact];
    } else {
      acc[fact] = {};
      return acc[fact];
    }
  }, state);
  if (last) toBeUpdated[last] = value;
  return state;
}

function doRetrieve(path: string[], state: any): any {
  if (path.length === 1) {
    return (state || {})[path[0]];
  } else if (path.length === 0) {
    return state;
  } else {
    const [current, ...nextPath] = path;
    state = doRetrieve([current], state);
    return doRetrieve(nextPath, state);
  }
}

export default function retrieve(state: any, facts: string[]): any {
  if (!state) state = {};
  const [fact, ...path] = facts;
  return doRetrieve(path, state[fact]);
}

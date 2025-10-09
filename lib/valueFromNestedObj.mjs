export default function valueFromNestedObj(path, pathSeparator, obj) {
  // Check args for proper types.
  if (typeof path !== 'string')
    throw new Error('path parameter is not a string, but a ' + typeof path);

  if (typeof pathSeparator !== 'string' && pathSeparator !== null)
    throw new Error(
      'pathSeparator parameter is not a string, but a ' + typeof pathSeparator,
    );

  if (Array.isArray(obj))
    throw new Error('obj parameter is not an object, but a array');

  if (typeof obj !== 'object')
    throw new Error('obj parameter is not an object, but a ' + typeof obj);

  // Now grab that value.
  const keys = path.split(pathSeparator);
  let currentLevel = obj;
  for (let i = 0; i < keys.length; i++) {
    const currentKey = keys[i];
    const nextLevel = currentLevel[currentKey];
    // If path cannot be followed to completion, return undefined.
    if (nextLevel === undefined) return undefined;
    currentLevel = nextLevel;
  }
  // If we are out of keys, then we are at the end of the path. Return whatever was found.
  return currentLevel;
}

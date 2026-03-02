type DeepResolved<T> =
  T extends Promise<infer R>
    ? DeepResolved<R>
    : T extends Array<infer U>
      ? Array<DeepResolved<U>>
      : T extends object
        ? { [K in keyof T]: DeepResolved<T[K]> }
        : T;

async function deepResolvePromises<T>(input: T): Promise<DeepResolved<T>> {
  if (input instanceof Promise) {
    return (await input) as DeepResolved<T>;
  }

  if (Array.isArray(input)) {
    const resolvedArray = await Promise.all(input.map(deepResolvePromises));
    return resolvedArray as unknown as DeepResolved<T>;
  }

  if (input instanceof Date) {
    return input as unknown as DeepResolved<T>;
  }

  if (typeof input === 'object' && input !== null) {
    const keys = Object.keys(input) as (keyof T)[];
    const resolvedObject = {} as { [K in keyof T]: DeepResolved<T[K]> };

    for (const key of keys) {
      const resolvedValue = await deepResolvePromises(input[key]);
      resolvedObject[key] = resolvedValue;
    }

    return resolvedObject as DeepResolved<T>;
  }

  return input as unknown as DeepResolved<T>;
}

export default deepResolvePromises;

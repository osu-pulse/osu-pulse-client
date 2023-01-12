export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  fields: K[],
): Omit<T, K> {
  return Object.fromEntries(
    keys(obj)
      .filter((k) => !fields.includes(k as K))
      .map((k) => [k, obj[k as keyof T]]),
  ) as Omit<T, K>;
}

export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  fields: K[],
): Pick<T, K> {
  return Object.fromEntries(
    keys(obj)
      .filter((k) => fields.includes(k as K))
      .map((k) => [k, obj[k as keyof T]]),
  ) as Pick<T, K>;
}

export function map<S extends Record<string, any>, T>(
  obj: S,
  fn: (key: keyof S, value: S[keyof S]) => [string, T],
): Record<string, T> {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => fn(k, v)));
}

export function keys<O extends Record<string, any>>(obj: O): (keyof O)[] {
  return Object.keys(obj);
}

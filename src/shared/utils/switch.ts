export function switchAssign<
  V extends string | number | null | undefined, M extends Record<Exclude<V, null | undefined>, any>,
>(
  value: V,
  map: Partial<M>,
  fallback?: M[Exclude<typeof value, null | undefined>],
): M[Exclude<typeof value, null | undefined>] | undefined {
  if (value != null)
    return map[value as Exclude<V, null | undefined>]

  return fallback
}

export function switchExec<
  V extends string | number | null | undefined, M extends Record<Exclude<V, null | undefined>, (value: V) => any>,
>(
  value: V,
  map: Partial<M>,
  fallback?: M[Exclude<typeof value, null | undefined>],
): ReturnType<M[Exclude<typeof value, null | undefined>]> | undefined {
  if (value != null) {
    const handler = map[value as Exclude<V, null | undefined>]
    if (handler)
      return handler(value)
  }
  if (fallback)
    return fallback(value)
}

export function switchThrow<
  V extends string | number | null | undefined, M extends Record<Exclude<V, null | undefined>, any>,
>(
  value: V,
  map: Partial<M>,
  fallback?: unknown,
): never | void {
  if (value != null) {
    const reason = map[value as Exclude<V, null | undefined>]
    if (reason)
      throw reason as unknown as Error
  }
  if (fallback)
    throw fallback as unknown as Error
}

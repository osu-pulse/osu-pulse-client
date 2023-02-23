export function switchAssign<
  V extends string | number | null | undefined, M extends Record<Exclude<V, null | undefined>, unknown>,
>(
  value: V,
  map: M,
  fallback?: M[Exclude<typeof value, null | undefined>],
): M[Exclude<typeof value, null | undefined>] | undefined {
  if (value != null)
    return map[value as Exclude<V, null | undefined>]

  return fallback
}

export function switchExec<
  V extends string | number | null | undefined, M extends Record<Exclude<V, null | undefined>, (value: V) => unknown>,
>(
  value: V,
  map: M,
  fallback?: M[Exclude<typeof value, null | undefined>],
): ReturnType<M[Exclude<typeof value, null | undefined>]> | undefined {
  if (value != null) {
    const handler = map[value as Exclude<V, null | undefined>]
    if (handler)
      return handler(value) as ReturnType<typeof map[keyof typeof map]>
  }
  if (fallback)
    return fallback(value) as ReturnType<typeof fallback>
}

export function switchThrow<
  V extends string | number | null | undefined, M extends Record<Exclude<V, null | undefined>, unknown>,
>(value: V, map: M, fallback?: unknown): never | void {
  if (value != null) {
    const reason = map[value as Exclude<V, null | undefined>]
    if (reason)
      throw reason as unknown as Error
  }
  if (fallback)
    throw fallback as unknown as Error
}

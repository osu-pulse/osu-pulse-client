export function randomArrayElement<T>(arr: T[]): T {
  const index = Math.round(Math.random() * arr.length - 0.5)
  return arr[index]
}

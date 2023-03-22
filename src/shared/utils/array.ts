export function sum(array: number[]): number {
  let s = array[0]
  for (let i = 1; i < array.length; i++)
    s += array[i]
  return s
}

export function avg(array: number[]): number {
  return sum(array) / array.length
}

export function max(array: number[]): number {
  return Math.max(...array)
}

export function min(array: number[]): number {
  return Math.min(...array)
}

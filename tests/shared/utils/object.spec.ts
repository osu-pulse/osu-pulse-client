describe('omit', () => {
  it('removes fields', () => {
    const omitted = omit({ a: 1, b: 2, c: 3 }, ['a', 'b'])

    expect(omitted).toEqual({ c: 3 })
  })
})

describe('pick', () => {
  it('selects fields', () => {
    const picked = pick({ a: 1, b: 2, c: 3 }, ['a', 'b'])

    expect(picked).toEqual({ a: 1, b: 2 })
  })
})

describe('map', () => {
  it('transforms keys and values', () => {
    const mapped = map({ a: 1, b: 2, c: 3 }, (k, v) => [`_${k}`, v * 2])

    expect(mapped).toEqual({ _a: 2, _b: 4, _c: 6 })
  })
})

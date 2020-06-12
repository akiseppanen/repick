import { selectDateSingle, isSelectedSingle } from '../src/datepicker'

describe('selectDateSingle', () => {
  it('return given date when dates does not match', () => {
    const date = new Date('2018-01-01')
    expect(selectDateSingle(new Date('2000-01-01'), date)).toEqual([date, true])
  })
  it('return given null when dates does match', () => {
    const date = new Date('2018-01-01')
    expect(selectDateSingle(date, date)).toEqual([null, true])
  })
})

describe('isSelectedSingle', () => {
  const date = new Date('2018-01-01')

  it('selected', () => {
    expect(isSelectedSingle(new Date('2018-01-01'), date)).toEqual(true)
  })
  it('not selected', () => {
    expect(isSelectedSingle(new Date('2018-01-02'), date)).toEqual(false)
    expect(isSelectedSingle(null, date)).toEqual(false)
  })
})

describe('reducerSingle', () => {})

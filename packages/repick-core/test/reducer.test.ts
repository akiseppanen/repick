import { reducer, State } from '../src/reducer'

const state: State = {
  date: new Date('2018-01-01 00:00:00'),
  selected: null,
}

describe('reducer', () => {
  it('SelectDate', () => {
    const expectedDate = new Date('2018-01-10 00:00:00')

    const newState = reducer(state, {
      date: expectedDate,
      type: 'SelectDate',
    })

    expect(newState).toEqual({
      ...state,
      date: expectedDate,
      selected: expectedDate,
    })
  })

  it('SelectCurrent', () => {
    const expectedDate = new Date('2018-01-01 00:00:00')

    const newState = reducer(state, {
      type: 'SelectCurrent',
    })

    expect(newState).toEqual({
      ...state,
      date: expectedDate,
      selected: expectedDate,
    })
  })

  it('PrevDay', () => {
    const newState = reducer(state, {
      type: 'PrevDay',
    })

    expect(newState).toEqual({
      ...state,
      date: new Date('2017-12-31 00:00:00'),
    })
  })

  it('NextDay', () => {
    const newState = reducer(state, {
      type: 'NextDay',
    })

    expect(newState).toEqual({
      ...state,
      date: new Date('2018-01-02 00:00:00'),
    })
  })

  it('PrevWeek', () => {
    const newState = reducer(state, {
      type: 'PrevWeek',
    })

    expect(newState).toEqual({
      ...state,
      date: new Date('2017-12-25 00:00:00'),
    })
  })

  it('NextWeek', () => {
    const newState = reducer(state, {
      type: 'NextWeek',
    })

    expect(newState).toEqual({
      ...state,
      date: new Date('2018-01-08 00:00:00'),
    })
  })

  it('PrevMonth', () => {
    const newState = reducer(state, {
      type: 'PrevMonth',
    })

    expect(newState).toEqual({
      ...state,
      date: new Date('2017-12-01 00:00:00'),
    })
  })

  it('NextMonth', () => {
    const newState = reducer(state, {
      type: 'NextMonth',
    })

    expect(newState).toEqual({
      ...state,
      date: new Date('2018-02-01 00:00:00'),
    })
  })

  it('StartOfWeek', () => {
    const newState = reducer(state, {
      type: 'StartOfWeek',
    })

    expect(newState).toEqual({
      ...state,
      date: new Date('2017-12-31 00:00:00'),
    })
  })

  it('EndOfWeek', () => {
    const newState = reducer(state, {
      type: 'EndOfWeek',
    })

    expect(newState).toEqual({
      ...state,
      date: new Date('2018-01-06 00:00:00'),
    })
  })
})

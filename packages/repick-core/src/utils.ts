import { Action } from './reducer'

export const wrap = (min: number, max: number) => (x: number) => {
  const d = max - min
  return ((((x - min) % d) + d) % d) + min
}

export const wrapWeekDay = wrap(0, 7)

export function keyToAction(key: string): Action | null {
  switch (key) {
    case 'ArrowLeft': {
      return { type: 'PrevDay' }
    }
    case 'ArrowRight': {
      return { type: 'NextDay' }
    }
    case 'ArrowUp': {
      return { type: 'PrevWeek' }
    }
    case 'ArrowDown': {
      return { type: 'NextWeek' }
    }
    case 'PageDown': {
      return { type: 'PrevMonth' }
    }
    case 'PageUp': {
      return { type: 'NextMonth' }
    }
    case 'Home': {
      return { type: 'StartOfWeek' }
    }
    case 'End': {
      return { type: 'EndOfWeek' }
    }
    case 'Enter': {
      return { type: 'SelectCurrent' }
    }
    case 'Escape': {
      return { type: 'CloseCalendar' }
    }
  }

  return null
}

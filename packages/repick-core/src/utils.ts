import {
  Action,
  actionEndOfWeek,
  actionNextDay,
  actionNextMonth,
  actionNextWeek,
  actionPrevDay,
  actionPrevMonth,
  actionPrevWeek,
  actionSelectCurrent,
  actionStartOfWeek,
} from './reducer'

export const wrap = (min: number, max: number) => (x: number) => {
  const d = max - min
  return ((((x - min) % d) + d) % d) + min
}

export const wrapWeekDay = wrap(0, 7)

export function keyToAction(key: string): Action | null {
  switch (key) {
    case 'ArrowLeft': {
      return { type: actionPrevDay }
    }
    case 'ArrowRight': {
      return { type: actionNextDay }
    }
    case 'ArrowUp': {
      return { type: actionPrevWeek }
    }
    case 'ArrowDown': {
      return { type: actionNextWeek }
    }
    case 'PageDown': {
      return { type: actionPrevMonth }
    }
    case 'PageUp': {
      return { type: actionNextMonth }
    }
    case 'Home': {
      return { type: actionStartOfWeek }
    }
    case 'End': {
      return { type: actionEndOfWeek }
    }
    case 'Enter': {
      return { type: actionSelectCurrent }
    }
  }

  return null
}

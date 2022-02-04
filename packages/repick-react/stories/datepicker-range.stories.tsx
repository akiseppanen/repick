import classnames from 'classnames'
import * as React from 'react'
import { useRangeDatePicker } from '../src'

import { ArrowLeft, ArrowRight, Calendar } from './icons'

export default {
  title: 'Repick React',
}

const Component = () => {
  const date = new Date('2018-01-01')

  const {
    getCalendarHeaderProps,
    getCalendarProps,
    getDateProps,
    getDialogProps,
    getInputProps,
    getLabelProps,
    getNextMonthProps,
    getPrevMonthProps,
    getToggleButtonProps,
    isOpen,
    monthLong,
    weekdays,
    weeks,
    year,
  } = useRangeDatePicker({
    initialHighlighted: date,
    weekStartsOn: 1,
    updateHighlightedOnHover: false,
  })

  return (
    <>
      <label {...getLabelProps()}>Date</label>
      <input {...getInputProps()} type="text" />
      <button {...getToggleButtonProps()}>
        <Calendar />
      </button>
      <div className="dialog" {...getDialogProps()}>
        {isOpen && (
          <>
            <nav>
              <button {...getPrevMonthProps()} className="monthPrev">
                <ArrowLeft />
              </button>
              <div className="header" {...getCalendarHeaderProps()}>
                {monthLong} {year}
              </div>
              <button {...getNextMonthProps()} className="monthNext">
                <ArrowRight />
              </button>
            </nav>
            <table className="calendar" {...getCalendarProps()}>
              <thead>
                <tr>
                  {weekdays.map(weekday => (
                    <th
                      key={`weekday-${weekday.short}`}
                      abbr={weekday.long}
                      className="calendarWeekday"
                    >
                      {weekday.short}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weeks.map(({ weekNumber, year, days }) => (
                  <tr key={`week-${year}-${weekNumber}`}>
                    {days.map(calendarDay => (
                      <td key={`date-${calendarDay.date.toDateString()}`}>
                        <button
                          {...getDateProps(calendarDay)}
                          className={classnames('calendarDay', {
                            highlighted: calendarDay.highlighted,
                            nextMonth: calendarDay.nextMonth,
                            prevMonth: calendarDay.prevMonth,
                            selected: calendarDay.selected,
                            today: calendarDay.today,
                            inRange: calendarDay.inRange,
                            rangeStart: calendarDay.rangeStart,
                            rangeEnd: calendarDay.rangeEnd,
                          })}
                        >
                          {calendarDay.day}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  )
}

export const DatePickerRange = () => <Component />

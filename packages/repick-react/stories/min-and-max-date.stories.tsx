import classnames from 'classnames'
import format from 'date-fns/format'
import * as React from 'react'
import { useRepick } from '../src'

import { ArrowLeft, ArrowRight } from './arrows'

export default {
  title: 'Repick React',
}

export const MinAndMaxDate = () => {
  const minDate = new Date(new Date().setDate(5))
  const maxDate = new Date(new Date().setDate(25))

  const {
    selected,
    days,
    monthLong,
    year,
    weekdays,
    getDateProps,
    getPrevMonthProps,
    getNextMonthProps,
    getCalendarProps,
  } = useRepick({ weekStartsOn: 1, minDate, maxDate })

  return (
    <>
      <input
        type="text"
        value={selected ? format(selected, 'MM/dd/yyyy') : ''}
        readOnly
      />
      <div {...getCalendarProps()} className="calendar">
        <div className="calendarMonths">
          <div {...getPrevMonthProps()} className="calendarMonthPrev">
            <ArrowLeft />
          </div>
          <div className="calendarCurrentMonth">
            {monthLong} {year}
          </div>
          <div {...getNextMonthProps()} className="calendarMonthNext">
            <ArrowRight />
          </div>
        </div>
        <div className="calendarWeekdays">
          {weekdays.map(weekday => (
            <div key={`weekday-${weekday.short}`} className="calendarWeekday">
              {weekday.short}
            </div>
          ))}
        </div>
        <div className="calendarDayContainer">
          {days.map(calendarDay => (
            <button
              {...getDateProps(calendarDay)}
              key={calendarDay.date.toISOString()}
              className={classnames('calendarDay', {
                nextMonth: calendarDay.nextMonth,
                prevMonth: calendarDay.prevMonth,
                selected: calendarDay.selected,
                today: calendarDay.today,
                disabled: calendarDay.disabled,
              })}
            >
              {calendarDay.day}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

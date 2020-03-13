import classnames from 'classnames'
import format from 'date-fns/format'
import * as React from 'react'
import { useRepick } from '../src'

import { ArrowLeft, ArrowRight } from './arrows'

export default {
  title: 'Repick React',
}

export const ModeRange = () => {
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
  } = useRepick({ mode: 'range', weekStartsOn: 1 })

  return (
    <>
      <input
        size={100}
        type="text"
        value={
          selected
            ? selected
                .map(x => x !== undefined && format(x, 'MM/dd/yyyy'))
                .join(' - ')
            : ''
        }
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
                inRange: calendarDay.selected,
                today: calendarDay.today,
                rangeStart: calendarDay.rangeStart,
                rangeEnd: calendarDay.rangeEnd,
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

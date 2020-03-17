import classnames from 'classnames'
import format from 'date-fns/format'
import * as React from 'react'
import { useRepick } from '../src'

import { ArrowLeft, ArrowRight } from './arrows'

import './style.css'

export default {
  title: 'Repick React',
}

const Component = () => {
  const date = new Date('2018-01-01')

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
  } = useRepick({ mode: 'multi', weekStartsOn: 1, initialDate: date })

  return (
    <>
      <input
        size={100}
        type="text"
        value={
          selected
            ? selected
                .map(x => x !== undefined && format(x, 'MM/dd/yyyy'))
                .join(', ')
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
                selected: calendarDay.selected,
                today: calendarDay.today,
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

export const ModeMulti = () => <Component />

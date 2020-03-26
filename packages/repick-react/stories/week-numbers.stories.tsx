import classnames from 'classnames'
import format from 'date-fns/format'
import * as React from 'react'
import { mapWeeks, useRepick } from '../src'
import { ArrowLeft, ArrowRight } from './arrows'

import './style.css'

export default {
  title: 'Repick React',
}

const Component: React.FunctionComponent = () => {
  const date = new Date('2018-01-01')
  const {
    calendar,
    selected,
    monthLong,
    year,
    weekdays,
    getDateProps,
    getPrevMonthProps,
    getNextMonthProps,
    getCalendarProps,
  } = useRepick({ weekStartsOn: 1, initialDate: date })

  return (
    <>
      <input
        type="text"
        value={selected ? format(selected, 'MM/dd/yyyy') : ''}
        readOnly
      />
      <div {...getCalendarProps()} className="calendar withWeekNumbers">
        <div className="calendarHeader">
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
          <div className="calendarWeekNumber">#</div>
          {weekdays.map(weekday => (
            <div key={`weekday-${weekday.short}`} className="calendarWeekday">
              {weekday.short}
            </div>
          ))}
        </div>
        {mapWeeks(calendar, ({ weekNumber, year, days }) => (
          <div className="calendarWeek" key={`${weekNumber} ${year}`}>
            <button className="calendarWeekNumber">{weekNumber}</button>
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
        ))}
      </div>
    </>
  )
}

export const WeekNumbers = () => <Component />
import classnames from 'classnames'
import format from 'date-fns/format'
import * as React from 'react'
import { useDatePicker } from '../src'
import { ArrowLeft, ArrowRight } from './arrows'

import './style.css'

export default {
  title: 'Repick React',
}

const Component: React.FunctionComponent = () => {
  const date = new Date('2018-01-01')
  const {
    weeks,
    selected,
    monthLong,
    year,
    weekdays,
    getDateProps,
    getPrevMonthProps,
    getNextMonthProps,
    getCalendarProps,
  } = useDatePicker({ weekStartsOn: 1, initialHighlighted: date })

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
        {weeks.map(({ weekNumber, year, days }) => (
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

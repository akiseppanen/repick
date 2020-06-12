import classnames from 'classnames'
import * as React from 'react'
import { useDatePicker } from '../src'
import { ArrowLeft, ArrowRight, Calendar } from './icons'

import './style.css'

export default {
  title: 'Repick React',
}

const Component: React.FunctionComponent = () => {
  const date = new Date('2018-01-01')
  const {
    getToggleButtonProps,
    getCalendarProps,
    getDateProps,
    getInputProps,
    getNextMonthProps,
    getPrevMonthProps,
    weeks,
    isOpen,
    monthLong,
    weekdays,
    year,
  } = useDatePicker({
    initialHighlighted: date,
    weekStartsOn: 1,
  })

  return (
    <>
      <input {...getInputProps()} type="text" />
      <button {...getToggleButtonProps()}>
        <Calendar />
      </button>
      <div {...getCalendarProps()} className="calendar withWeekNumbers">
        {isOpen && (
          <>
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
                <div
                  key={`weekday-${weekday.short}`}
                  className="calendarWeekday"
                >
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
          </>
        )}
      </div>
    </>
  )
}

export const WeekNumbers = () => <Component />

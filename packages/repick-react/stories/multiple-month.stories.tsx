import classnames from 'classnames'
import format from 'date-fns/format'
import * as React from 'react'
import { mapDays, useDatePicker } from '../src'
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
    weekdays,
    getDateProps,
    getPrevMonthProps,
    getNextMonthProps,
    getCalendarProps,
  } = useDatePicker({
    weekStartsOn: 1,
    initialHighlighted: date,
    monthCount: 2,
  })

  return (
    <>
      <input
        type="text"
        value={selected ? format(selected, 'MM/dd/yyyy') : ''}
        readOnly
      />
      <div {...getCalendarProps()} className="calendar multipleMonths">
        <div className="calendarHeader">
          <div {...getPrevMonthProps()} className="calendarMonthPrev">
            <ArrowLeft />
          </div>
          <div {...getNextMonthProps()} className="calendarMonthNext">
            <ArrowRight />
          </div>
        </div>
        {calendar.map(({ month, monthLong, year, weeks }) => (
          <div className="calendarMonth" key={`${month}-${year}`}>
            <div className="calendarHeader">
              <div className="calendarCurrentMonth">
                {monthLong} {year}
              </div>
            </div>
            <div className="calendarWeekdays">
              {weekdays.map(weekday => (
                <div
                  key={`weekday-${weekday.short}`}
                  className="calendarWeekday"
                >
                  {weekday.short}
                </div>
              ))}
            </div>

            <div className="calendarDayContainer">
              {mapDays(weeks, calendarDay => (
                <button
                  {...getDateProps(calendarDay)}
                  key={calendarDay.date.toISOString()}
                  className={classnames('calendarDay', {
                    nextMonth: calendarDay.nextMonth,
                    prevMonth: calendarDay.prevMonth,
                    selected:
                      calendarDay.selected &&
                      !calendarDay.nextMonth &&
                      !calendarDay.prevMonth,
                    today: calendarDay.today,
                  })}
                >
                  {calendarDay.day}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export const MultipleMonths = () => <Component />

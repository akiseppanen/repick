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
    months,
    isOpen,
    weekdays,
  } = useDatePicker({
    initialHighlighted: date,
    monthCount: 2,
    weekStartsOn: 1,
  })

  return (
    <>
      <input {...getInputProps()} type="text" />
      <button {...getToggleButtonProps()}>
        <Calendar />
      </button>
      <div {...getCalendarProps()} className="calendar multipleMonths">
        {isOpen && (
          <>
            <div className="calendarHeader">
              <div {...getPrevMonthProps()} className="calendarMonthPrev">
                <ArrowLeft />
              </div>
              <div {...getNextMonthProps()} className="calendarMonthNext">
                <ArrowRight />
              </div>
            </div>
            {months.map(({ month, monthLong, year, days }) => (
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
                  {days.map(calendarDay => (
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
          </>
        )}
      </div>
    </>
  )
}

export const MultipleMonths = () => <Component />

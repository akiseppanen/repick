import classnames from 'classnames'
import * as React from 'react'
import { DatePicker } from '../src'

import { ArrowLeft, ArrowRight, Calendar } from './icons'

export default {
  title: 'Repick React',
}

const Component = () => {
  const date = new Date('2018-01-01')

  return (
    <DatePicker
      weekStartsOn={1}
      initialHighlighted={date}
      render={({
        getToggleButtonProps,
        getCalendarProps,
        getDateProps,
        getInputProps,
        getNextMonthProps,
        getPrevMonthProps,
        days,
        isOpen,
        monthLong,
        weekdays,
        year,
      }) => (
        <>
          <input {...getInputProps()} type="text" />
          <button {...getToggleButtonProps()}>
            <Calendar />
          </button>
          <div {...getCalendarProps()} className="calendar">
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
                        selected: calendarDay.selected,
                        today: calendarDay.today,
                      })}
                    >
                      {calendarDay.day}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
    />
  )
}

export const RenderProps = () => <Component />

import classnames from 'classnames'
import format from 'date-fns/format'
import * as React from 'react'
import Repick, { mapDays, RepickContextSingle } from '../src'

import { ArrowLeft, ArrowRight } from './arrows'

export default {
  title: 'Repick React',
}

const Component = () => {
  const date = new Date('2018-01-01')

  return (
    <Repick
      weekStartsOn={1}
      initialDate={date}
      render={({
        calendar,
        selected,
        monthLong,
        year,
        weekdays,
        getDateProps,
        getPrevMonthProps,
        getNextMonthProps,
        getCalendarProps,
      }: RepickContextSingle) => (
        <>
          <input
            type="text"
            value={selected ? format(selected, 'MM/dd/yyyy') : ''}
            readOnly
          />
          <div {...getCalendarProps()} className="calendar">
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
              {mapDays(calendar, calendarDay => (
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
      )}
    />
  )
}

export const RenderProps = () => <Component />

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
        getCalendarHeaderProps,
        getCalendarProps,
        getDateProps,
        getDialogProps,
        getInputProps,
        getLabelProps,
        getNextMonthProps,
        getPrevMonthProps,
        getToggleButtonProps,
        isOpen,
        monthLong,
        weekdays,
        weeks,
        year,
      }) => (
        <>
          <label {...getLabelProps()}>Date</label>
          <input {...getInputProps()} type="text" />
          <button {...getToggleButtonProps()}>
            <Calendar />
          </button>
          <div className="dialog" {...getDialogProps()}>
            {isOpen && (
              <>
                <nav>
                  <button {...getPrevMonthProps()} className="monthPrev">
                    <ArrowLeft />
                  </button>
                  <div className="header" {...getCalendarHeaderProps()}>
                    {monthLong} {year}
                  </div>
                  <button {...getNextMonthProps()} className="monthNext">
                    <ArrowRight />
                  </button>
                </nav>
                <table className="calendar" {...getCalendarProps()}>
                  <thead>
                    <tr>
                      {weekdays.map(weekday => (
                        <th
                          key={`weekday-${weekday.short}`}
                          abbr={weekday.long}
                          className="calendarWeekday"
                        >
                          {weekday.short}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {weeks.map(({ weekNumber, year, days }) => (
                      <tr key={`week-${year}-${weekNumber}`}>
                        {days.map(calendarDay => (
                          <td key={`date-${calendarDay.date.toDateString()}`}>
                            <button
                              {...getDateProps(calendarDay)}
                              className={classnames('calendarDay', {
                                nextMonth: calendarDay.nextMonth,
                                prevMonth: calendarDay.prevMonth,
                                selected: calendarDay.selected,
                                today: calendarDay.today,
                              })}
                            >
                              {calendarDay.day}
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </>
      )}
    />
  )
}

export const RenderProps = () => <Component />

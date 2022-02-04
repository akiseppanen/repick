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

  const monthCount = 2
  const {
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
    months,
    weekdays,
  } = useDatePicker({
    initialHighlighted: date,
    weekStartsOn: 1,
    monthCount,
    isOpen: true,
  })

  return (
    <>
      <label {...getLabelProps()}>Date</label>
      <input {...getInputProps()} type="text" />
      <button {...getToggleButtonProps()}>
        <Calendar />
      </button>
      <div className="dialog multipleMonths" {...getDialogProps()}>
        {isOpen && (
          <>
            {months.map(({ month, monthLong, year, weeks }, index) => (
              <div key={`${month}-${year}`}>
                <nav>
                  {index === 0 && (
                    <button {...getPrevMonthProps()} className="monthPrev">
                      <ArrowLeft />
                    </button>
                  )}
                  <div className="header" {...getCalendarHeaderProps(index)}>
                    {monthLong} {year}
                  </div>
                  {index === monthCount - 1 && (
                    <button {...getNextMonthProps()} className="monthNext">
                      <ArrowRight />
                    </button>
                  )}
                </nav>
                <table className="calendar" {...getCalendarProps(index)}>
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
                                highlighted: calendarDay.highlighted,
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
              </div>
            ))}
          </>
        )}
      </div>
    </>
  )
}

export const MultipleMonths = () => <Component />

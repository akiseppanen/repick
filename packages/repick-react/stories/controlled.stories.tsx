import classnames from 'classnames'
import * as React from 'react'
import { useDatePicker } from '../src'

import { ArrowLeft, ArrowRight, Calendar } from './icons'

export default {
  title: 'Repick React',
}

const Component = () => {
  const [activeDate, setActiveDate] = React.useState(new Date('2018-01-01'))
  const [selected, setSelected] = React.useState<Date | null>(null)

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
    monthLong,
    weekdays,
    weeks,
    year,
  } = useDatePicker({
    activeDate,
    onSelectedChange: setSelected,
    onActiveDateChange: setActiveDate,
    selected,
    weekStartsOn: 1,
  })

  return (
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
          </>
        )}
      </div>
    </>
  )
}
export const Controlled = () => <Component />

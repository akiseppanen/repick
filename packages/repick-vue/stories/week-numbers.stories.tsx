import classnames from 'classnames'
import { defineComponent } from 'vue'
import { useDatePicker } from '../src'
import { ArrowLeft, ArrowRight, Calendar } from './icons'

import './style.css'

export default {
  title: 'Repick Vue',
}

const Component = () => ({
  setup() {
    const date = new Date('2018-01-01')
    const datePicker = useDatePicker({
      initialActiveDate: date,
      weekStartsOn: 1,
    })

    return { datePicker }
  },

  render() {
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
    } = this.datePicker
    return (
      <>
        <label {...getLabelProps()}>Date</label>
        <input {...getInputProps()} type="text" />
        <button {...getToggleButtonProps()}>
          <Calendar />
        </button>
        <div class="dialog" {...getDialogProps()}>
          {isOpen && (
            <>
              <nav>
                <button {...getPrevMonthProps()} class="monthPrev">
                  <ArrowLeft />
                </button>
                <div class="header" {...getCalendarHeaderProps()}>
                  {monthLong} {year}
                </div>
                <button {...getNextMonthProps()} class="monthNext">
                  <ArrowRight />
                </button>
              </nav>
              <table class="calendar" {...getCalendarProps()}>
                <thead>
                  <tr>
                    <th class="calendarWeekNumber">#</th>
                    {weekdays.map(weekday => (
                      <th
                        key={`weekday-${weekday.short}`}
                        class="calendarWeekday"
                      >
                        {weekday.short}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {weeks.map(({ weekNumber, year, days }) => (
                    <tr key={`week-${year}-${weekNumber}`}>
                      <td class="calendarWeekNumber">{weekNumber}</td>
                      {days.map(calendarDay => (
                        <td key={`date-${calendarDay.date.toDateString()}`}>
                          <button
                            {...getDateProps(calendarDay)}
                            class={classnames('calendarDay', {
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
  },
})

export const WeekNumbers = Component.bind({})

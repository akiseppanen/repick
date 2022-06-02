import classnames from 'classnames'
import startOfDay from 'date-fns/startOfDay'
import { defineComponent } from 'vue'
import { useDatePicker } from '../src'

import { ArrowLeft, ArrowRight, Calendar } from './icons'

export default {
  title: 'Repick Vue',
}

const Component = () => ({
  setup() {
    const date = new Date('2018-01-01')

    const minDate = startOfDay(new Date('2018-01-05'))
    const maxDate = startOfDay(new Date('2018-01-25'))

    const datePicker = useDatePicker({
      initialActiveDate: date,
      maxDate,
      minDate,
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
                              disabled: calendarDay.disabled,
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

export const MinAndMaxDate = Component.bind({})

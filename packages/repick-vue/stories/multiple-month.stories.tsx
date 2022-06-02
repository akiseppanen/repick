import classnames from 'classnames'
import { defineComponent } from 'vue'
import { useDatePicker } from '../src'
import { ArrowLeft, ArrowRight, Calendar } from './icons'

import './style.css'

export default {
  title: 'Repick Vue',
}

const monthCount = 2

const Component = () => ({
  setup() {
    const datePicker = useDatePicker({
      initialActiveDate: new Date('2018-01-01'),
      weekStartsOn: 1,
      monthCount,
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
      months,
      weekdays,
    } = this.datePicker

    return (
      <>
        <label {...getLabelProps()}>Date</label>
        <input {...getInputProps()} type="text" />
        <button {...getToggleButtonProps()}>
          <Calendar />
        </button>
        <div class="dialog multipleMonths" {...getDialogProps()}>
          {isOpen && (
            <>
              {months.map(({ month, monthLong, year, weeks }, index) => (
                <div key={`${month}-${year}`}>
                  <nav>
                    {index === 0 && (
                      <button {...getPrevMonthProps()} class="monthPrev">
                        <ArrowLeft />
                      </button>
                    )}
                    <div class="header" {...getCalendarHeaderProps(index)}>
                      {monthLong} {year}
                    </div>
                    {index === monthCount - 1 && (
                      <button {...getNextMonthProps()} class="monthNext">
                        <ArrowRight />
                      </button>
                    )}
                  </nav>
                  <table class="calendar" {...getCalendarProps(index)}>
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
  },
})

export const MultipleMonths = Component.bind({})

# @repick/repick

Primitives to build simple, flexible, WAI-ARIA compliant React date picker.

## Installation

You can install Repick with NPM, Yarn

```
npm install @repick/react --save
```

or

```
yarn add @repick/react
```

## Basic Usage

Package exports three hooks `useDatePicker`, `UseMultiDatePicker`, `useRangeDatePicker`. Usage of these hooks are mostly identical, only being difference type of `Selected`.

> [Try it out in the browser](https://codesandbox.io/s/repick-react-basic-example-5mbkk)

```js
import { useDatePicker } from '@repick/react'

function DatePicker() {
  const {
    getCalendarProps,
    getDateProps,
    getDialogProps,
    getInputProps,
    getLabelProps,
    getNextMonthProps,
    getPrevMonthProps,
    isOpen,
    monthLong,
    weekdays,
    weeks,
    year,
  } = useDatePicker()

  return (
    <>
      <label {...getLabelProps()}>Date</label>
      <input {...getInputProps()} />
      <div {...getDialogProps()}>
        {isOpen && (
          <>
            <nav>
              <button {...getPrevMonthProps()}>Next Month</button>
              {monthLong} {year}
              <button {...getNextMonthProps()}>Previous month</button>
            </nav>
            <table {...getCalendarProps()}>
              <thead>
                <tr>
                  {weekdays.map(weekday => (
                    <th key={`weekday-${weekday.short}`} abbr={weekday.long}>
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
                          style={{
                            color:
                              calendarDay.nextMonth || calendarDay.prevMonth
                                ? '#ccc'
                                : 'unset',
                            background: calendarDay.selected ? 'cyan' : 'unset',
                          }}
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
```

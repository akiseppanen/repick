import classnames from 'classnames'
import format from 'date-fns/format'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Repick, { RepickContextRange } from 'repick-react'

const ArrowLeft = () => (
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17">
    <path d="M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z" />
  </svg>
)

const ArrowRight = () => (
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17">
    <path d="M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z" />
  </svg>
)

const DatePicker = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const open = () => setIsOpen(true)
  const close = () => {
    setIsOpen(false)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }
  return (
    <Repick mode="range" weekStartsOn={1}>
      {({
        selected,
        days,
        monthLong,
        year,
        weekdays,
        getDateProps,
        getPrevMonthProps,
        getNextMonthProps,
        getCalendarProps,
        handleKeyDown,
        setFocusToCalendar,
      }: RepickContextRange) => (
        <>
          <input
            size={100}
            type="text"
            onClick={open}
            value={
              selected
                ? selected
                    .map(x => x !== undefined && format(x, 'MM/dd/yyyy'))
                    .join(' - ')
                : ''
            }
            onKeyDown={e => {
              if (e.key === 'ArrowDown') {
                open()
                setFocusToCalendar()
              }
            }}
            ref={inputRef}
            readOnly
          />
          {isOpen && (
            <div
              {...getCalendarProps()}
              onKeyDown={e => {
                if (e.key === 'Escape') {
                  close()
                }

                handleKeyDown(e)
              }}
              className="calendar"
            >
              <div className="calendarMonths">
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
                      rangeStart: calendarDay.rangeStart,
                      rangeEnd: calendarDay.rangeEnd,
                    })}
                  >
                    {calendarDay.day}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </Repick>
  )
}

const App = () => <DatePicker />

ReactDOM.render(<App />, document.getElementById('root'))

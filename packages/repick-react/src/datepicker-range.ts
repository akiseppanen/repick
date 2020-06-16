import { ReactElement } from 'react'
import { buildContextRange, reducerRange, RepickDayRange } from 'repick-core'

import { RepickProps, RepickReturnValue } from './core/types'
import { useDatePickerCore } from './core'

export type RepickPropsRange = RepickProps<[Date] | [Date, Date]>
export type RepickReturnValueRange = RepickReturnValue<
  [Date] | [Date, Date],
  RepickDayRange
>

export const useRangeDatePicker = (
  props: RepickPropsRange,
): RepickReturnValueRange => {
  return useDatePickerCore({
    ...props,
    buildContext: buildContextRange,
    reducer: reducerRange,
  })
}

export function RangeDatePicker(
  props: RepickPropsRange & {
    render: (props: RepickReturnValueRange) => ReactElement | null
  },
) {
  const { render, ...hookProps } = props

  const context = useRangeDatePicker(hookProps)

  return render(context)
}

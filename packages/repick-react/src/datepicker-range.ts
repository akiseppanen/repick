import { ReactElement } from 'react'
import { buildContextRange, reducerRange, RepickDayRange } from 'repick-core'

import { RepickProps, RepickReturnValue } from './core/types'
import { useDatePickerCore } from './core'

type RepickPropsRange = RepickProps<[Date, Date?]>

export const useRangeDatePicker = (props: RepickPropsRange) => {
  return useDatePickerCore({
    ...props,
    buildContext: buildContextRange,
    reducer: reducerRange,
  })
}

export function RangeDatePicker(
  props: RepickPropsRange & {
    render: (
      props: RepickReturnValue<[Date, Date?], RepickDayRange>,
    ) => ReactElement | null
  },
) {
  const { render, ...hookProps } = props

  const context = useRangeDatePicker(hookProps)

  return render(context)
}

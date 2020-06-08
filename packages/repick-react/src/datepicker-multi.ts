import { ReactElement } from 'react'
import { reducerMulti, buildContextMulti, RepickDayMulti } from 'repick-core'

import { RepickProps, RepickReturnValue } from './core/types'
import { useDatePickerCore } from './core'

type RepickPropsMulti = RepickProps<Date[]>

export const useMultiDatePicker = (props: RepickPropsMulti) => {
  return useDatePickerCore({
    ...props,
    buildContext: buildContextMulti,
    reducer: reducerMulti,
  })
}

export function MultiDatePicker(
  props: RepickPropsMulti & {
    render: (
      props: RepickReturnValue<Date[], RepickDayMulti>,
    ) => ReactElement | null
  },
) {
  const { render, ...hookProps } = props

  const context = useMultiDatePicker(hookProps)

  return render(context)
}

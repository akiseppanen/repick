import { ReactElement } from 'react'
import { reducerMulti, buildContextMulti, RepickDayMulti } from 'repick-core'

import { RepickProps, RepickReturnValue } from './core/types'
import { useDatePickerCore } from './core'

export type RepickPropsMulti = RepickProps<Date[]>
export type RepickReturnValueMulti = RepickReturnValue<Date[], RepickDayMulti>

export const useMultiDatePicker = (
  props: RepickProps<Date[]>,
): RepickReturnValueMulti => {
  return useDatePickerCore({
    ...props,
    buildContext: buildContextMulti,
    reducer: reducerMulti,
  })
}

export function MultiDatePicker(
  props: RepickPropsMulti & {
    render: (props: RepickReturnValueMulti) => ReactElement | null
  },
) {
  const { render, ...hookProps } = props

  const context = useMultiDatePicker(hookProps)

  return render(context)
}

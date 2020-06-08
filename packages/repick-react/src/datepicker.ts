import { ReactElement } from 'react'
import { reducerSingle, buildContextSingle, RepickDaySingle } from 'repick-core'

import { RepickProps, RepickReturnValue } from './core/types'
import { useDatePickerCore } from './core'

type RepickPropsSingle = RepickProps<Date>

export const useDatePicker = (props: RepickPropsSingle) => {
  return useDatePickerCore({
    ...props,
    buildContext: buildContextSingle,
    reducer: reducerSingle,
  })
}

export function DatePicker(
  props: RepickPropsSingle & {
    render: (
      props: RepickReturnValue<Date, RepickDaySingle>,
    ) => ReactElement | null
  },
) {
  const { render, ...hookProps } = props

  const context = useDatePicker(hookProps)

  return render(context)
}

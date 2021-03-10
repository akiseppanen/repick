import { ReactElement } from 'react'
import {
  reducerSingle,
  buildContextSingle,
  RepickDaySingle,
} from '@repick/core'

import { RepickProps, RepickReturnValue } from './core/types'
import { useDatePickerCore } from './core'

export type RepickPropsSingle = RepickProps<Date>
export type RepickReturnValueSingle = RepickReturnValue<Date, RepickDaySingle>

export const useDatePicker = (
  props: RepickPropsSingle = {},
): RepickReturnValueSingle => {
  return useDatePickerCore({
    ...props,
    buildContext: buildContextSingle,
    reducer: reducerSingle,
  })
}

export function DatePicker(
  props: RepickPropsSingle & {
    render: (props: RepickReturnValueSingle) => ReactElement | null
  },
) {
  const { render, ...hookProps } = props

  const context = useDatePicker(hookProps)

  return render(context)
}

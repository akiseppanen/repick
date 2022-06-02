import {
  reducerSingle,
  buildContextSingle,
  RepickDaySingle,
} from '@repick/core'

import { RepickProps, RepickReturnValue } from './core/types'
import { useDatePickerCore } from './core'
import { ComputedRef } from 'vue'

export type RepickPropsSingle = RepickProps<Date>
export type RepickReturnValueSingle = RepickReturnValue<Date, RepickDaySingle>

export const useDatePicker = (
  props: RepickPropsSingle = {},
): ComputedRef<RepickReturnValueSingle> => {
  return useDatePickerCore({
    ...props,
    buildContext: buildContextSingle,
    reducer: reducerSingle,
  })
}

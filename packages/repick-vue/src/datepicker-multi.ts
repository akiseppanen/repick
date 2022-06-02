import { reducerMulti, buildContextMulti, RepickDayMulti } from '@repick/core'
import { ComputedRef } from 'vue'

import { RepickProps, RepickReturnValue } from './core/types'
import { useDatePickerCore } from './core'

export type RepickPropsMulti = RepickProps<Date[]>
export type RepickReturnValueMulti = RepickReturnValue<Date[], RepickDayMulti>

export const useMultiDatePicker = (
  props: RepickProps<Date[]> = {},
): ComputedRef<RepickReturnValueMulti> => {
  return useDatePickerCore({
    ...props,
    buildContext: buildContextMulti,
    reducer: reducerMulti,
  })
}

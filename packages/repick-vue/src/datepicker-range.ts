import { buildContextRange, reducerRange, RepickDayRange } from '@repick/core'
import { ComputedRef } from 'vue'

import { RepickProps, RepickReturnValue } from './core/types'
import { useDatePickerCore } from './core'

export type RepickPropsRange = RepickProps<[Date] | [Date, Date]>
export type RepickReturnValueRange = RepickReturnValue<
  [Date] | [Date, Date],
  RepickDayRange
>

export const useRangeDatePicker = (
  props: RepickPropsRange = {},
): ComputedRef<RepickReturnValueRange> => {
  return useDatePickerCore({
    ...props,
    buildContext: buildContextRange,
    reducer: reducerRange,
  })
}

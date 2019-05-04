import { State } from './reducer'

export interface Options {
  locale?: object
  weekStartsOn?: number
}

export const extractOptionsFromState = (state: State): Options => ({
  locale: state.locale,
  weekStartsOn: state.weekStartsOn,
})

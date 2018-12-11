export interface Options {
  locale?: object
  weekStartsOn?: number
  format?: string
}

export const defaultOptions: Options = {
  weekStartsOn: 0,
  format: 'MM/DD/YYYY',
}

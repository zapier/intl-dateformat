import formatDate from './formatDate'
import parseDate from './parseDate'
import { CustomFormatters, FormatFunction, FormatOptions } from './types'

export default function createDateFormatter(customFormatters: CustomFormatters): FormatFunction {
  return function intlFormatDate(date: Date, format: string, options?: FormatOptions): string {
    const tokens = parseDate(date, options)
    const output = formatDate(customFormatters, format, tokens, date)
    return output
  }
}

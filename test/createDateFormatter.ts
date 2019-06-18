import test, { Macro } from 'ava'
import createDateFormatter from '../src/createDateFormatter'
import { tokensDate } from './fixtures/tokens'
import { CustomFormatters } from '../src/types'

const testMask: Macro<[CustomFormatters, string, string]> = (t, formatters, format, expected) => {
  const formatDate = createDateFormatter(formatters)
  const dateStr = formatDate(tokensDate, format)
  t.is(dateStr, expected)
}

const customFormatters: CustomFormatters = {
  SSS: (parts, date) => String(date.getTime()).slice(-3)
}

test('expose new formatters', testMask, customFormatters, 'SSS', '000')
test('still expose vanilla formatters', testMask, {}, 'YYYY-MM-DD', '1984-01-17')

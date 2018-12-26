import test, { Macro } from 'ava'
import formatDate from '../src/formatDate'
import tokens, { tokensDate } from './fixtures/tokens'
import { FormatterMask } from '../src/types'

const testMask: Macro<[FormatterMask, string]> = (t, format, expected) => {
  const dateStr = formatDate({}, format, tokens, tokensDate)
  t.is(dateStr, expected)
}

test('format a 4 digits year', testMask, 'YYYY', '1984')
test('format a 2 digits year', testMask, 'YY', '84')
test('format a 2 digits month', testMask, 'MM', '01')
test('format a short month', testMask, 'MMM', 'Jan')
test('format a long month', testMask, 'MMMM', 'January')
test('format a 2 digits day', testMask, 'DD', '17')
test('format a short weekday', testMask, 'ddd', 'Tue')
test('format a long weekday', testMask, 'dddd', 'Tuesday')
test('format an upper case day period', testMask, 'A', 'PM')
test('format an lower case day period', testMask, 'a', 'pm')
test('format a 2 digits 24-hour', testMask, 'HH', '16')
test('format a 2 digits hour', testMask, 'hh', '04')
test('format a 2 digits minute', testMask, 'mm', '13')
test('format a 2 digits second', testMask, 'ss', '37')

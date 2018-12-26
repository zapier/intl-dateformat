import test, { Macro } from 'ava'
import parseDate from '../src/parseDate'
import { FormatOptions } from '../src/types'

const testDate: Macro<[Date, FormatOptions?]> = (t, date, options) => {
  const tokens = parseDate(date, options)
  t.snapshot(tokens)
}

const date = new Date(Date.UTC(1984, 0, 17, 16, 13, 37, 0))

test('parse a date', testDate, date)
test('parse a date with a custom locale', testDate, date, { locale: 'fr' })
test('parse a date with a custom timezone', testDate, date, { timezone: 'Asia/Singapore' })

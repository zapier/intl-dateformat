import test, { Macro } from 'ava'
import { performance, PerformanceObserver } from 'perf_hooks'
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

test.cb('cache the parser given the same options', t => {
  const minotiredParseDate = performance.timerify(parseDate)
  const obs = new PerformanceObserver(list => {
    const [first, second] = list.getEntries()
    t.true(second.duration < first.duration)
    obs.disconnect()
    t.end()
  })
  obs.observe({ entryTypes: ['function'], buffered: true })

  minotiredParseDate(date, { locale: 'es' })
  minotiredParseDate(date, { locale: 'es' })
})

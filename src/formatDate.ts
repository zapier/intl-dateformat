import { CustomFormatters, DateParts, Formatters, FormatterMask } from './types'

const defaultPattern = '[YMDdAaHhms]+'

const identity = (x: any) => x

const formatters: Formatters = {
  YYYY: parts => parts.year,
  YY: parts => parts.year.slice(-2),
  MMMM: parts => parts.lmonth,
  MMM: parts => parts.lmonth.slice(0, 3),
  MM: parts => parts.month,
  DD: parts => parts.day,
  dddd: parts => parts.weekday,
  ddd: parts => parts.weekday.slice(0, 3),
  A: parts => parts.dayPeriod,
  a: parts => parts.dayPeriod.toLowerCase(),
  // XXX: fix Chrome 80+ bug going over 24h
  HH: parts => ('0' + (Number(parts.lhour) % 24)).slice(-2),
  hh: parts => parts.hour,
  mm: parts => parts.minute,
  ss: parts => parts.second
}

const createCustomPattern = (customFormatters: CustomFormatters) =>
  Object.keys(customFormatters).reduce((_, key) => `|${key}`, '')

export default function formatDate(
  customFormatters: CustomFormatters,
  format: string,
  parts: DateParts,
  date: Date
): string {
  const literalPattern = '\\[([^\\]]+)\\]|'
  const customPattern = createCustomPattern(customFormatters)
  const patternRegexp = new RegExp(`${literalPattern}${defaultPattern}${customPattern}`, 'g')

  const allFormatters = { ...formatters, ...customFormatters }

  return format.replace(patternRegexp, (mask: FormatterMask, literal: string) => {
    return literal || (allFormatters[mask] || identity)(parts, date)
  })
}

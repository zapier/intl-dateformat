import { DateParts, DatePartName, FormatOptions, Parser, Token } from './types'

const parsers: Map<string, Parser> = new Map()

const intlFormattersOptions = [
  {
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  },
  {
    month: 'long',
    hour: '2-digit',
    hour12: false,
    timeZoneName: 'long',
  }
]

const createIntlFormatterWith = (options: FormatOptions): Intl.DateTimeFormat[] =>
  intlFormattersOptions.map(
    intlFormatterOptions =>
      new Intl.DateTimeFormat(options.locale, {
        ...intlFormatterOptions,
        timeZone: options.timezone
      })
  )

const longTokensTransformer = (token: Token): Token =>
  (token.type !== 'literal' ? { type: `l${token.type}`, value: token.value } : token) as Token

const datePartsReducer = (parts: DateParts, token: Token): DateParts => {
  parts[token.type as DatePartName] = token.value
  return parts
}

const tokenize = (intlFormatter: Intl.DateTimeFormat, date: Date): Token[] =>
  intlFormatter.formatToParts(date).filter(token => token.type !== 'literal') as Token[]

const normalize = (parts: DateParts): DateParts => {
  // Chrome <= 71 and Node >= 10 incorrectly case `dayperiod` (#4)
  // dayPeriod will be undefined for 24 hour clocks so fall back to empty string
  parts.dayPeriod = parts.dayPeriod || (parts as any).dayperiod || ''
  delete (parts as any).dayperiod

  // Chrome >= 80 has a bug going over 24h
  parts.lhour = ('0' + (Number(parts.lhour) % 24)).slice(-2)

  return parts
}

const createParser = (options: FormatOptions): Parser => {
  const [intlFormatter, intlFormatterLong] = createIntlFormatterWith(options)

  return function parseDateImpl(date: Date): DateParts {
    const tokens = tokenize(intlFormatter, date)
    const longTokens = tokenize(intlFormatterLong, date).map(longTokensTransformer)
    const allTokens = [...tokens, ...longTokens]
    const parts = allTokens.reduce(datePartsReducer, {} as DateParts)

    return normalize(parts)
  }
}

export default function parseDate(date: Date, options: FormatOptions = {}): DateParts {
  const key = `${options.locale}${options.timezone}`

  let parser = parsers.get(key)
  if (!parser) {
    parser = createParser(options)
    parsers.set(key, parser)
  }

  return parser(date)
}

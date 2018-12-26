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
    second: '2-digit'
  },
  {
    month: 'long',
    hour: '2-digit',
    hour12: false
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

const createParser = (options: FormatOptions): Parser => {
  const [intlFormatter, intlFormatterLong] = createIntlFormatterWith(options)

  return function parseDateImpl(date: Date): DateParts {
    const tokens = tokenize(intlFormatter, date)
    const longTokens = tokenize(intlFormatterLong, date).map(longTokensTransformer)
    const allTokens = [...tokens, ...longTokens]

    return allTokens.reduce(datePartsReducer, {} as DateParts)
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

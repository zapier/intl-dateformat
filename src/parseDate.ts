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

const longTokensTransformer = (token: Token): Token =>
  (token.type !== 'literal' ? { type: `l${token.type}`, value: token.value } : token) as Token

const datePartsReducer = (parts: DateParts, token: Token): DateParts => {
  parts[token.type as DatePartName] = token.value
  return parts
}

function tokenize(intlFormatter: Intl.DateTimeFormat, date: Date): Token[] {
  return intlFormatter.formatToParts(date).filter(token => token.type !== 'literal') as Token[]
}

function createParser(options: FormatOptions): Parser {
  const [intlFormatter, intlFormatterLong] = intlFormattersOptions.map(
    formatterOptions =>
      new Intl.DateTimeFormat(options.locale, {
        ...formatterOptions,
        timeZone: options.timezone
      })
  )

  return function parseDateImpl(date: Date): DateParts {
    const tokens = tokenize(intlFormatter, date)
    const longTokens = tokenize(intlFormatterLong, date).map(longTokensTransformer)

    const allTokens = [...tokens, ...longTokens, { type: 'timestamp', value: date.getTime() }]

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

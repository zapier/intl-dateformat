import type { DateParts, FormatOptions, Parser, Token } from './types';

const parsers: Map<string, Parser> = new Map();

const intlFormattersOptions: Intl.DateTimeFormatOptions[] = [
  {
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
    timeZoneName: 'longOffset',
  },
  {
    month: 'long',
    hour: '2-digit',
    hour12: false,
  },
];

const createIntlFormatterWith = (
  options: FormatOptions,
): Intl.DateTimeFormat[] =>
  intlFormattersOptions.map(
    intlFormatterOptions =>
      new Intl.DateTimeFormat(options.locale, {
        ...intlFormatterOptions,
        timeZone: options.timezone,
      }),
  );

const longTokensTransformer = (token: Token): Token =>
  ({ type: `l${token.type}`, value: token.value }) as Token;

const datePartsReducer = (parts: DateParts, token: Token): DateParts => {
  parts[token.type] = token.value;
  return parts;
};

const tokenize = (intlFormatter: Intl.DateTimeFormat, date: Date): Token[] =>
  intlFormatter
    .formatToParts(date)
    .filter(token => token.type !== 'literal') as Token[];

const normalize = (parts: DateParts): DateParts => {
  // dayPeriod will be undefined for 24 hour clocks so fall back to empty string
  // biome-ignore lint/suspicious/noExplicitAny: Chrome <= 71 and Node >= 10 incorrectly case `dayperiod` (#4)
  parts.dayPeriod = parts.dayPeriod || (parts as any).dayperiod || '';
  // biome-ignore lint/suspicious/noExplicitAny: Chrome <= 71 and Node >= 10 incorrectly case `dayperiod` (#4)
  delete (parts as any).dayperiod;

  // Chrome >= 80 has a bug going over 24h
  parts.lhour = `0${Number(parts.lhour) % 24}`.slice(-2);

  return parts;
};

const createParser = (options: FormatOptions): Parser => {
  const [intlFormatter, intlFormatterLong] = createIntlFormatterWith(options);

  return (date: Date): DateParts => {
    const tokens = tokenize(intlFormatter, date);
    const longTokens = tokenize(intlFormatterLong, date).map(token =>
      longTokensTransformer(token),
    );
    const allTokens = [...tokens, ...longTokens];
    const parts = allTokens.reduce(datePartsReducer, {} as DateParts);

    return normalize(parts);
  };
};

export const parseDate = (
  date: Date,
  options: FormatOptions = {},
): DateParts => {
  const key = `${options.locale}${options.timezone}`;

  let parser = parsers.get(key);
  if (!parser) {
    parser = createParser(options);
    parsers.set(key, parser);
  }

  return parser(date);
};

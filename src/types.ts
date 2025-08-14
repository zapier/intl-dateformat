export type DatePartName =
  | 'weekday'
  | 'year'
  | 'month'
  | 'lmonth'
  | 'day'
  | 'dayPeriod'
  | 'hour'
  | 'lhour'
  | 'minute'
  | 'second'
  | 'fractionalSecond'
  | 'timeZoneName';

export type Token = { type: DatePartName; value: string };
export type DateParts = Record<DatePartName, string>;

export type Parser = (date: Date) => DateParts;

export type FormatterMask =
  | 'YYYY'
  | 'YY'
  | 'MMMM'
  | 'MMM'
  | 'MM'
  | 'DD'
  | 'dddd'
  | 'ddd'
  | 'A'
  | 'a'
  | 'HH'
  | 'hh'
  | 'mm'
  | 'ss'
  | 'SSS'
  | 'XXX';

export type Formatter = (tokens: DateParts, date: Date) => string;

export type Formatters = { [k in FormatterMask]: Formatter };

export type CustomFormatters = { [k: string]: Formatter };

export type FormatFunction = (
  date: Date,
  format: string,
  options?: FormatOptions,
) => string;

export type FormatOptions = {
  locale?: string;
  timezone?: string;
};

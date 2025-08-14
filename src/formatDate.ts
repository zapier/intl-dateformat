import type {
  CustomFormatters,
  DateParts,
  FormatterMask,
  Formatters,
} from './types';

const defaultPattern = 'Y+|M+|D+|d+|A+|a+|H+|h+|m+|s+|S+|X+';

const formatters: Formatters = {
  YYYY: parts => parts.year,
  YY: parts => parts.year.slice(-2),
  MMMM: parts => parts.lmonth,
  MMM: parts => parts.lmonth.slice(0, 3),
  MM: parts => parts.month,
  DD: parts => parts.day,
  dddd: parts => parts.weekday,
  ddd: parts => parts.weekday.slice(0, 3),
  A: parts => parts.dayPeriod.toUpperCase(),
  a: parts => parts.dayPeriod.toLowerCase(),
  HH: parts => parts.lhour,
  hh: parts => parts.hour,
  mm: parts => parts.minute,
  ss: parts => parts.second,
  SSS: parts => parts.fractionalSecond,
  XXX: parts => parts.timeZoneName.slice(3) || 'Z',
};

const createCustomPattern = (customFormatters: CustomFormatters) =>
  Object.keys(customFormatters).reduce((_, key) => `|${key}`, '');

export const formatDate = (
  customFormatters: CustomFormatters,
  format: string,
  parts: DateParts,
  date: Date,
): string => {
  const literalPattern = '\\[([^\\]]+)\\]|';
  const customPattern = createCustomPattern(customFormatters);
  const patternRegexp = new RegExp(
    `${literalPattern}${defaultPattern}${customPattern}`,
    'g',
  );

  const allFormatters = { ...formatters, ...customFormatters };

  return format.replace(
    patternRegexp,
    (mask, literal) =>
      literal || allFormatters[mask as FormatterMask](parts, date),
  );
};

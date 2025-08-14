import { formatDate } from './formatDate';
import { parseDate } from './parseDate';
import type { CustomFormatters, FormatFunction, FormatOptions } from './types';

export const createDateFormatter =
  (customFormatters: CustomFormatters): FormatFunction =>
  (date: Date, format: string, options?: FormatOptions): string => {
    const tokens = parseDate(date, options);
    const output = formatDate(customFormatters, format, tokens, date);
    return output;
  };

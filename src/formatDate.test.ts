import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';
import { formatDate } from './formatDate';
import type { DateParts } from './types';

const TOKENS: DateParts = {
  year: '2025',
  month: '02',
  lmonth: 'February',
  day: '17',
  dayPeriod: 'PM',
  hour: '04',
  lhour: '16',
  minute: '35',
  second: '12',
  fractionalSecond: '345',
  timeZoneName: 'GMT-05:00',
  weekday: 'Monday',
};

const TEST_DATE = new Date('2025-02-17T16:35:12.345Z');

describe('formatDate', () => {
  beforeAll(() => {
    // Freeze time to a specific moment for consistent testing
    vi.useFakeTimers();
    vi.stubEnv('TZ', 'UTC');
    vi.setSystemTime(TEST_DATE);
  });

  afterAll(() => {
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  test('formats YYYY', () => {
    const formatted = formatDate({}, 'YYYY', TOKENS, TEST_DATE);
    expect(formatted).toEqual('2025');
  });

  test('formats YY', () => {
    const formatted = formatDate({}, 'YY', TOKENS, TEST_DATE);
    expect(formatted).toEqual('25');
  });

  test('formats MMMM', () => {
    const formatted = formatDate({}, 'MMMM', TOKENS, TEST_DATE);
    expect(formatted).toEqual('February');
  });

  test('formats MMM', () => {
    const formatted = formatDate({}, 'MMM', TOKENS, TEST_DATE);
    expect(formatted).toEqual('Feb');
  });

  test('formats MM', () => {
    const formatted = formatDate({}, 'MM', TOKENS, TEST_DATE);
    expect(formatted).toEqual('02');
  });

  test('formats DD', () => {
    const formatted = formatDate({}, 'DD', TOKENS, TEST_DATE);
    expect(formatted).toEqual('17');
  });

  test('formats dddd', () => {
    const formatted = formatDate({}, 'dddd', TOKENS, TEST_DATE);
    expect(formatted).toEqual('Monday');
  });

  test('formats ddd', () => {
    const formatted = formatDate({}, 'ddd', TOKENS, TEST_DATE);
    expect(formatted).toEqual('Mon');
  });

  test('formats A', () => {
    const formatted = formatDate({}, 'A', TOKENS, TEST_DATE);
    expect(formatted).toEqual('PM');
  });

  test('formats a', () => {
    const formatted = formatDate({}, 'a', TOKENS, TEST_DATE);
    expect(formatted).toEqual('pm');
  });

  test('formats HH', () => {
    const formatted = formatDate({}, 'HH', TOKENS, TEST_DATE);
    expect(formatted).toEqual('16');
  });

  test('formats hh', () => {
    const formatted = formatDate({}, 'hh', TOKENS, TEST_DATE);
    expect(formatted).toEqual('04');
  });

  test('formats mm', () => {
    const formatted = formatDate({}, 'mm', TOKENS, TEST_DATE);
    expect(formatted).toEqual('35');
  });

  test('formats ss', () => {
    const formatted = formatDate({}, 'ss', TOKENS, TEST_DATE);
    expect(formatted).toEqual('12');
  });

  test('formats SSS', () => {
    const formatted = formatDate({}, 'SSS', TOKENS, TEST_DATE);
    expect(formatted).toEqual('345');
  });

  test('formats XXX', () => {
    const formatted = formatDate({}, 'XXX', TOKENS, TEST_DATE);
    expect(formatted).toEqual('-05:00');
  });

  test('formats XXX in GMT', () => {
    const formatted = formatDate(
      {},
      'XXX',
      { ...TOKENS, timeZoneName: 'GMT' },
      TEST_DATE,
    );
    expect(formatted).toEqual('Z');
  });

  test('formats literal string', () => {
    const formatted = formatDate(
      {},
      '[It is] dddd[,] MMMM DD[th]',
      TOKENS,
      TEST_DATE,
    );
    expect(formatted).toEqual('It is Monday, February 17th');
  });
});

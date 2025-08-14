import { PerformanceObserver, performance } from 'node:perf_hooks';

import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';
import { parseDate } from './parseDate';

const TEST_DATE = new Date('2025-02-17T16:35:12.345Z');

describe('parseDate', () => {
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

  test('parses a date', () => {
    const tokens = parseDate(TEST_DATE);
    expect(tokens).toEqual({
      year: '2025',
      month: '02',
      lmonth: 'February',
      day: '17',
      dayPeriod: expect.stringMatching(/pm/i),
      hour: '04',
      lhour: '16',
      minute: '35',
      second: '12',
      fractionalSecond: '345',
      timeZoneName: 'GMT',
      weekday: 'Monday',
    });
  });

  test('parses a date with custom timezone', () => {
    const tokens = parseDate(TEST_DATE, { timezone: 'America/New_York' });
    expect(tokens).toEqual({
      year: '2025',
      month: '02',
      lmonth: 'February',
      day: '17',
      dayPeriod: expect.stringMatching(/am/i),
      hour: '11',
      lhour: '11',
      minute: '35',
      second: '12',
      fractionalSecond: '345',
      timeZoneName: 'GMT-05:00',
      weekday: 'Monday',
    });
  });

  test('parses a date with custom locale', () => {
    const tokens = parseDate(TEST_DATE, { locale: 'fr' });
    expect(tokens).toEqual({
      year: '2025',
      month: '02',
      lmonth: 'février',
      day: '17',
      dayPeriod: '',
      hour: '16',
      lhour: '16',
      minute: '35',
      second: '12',
      fractionalSecond: '345',
      timeZoneName: 'UTC',
      weekday: 'lundi',
    });
  });

  test('caches the parser', () => {
    const timedParseDate = performance.timerify(parseDate);

    const observer = new PerformanceObserver(list => {
      const [first, ...rest] = list.getEntries();
      for (const entry of rest) {
        expect(entry.duration).toBeLessThan(first.duration);
      }

      observer.disconnect();
    });
    observer.observe({ type: 'function', buffered: true });

    for (let i = 0; i < 100; i++) {
      timedParseDate(TEST_DATE, { timezone: 'Australia/Sydney' });
    }
  });
});

import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';
import { createDateFormatter } from './createDateFormatter';
import type { CustomFormatters } from './types';

const TEST_DATE = new Date('2025-02-17T16:35:12.345Z');

describe('createDateFormatter', () => {
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

  test('vanilla formatter', () => {
    const formatter = createDateFormatter({});
    const formatted = formatter(TEST_DATE, 'YYYY-MM-DD');

    expect(formatted).toEqual('2025-02-17');
  });

  test('vanilla formatter with timezone', () => {
    const formatter = createDateFormatter({});
    const formatted = formatter(TEST_DATE, 'YYYY-MM-DDTHH:mm:ssXXX', {
      timezone: 'America/New_York',
    });

    expect(formatted).toEqual('2025-02-17T11:35:12-05:00');
  });

  test('custom formatter', () => {
    const customFormatters: CustomFormatters = {
      SS: (_, date) => date.getTime().toString().slice(-3, -1),
    };

    const formatter = createDateFormatter(customFormatters);
    const formatted = formatter(TEST_DATE, 'SS');

    expect(formatted).toEqual('34');
  });
});

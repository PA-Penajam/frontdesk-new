import { describe, it, expect } from 'vitest';
import { getTestDb } from '../test-utils';

describe('Vitest Setup', () => {
  it('vitest runs', () => {
    expect(true).toBe(true);
  });

  it('getTestDb() returns working in-memory database', () => {
    const db = getTestDb();
    const result = db.prepare('SELECT 1 as test').get();
    expect(result).toEqual({ test: 1 });
  });
});
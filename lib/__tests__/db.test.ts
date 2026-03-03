import { describe, it, expect, afterAll } from 'vitest';
import { getDb } from '../db';
import Database from 'better-sqlite3';

describe('Database Utility', () => {
  // Use in-memory database for tests to avoid polluting real DB
  const db = getDb(':memory:');

  it('should export getDb() function', () => {
    expect(typeof getDb).toBe('function');
  });

  it('getDb() returns a Database instance', () => {
    expect(db).toBeInstanceOf(Database);
  });

  it('schema creates tamu table with correct columns', () => {
    const tableInfo = db.prepare("PRAGMA table_info(tamu)").all();
    const columns = tableInfo.map((col: { name: string }) => col.name);
    
    expect(columns).toEqual(expect.arrayContaining([
      'id', 'jenis_tamu', 'nama', 'alamat', 'instansi', 'hp', 'tujuan', 'tanggal', 'old_id'
    ]));
  });

  it('can insert and select a record', () => {
    const insertStmt = db.prepare(`
      INSERT INTO tamu (jenis_tamu, nama, alamat, instansi, hp, tujuan)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const result = insertStmt.run('tamu', 'John Doe', '123 Main St', 'Acme Corp', '123-4567', 'Meeting');
    expect(result.changes).toBe(1);
    expect(typeof result.lastInsertRowid).toBe('number');

    const selectStmt = db.prepare('SELECT * FROM tamu WHERE id = ?');
    const record = selectStmt.get(result.lastInsertRowid);
    expect(record).not.toBeUndefined();
    expect(record.nama).toBe('John Doe');
    expect(record.jenis_tamu).toBe('tamu');
  });

  it('jenis_tamu CHECK constraint rejects invalid values', () => {
    const invalidTypes = ['guest', 'visitor', '', null];
    
    invalidTypes.forEach(invalidType => {
      expect(() => {
        db.prepare(`
          INSERT INTO tamu (jenis_tamu, nama, tujuan)
          VALUES (?, ?, ?)
        `).run(invalidType, 'Invalid User', 'Invalid Purpose');
      }).toThrow();
    });
  });

  afterAll(() => {
    // Close the in-memory database connection
    db.close();
  });
});
import { describe, it, expect, beforeEach } from 'vitest';
import { getTestDb } from '../test-utils';
import { runMigration } from '../../scripts/migrate';
import type { Database } from 'better-sqlite3';

describe('Migration from JSON to SQLite', () => {
  let db: Database;

  beforeEach(() => {
    db = getTestDb();
  });

  it('should insert all records into the database', () => {
    // Arrange: 5 test records
    const testRecords = [
      {
        id: 1,
        jenis_tamu: 'tamu',
        tanggal: '2021-08-23 08:09:04',
        nama: 'Test Tamu 1',
        alamat: 'Address 1',
        instansi: 'Company 1',
        hp: '08123456789',
        tujuan: 'Meeting',
      },
      {
        id: 2,
        jenis_tamu: 'pengunjung',
        tanggal: '2021-08-24 10:30:00',
        nama: 'Test Pengunjung 1',
        alamat: 'Address 2',
        instansi: null,
        hp: '08987654321',
        tujuan: 'Consultation',
      },
      {
        id: 3,
        jenis_tamu: 'tamu',
        tanggal: '2021-08-25 14:45:00',
        nama: 'Test Tamu 2',
        alamat: '',
        instansi: '',
        hp: '',
        tujuan: 'Other',
      },
      {
        id: 4,
        jenis_tamu: 'pengunjung',
        tanggal: '2021-08-26 09:15:00',
        nama: 'Test Pengunjung 2',
        alamat: null,
        instansi: null,
        hp: 'Lupa',
        tujuan: 'Information',
      },
      {
        id: 5,
        jenis_tamu: 'invalid',
        tanggal: '2021-08-27 11:20:00',
        nama: 'Test Invalid',
        alamat: 'Address 5',
        instansi: 'Company 5',
        hp: '0',
        tujuan: 'Test',
      },
    ];

    // Act
    const result = runMigration(db, testRecords);

    // Assert
    expect(result.totalInserted).toBe(testRecords.length);
    const count = db.prepare('SELECT COUNT(*) as count FROM tamu').get().count;
    expect(count).toBe(testRecords.length);
  });

  it('should preserve old_id from source JSON', () => {
    // Arrange: Test record with known id
    const testRecords = [
      {
        id: 1234,
        jenis_tamu: 'tamu',
        tanggal: '2021-08-23 08:09:04',
        nama: 'Test Record',
        alamat: 'Test Address',
        instansi: 'Test Company',
        hp: '08123456789',
        tujuan: 'Test Purpose',
      },
    ];

    // Act
    runMigration(db, testRecords);

    // Assert
    const record = db.prepare('SELECT * FROM tamu').get();
    expect(record.old_id).toBe(1234);
  });

  it('should normalize empty strings to null', () => {
    // Arrange: Record with empty string fields
    const testRecords = [
      {
        id: 1,
        jenis_tamu: 'tamu',
        tanggal: '2021-08-23 08:09:04',
        nama: 'Test Record',
        alamat: '',
        instansi: '',
        hp: '',
        tujuan: 'Test Purpose',
      },
    ];

    // Act
    runMigration(db, testRecords);

    // Assert
    const record = db.prepare('SELECT * FROM tamu').get();
    expect(record.alamat).toBeNull();
    expect(record.instansi).toBeNull();
    expect(record.hp).toBeNull();
  });

  it('should preserve jenis_tamu values (tamu and pengunjung)', () => {
    // Arrange: Records with both jenis_tamu values
    const testRecords = [
      {
        id: 1,
        jenis_tamu: 'tamu',
        tanggal: '2021-08-23 08:09:04',
        nama: 'Tamu Record',
        alamat: 'Address',
        instansi: 'Company',
        hp: '08123456789',
        tujuan: 'Meeting',
      },
      {
        id: 2,
        jenis_tamu: 'pengunjung',
        tanggal: '2021-08-24 10:30:00',
        nama: 'Pengunjung Record',
        alamat: 'Address',
        instansi: null,
        hp: '08987654321',
        tujuan: 'Consultation',
      },
    ];

    // Act
    const result = runMigration(db, testRecords);

    // Assert
    expect(result.tamuCount).toBe(1);
    expect(result.pengunjungCount).toBe(1);

    const tamuCount = db.prepare('SELECT COUNT(*) as count FROM tamu WHERE jenis_tamu = ?').get('tamu').count;
    const pengunjungCount = db.prepare('SELECT COUNT(*) as count FROM tamu WHERE jenis_tamu = ?').get('pengunjung').count;

    expect(tamuCount).toBe(1);
    expect(pengunjungCount).toBe(1);
  });
});
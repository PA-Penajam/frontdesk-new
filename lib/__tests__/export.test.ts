import { describe, it, expect } from 'vitest';
import { generateCSV, generateExcel } from '../export';
import { getTestDb, seedTestData } from '../test-utils';
import type { Tamu } from '../types';

describe('Export Functions', () => {
  describe('generateCSV', () => {
    it('returns string with correct headers for tamu', () => {
      const db = getTestDb();
      seedTestData(db, [
        {
          jenis_tamu: 'tamu',
          nama: 'Test Tamu 1',
          instansi: 'Test Instansi',
          hp: '1234567890',
          tujuan: 'Meeting',
          tanggal: '2024-01-01',
        },
      ]);

      const records = db.prepare('SELECT * FROM tamu').all() as Tamu[];
      const csv = generateCSV(records, 'tamu');

      expect(typeof csv).toBe('string');
      expect(csv.startsWith('"No","Nama","Instansi","HP","Tujuan","Tanggal"')).toBe(true);
    });

    it('uses Alamat column for pengunjung (not Instansi)', () => {
      const db = getTestDb();
      seedTestData(db, [
        {
          jenis_tamu: 'pengunjung',
          nama: 'Test Pengunjung 1',
          alamat: 'Test Alamat',
          hp: '0987654321',
          tujuan: 'Informasi',
          tanggal: '2024-01-02',
        },
      ]);

      const records = db.prepare('SELECT * FROM tamu').all() as Tamu[];
      const csv = generateCSV(records, 'pengunjung');

      expect(typeof csv).toBe('string');
      expect(csv.startsWith('"No","Nama","Alamat","HP","Tujuan","Tanggal"')).toBe(true);
    });
  });

  describe('generateExcel', () => {
    it('returns a Buffer (instanceof Buffer)', () => {
      const db = getTestDb();
      seedTestData(db, [
        {
          jenis_tamu: 'tamu',
          nama: 'Test Tamu',
          instansi: 'Test Instansi',
          hp: '1234567890',
          tujuan: 'Meeting',
          tanggal: '2024-01-01',
        },
      ]);

      const records = db.prepare('SELECT * FROM tamu').all() as Tamu[];
      const excelBuffer = generateExcel(records, 'tamu');

      expect(excelBuffer instanceof Buffer).toBe(true);
      expect(excelBuffer.length > 0).toBe(true);
    });
  });
});

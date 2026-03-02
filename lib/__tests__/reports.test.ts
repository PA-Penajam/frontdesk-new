import { describe, it, expect, vi } from 'vitest';
import { generateMonthlyPDF, generateMonthlyExcel } from '../reports';

describe('reports', () => {
  // Mock data
  const mockStats = {
    records: [
      {
        id: 1,
        jenis_tamu: 'tamu',
        nama: 'John Doe',
        alamat: null,
        instansi: 'PT XYZ',
        hp: '08123456789',
        tujuan: 'Informasi Perkara',
        tanggal: '2025-01-15 10:30:00',
        old_id: null
      },
      {
        id: 2,
        jenis_tamu: 'pengunjung',
        nama: 'Jane Smith',
        alamat: 'Jl. Merdeka No. 1',
        instansi: null,
        hp: '08987654321',
        tujuan: 'Pendaftaran Perkara',
        tanggal: '2025-01-16 14:20:00',
        old_id: null
      }
    ],
    totalTamu: 1,
    totalPengunjung: 1,
    tujuanSummary: {
      'Informasi Perkara': 1,
      'Pendaftaran Perkara': 1
    }
  };

  describe('generateMonthlyPDF', () => {
    it('should generate PDF as Uint8Array', async () => {
      const pdf = await generateMonthlyPDF(mockStats, 1, 2025);
      expect(pdf).toBeInstanceOf(Uint8Array);
      expect(pdf.length).toBeGreaterThan(0);
    });
  });

  describe('generateMonthlyExcel', () => {
    it('should generate Excel file with 2 sheets', async () => {
      const excel = await generateMonthlyExcel(mockStats, 1, 2025);
      expect(excel).toBeInstanceOf(Buffer);
      expect(excel.length).toBeGreaterThan(0);

      // Verify workbook has 2 sheets using XLSX
      const XLSX = await import('xlsx');
      const wb = XLSX.read(excel);
      expect(wb.SheetNames.length).toBe(2);
      expect(wb.SheetNames).toEqual(expect.arrayContaining(['Ringkasan', 'Data']));
    });

    it('should include correct month name in summary sheet header', async () => {
      const excel = await generateMonthlyExcel(mockStats, 1, 2025);
      const XLSX = await import('xlsx');
      const wb = XLSX.read(excel);
      const ws1 = wb.Sheets['Ringkasan'];
      
      // The first cell should contain 'Laporan Bulan Januari 2025'
      const cellA1 = XLSX.utils.format_cell(ws1['A1']);
      expect(cellA1).toEqual('Laporan Bulan Januari 2025');
    });
  });
});
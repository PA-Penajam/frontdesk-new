import * as XLSX from 'xlsx';
import type { Tamu } from './types';
import type { JenisTamu } from './types';

export function generateCSV(records: Tamu[], jenisTamu: JenisTamu): string {
  // Determine columns based on jenisTamu
  const headers = jenisTamu === 'tamu'
    ? ['No', 'Nama', 'Instansi', 'HP', 'Tujuan', 'Tanggal']
    : ['No', 'Nama', 'Alamat', 'HP', 'Tujuan', 'Tanggal'];

  // Convert records to CSV rows
  const rows = records.map((record, index) => {
    const row: string[] = [
      (index + 1).toString(),
      record.nama || '',
      jenisTamu === 'tamu' ? (record.instansi || '') : (record.alamat || ''),
      record.hp || '',
      record.tujuan || '',
      record.tanggal || '',
    ];
    // Escape quotes and join with commas
    return row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',');
  });

  // Combine headers and rows
  return [
    headers.map(header => `"${header}"`).join(','),
    ...rows,
  ].join('\n');
}

export function generateExcel(records: Tamu[], jenisTamu: JenisTamu): Buffer {
  // Determine columns based on jenisTamu
  const data = records.map((record, index) => {
    const base = {
      No: index + 1,
      Nama: record.nama || '',
      HP: record.hp || '',
      Tujuan: record.tujuan || '',
      Tanggal: record.tanggal || '',
    };
    if (jenisTamu === 'tamu') {
      return {
        ...base,
        Instansi: record.instansi || '',
      };
    }
    return {
      ...base,
      Alamat: record.alamat || '',
    };
  });

  // Create worksheet and workbook
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  // Write to buffer
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

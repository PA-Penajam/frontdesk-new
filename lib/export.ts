import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
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

export function generatePDF(records: Tamu[], jenisTamu: JenisTamu): Uint8Array {
  const doc = new jsPDF();
  const jenisLabel = jenisTamu === 'tamu' ? 'Tamu' : 'Pengunjung';

  // Header
  doc.setFontSize(16);
  doc.text('Pengadilan Agama Penajam', 105, 20, { align: 'center' });
  doc.setFontSize(14);
  doc.text(`Daftar ${jenisLabel}`, 105, 30, { align: 'center' });

  // Table Headers
  let y = 45;
  doc.setFontSize(10);
  doc.text('No', 14, y);
  doc.text('Nama', 28, y);
  if (jenisTamu === 'tamu') {
    doc.text('Instansi', 80, y);
  } else {
    doc.text('Alamat', 80, y);
  }
  doc.text('HP', 125, y);
  doc.text('Tujuan', 150, y);
  doc.text('Tanggal', 185, y);
  y += 8;

  // Table Content
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    const no = (i + 1).toString();
    const nama = doc.splitTextToSize(record.nama, 48);
    const detail = jenisTamu === 'tamu'
      ? doc.splitTextToSize(record.instansi || '-', 40)
      : doc.splitTextToSize(record.alamat || '-', 40);
    const hp = record.hp || '-';
    const tujuan = doc.splitTextToSize(record.tujuan, 30);
    const tanggal = record.tanggal;

    doc.text(no, 14, y);
    doc.text(nama, 28, y);
    doc.text(detail, 80, y);
    doc.text(hp, 125, y);
    doc.text(tujuan, 150, y);
    doc.text(tanggal, 185, y);

    const maxLines = Math.max(nama.length, detail.length, tujuan.length);
    y += maxLines * 7;

    // Check if we need a new page
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  }

  return new Uint8Array(doc.output('arraybuffer'));
}

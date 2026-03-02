import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import type { MonthlyStats } from './types';

// Indonesian month names
const monthNames = [
  '', // index 0 unused
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
];

export async function generateMonthlyPDF(stats: MonthlyStats, month: number, year: number): Promise<Uint8Array> {
  const doc = new jsPDF();
  const monthName = monthNames[month];

  // Header
  doc.setFontSize(16);
  doc.text('Pengadilan Agama Penajam', 105, 20, { align: 'center' });
  doc.setFontSize(14);
  doc.text(`Laporan Buku Tamu Bulan ${monthName} ${year}`, 105, 30, { align: 'center' });

  // Summary Section
  doc.setFontSize(12);
  doc.text('Ringkasan:', 14, 45);
  doc.text(`Total Tamu: ${stats.totalTamu}`, 14, 55);
  doc.text(`Total Pengunjung: ${stats.totalPengunjung}`, 14, 65);
  doc.text(`Total Seluruh: ${stats.records.length}`, 14, 75);

  // Tujuan Breakdown
  let y = 85;
  doc.text('Tujuan:', 14, y);
  y += 10;
  for (const [tujuan, count] of Object.entries(stats.tujuanSummary)) {
    doc.text(`- ${tujuan}: ${count}`, 14, y);
    y += 7;
  }

  // Table Section
  y += 5;
  doc.text('Data Tamu:', 14, y);
  y += 10;

  // Table Headers
  doc.setFontSize(10);
  doc.text('Nama', 14, y);
  doc.text('Jenis', 70, y);
  doc.text('Tujuan', 110, y);
  doc.text('Tanggal', 160, y);
  y += 8;

  // Table Content
  for (const record of stats.records) {
    // Wrap text if too long
    const nama = doc.splitTextToSize(record.nama, 55);
    const jenis = record.jenis_tamu === 'tamu' ? 'Tamu' : 'Pengunjung';
    const tujuan = doc.splitTextToSize(record.tujuan, 45);
    const tanggal = record.tanggal;

    // Draw Nama
    doc.text(nama, 14, y);
    // Draw Jenis
    doc.text(jenis, 70, y);
    // Draw Tujuan
    doc.text(tujuan, 110, y);
    // Draw Tanggal
    doc.text(tanggal, 160, y);

    // Calculate height needed for next row
    const maxLines = Math.max(nama.length, tujuan.length);
    y += maxLines * 7;

    // Check if we need a new page
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  }

  return new Uint8Array(doc.output('arraybuffer'));
}

export async function generateMonthlyExcel(stats: MonthlyStats, month: number, year: number): Promise<Buffer> {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Ringkasan
  const monthName = monthNames[month];
  const summaryAOA = [
    [`Laporan Bulan ${monthName} ${year}`],
    [],
    ['Total Tamu', stats.totalTamu],
    ['Total Pengunjung', stats.totalPengunjung],
    ['Total Seluruh', stats.records.length],
    [],
    ['Tujuan', 'Jumlah']
  ];

  for (const [tujuan, count] of Object.entries(stats.tujuanSummary)) {
    summaryAOA.push([tujuan, count]);
  }

  const ws1 = XLSX.utils.aoa_to_sheet(summaryAOA);
  XLSX.utils.book_append_sheet(wb, ws1, 'Ringkasan');

  // Sheet 2: Data
  const recordsData = stats.records.map(record => ({
    'ID': record.id,
    'Nama': record.nama,
    'Jenis': record.jenis_tamu === 'tamu' ? 'Tamu' : 'Pengunjung',
    'Instansi': record.instansi || '',
    'Alamat': record.alamat || '',
    'HP': record.hp || '',
    'Tujuan': record.tujuan,
    'Tanggal': record.tanggal
  }));

  const ws2 = XLSX.utils.json_to_sheet(recordsData);
  XLSX.utils.book_append_sheet(wb, ws2, 'Data');

  // Adjust column widths for readability
  const wscols = [
    { wch: 8 }, // ID
    { wch: 30 }, // Nama
    { wch: 12 }, // Jenis
    { wch: 30 }, // Instansi
    { wch: 30 }, // Alamat
    { wch: 15 }, // HP
    { wch: 30 }, // Tujuan
    { wch: 20 }  // Tanggal
  ];
  ws2['!cols'] = wscols;

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  return buf as Buffer;
}
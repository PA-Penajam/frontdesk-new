import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import type { MonthlyStats } from './types';
import type { JenisTamu } from './types';

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

export async function generateMonthlyPDF(stats: MonthlyStats, month: number, year: number, jenis?: JenisTamu): Promise<Uint8Array> {
  const doc = new jsPDF();
  const monthName = monthNames[month];

  // Determine title based on jenis
  const jenisLabel = jenis === 'tamu' ? 'Tamu' : jenis === 'pengunjung' ? 'Pengunjung' : 'Tamu & Pengunjung';

  // Header
  doc.setFontSize(16);
  doc.text('Pengadilan Agama Penajam', 105, 20, { align: 'center' });
  doc.setFontSize(14);
  doc.text(`Laporan ${jenisLabel} Bulan ${monthName} ${year}`, 105, 30, { align: 'center' });

  // Summary Section
  doc.setFontSize(12);
  doc.text('Ringkasan:', 14, 45);
  let summaryY = 55;
  if (!jenis || jenis === 'tamu') {
    doc.text(`Total Tamu: ${stats.totalTamu}`, 14, summaryY);
    summaryY += 10;
  }
  if (!jenis || jenis === 'pengunjung') {
    doc.text(`Total Pengunjung: ${stats.totalPengunjung}`, 14, summaryY);
    summaryY += 10;
  }
  if (!jenis) {
    doc.text(`Total Seluruh: ${stats.records.length}`, 14, summaryY);
    summaryY += 10;
  }

  // Tujuan Breakdown
  let y = summaryY;
  doc.text('Tujuan:', 14, y);
  y += 10;
  for (const [tujuan, count] of Object.entries(stats.tujuanSummary)) {
    doc.text(`- ${tujuan}: ${count}`, 14, y);
    y += 7;
  }

  // Table Section
  y += 5;
  doc.text(`Data ${jenisLabel}:`, 14, y);
  y += 10;

  // Table Headers - adjust columns based on jenis
  doc.setFontSize(10);
  if (jenis === 'tamu') {
    doc.text('Nama', 14, y);
    doc.text('Instansi', 70, y);
    doc.text('Tujuan', 120, y);
    doc.text('Tanggal', 170, y);
  } else if (jenis === 'pengunjung') {
    doc.text('Nama', 14, y);
    doc.text('Alamat', 70, y);
    doc.text('Tujuan', 120, y);
    doc.text('Tanggal', 170, y);
  } else {
    doc.text('Nama', 14, y);
    doc.text('Jenis', 70, y);
    doc.text('Tujuan', 110, y);
    doc.text('Tanggal', 160, y);
  }
  y += 8;

  // Table Content
  for (const record of stats.records) {
    const nama = doc.splitTextToSize(record.nama, 55);

    if (jenis === 'tamu') {
      const instansi = doc.splitTextToSize(record.instansi || '-', 45);
      const tujuan = doc.splitTextToSize(record.tujuan, 45);
      doc.text(nama, 14, y);
      doc.text(instansi, 70, y);
      doc.text(tujuan, 120, y);
      doc.text(record.tanggal, 170, y);
      const maxLines = Math.max(nama.length, instansi.length, tujuan.length);
      y += maxLines * 7;
    } else if (jenis === 'pengunjung') {
      const alamat = doc.splitTextToSize(record.alamat || '-', 45);
      const tujuan = doc.splitTextToSize(record.tujuan, 45);
      doc.text(nama, 14, y);
      doc.text(alamat, 70, y);
      doc.text(tujuan, 120, y);
      doc.text(record.tanggal, 170, y);
      const maxLines = Math.max(nama.length, alamat.length, tujuan.length);
      y += maxLines * 7;
    } else {
      const jenisStr = record.jenis_tamu === 'tamu' ? 'Tamu' : 'Pengunjung';
      const tujuan = doc.splitTextToSize(record.tujuan, 45);
      doc.text(nama, 14, y);
      doc.text(jenisStr, 70, y);
      doc.text(tujuan, 110, y);
      doc.text(record.tanggal, 160, y);
      const maxLines = Math.max(nama.length, tujuan.length);
      y += maxLines * 7;
    }

    // Check if we need a new page
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  }

  return new Uint8Array(doc.output('arraybuffer'));
}

export async function generateMonthlyExcel(stats: MonthlyStats, month: number, year: number, jenis?: JenisTamu): Promise<Buffer> {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Ringkasan
  const monthName = monthNames[month];
  const jenisLabel = jenis === 'tamu' ? 'Tamu' : jenis === 'pengunjung' ? 'Pengunjung' : 'Tamu & Pengunjung';
  const summaryAOA: (string | number)[][] = [
    [`Laporan ${jenisLabel} Bulan ${monthName} ${year}`],
    [],
  ];

  if (!jenis || jenis === 'tamu') {
    summaryAOA.push(['Total Tamu', stats.totalTamu]);
  }
  if (!jenis || jenis === 'pengunjung') {
    summaryAOA.push(['Total Pengunjung', stats.totalPengunjung]);
  }
  if (!jenis) {
    summaryAOA.push(['Total Seluruh', stats.records.length]);
  }
  summaryAOA.push([], ['Tujuan', 'Jumlah']);

  for (const [tujuan, count] of Object.entries(stats.tujuanSummary)) {
    summaryAOA.push([tujuan, count]);
  }

  const ws1 = XLSX.utils.aoa_to_sheet(summaryAOA);
  XLSX.utils.book_append_sheet(wb, ws1, 'Ringkasan');

  // Sheet 2: Data
  const recordsData = stats.records.map(record => {
    const base: Record<string, string | number> = {
      'ID': record.id,
      'Nama': record.nama,
    };
    if (!jenis) {
      base['Jenis'] = record.jenis_tamu === 'tamu' ? 'Tamu' : 'Pengunjung';
    }
    if (!jenis || jenis === 'tamu') {
      base['Instansi'] = record.instansi || '';
    }
    if (!jenis || jenis === 'pengunjung') {
      base['Alamat'] = record.alamat || '';
    }
    base['HP'] = record.hp || '';
    base['Tujuan'] = record.tujuan;
    base['Tanggal'] = record.tanggal;
    return base;
  });

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
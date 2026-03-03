'use client';

import { useState, useEffect } from 'react';
import { getMonthlyStats } from '@/lib/actions';
import type { MonthlyStats } from '@/lib/types';
import type { JenisTamu } from '@/lib/types';

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

export default function LaporanPage() {
  // Get current date for default values
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const [month, setMonth] = useState<number>(currentMonth);
  const [year, setYear] = useState<number>(currentYear);
  const [stats, setStats] = useState<MonthlyStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jenis, setJenis] = useState<JenisTamu | ''>('');

  // Fetch stats when month or year changes
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getMonthlyStats(year, month, jenis || undefined);
        setStats(data);
      } catch (err) {
        setError('Gagal memuat data laporan');
        console.error('Error fetching stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [month, year, jenis]);

  // Handle download
  const handleDownload = (format: 'pdf' | 'xlsx') => {
    let url = `/api/report?month=${month}&year=${year}&format=${format}`;
    if (jenis) {
      url += `&jenis=${jenis}`;
    }
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Laporan Buku Tamu Bulanan</h1>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bulan
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {monthNames.slice(1).map((name, index) => (
                  <option key={index + 1} value={index + 1}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tahun
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                min={2000}
                max={2100}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis
              </label>
              <select
                value={jenis}
                onChange={(e) => setJenis(e.target.value as JenisTamu | '')}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua</option>
                <option value="tamu">Tamu</option>
                <option value="pengunjung">Pengunjung</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Memuat data...</p>
          </div>
        )}

        {/* Stats Preview */}
        {!isLoading && stats && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Preview Laporan {jenis === 'tamu' ? 'Tamu' : jenis === 'pengunjung' ? 'Pengunjung' : 'Buku Tamu'} Bulan {monthNames[month]} {year}
            </h2>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-blue-600 mb-1">Total Tamu</p>
                <p className="text-2xl font-bold text-blue-900">{stats.totalTamu}</p>
              </div>

              <div className="bg-green-50 p-4 rounded-md">
                <p className="text-sm text-green-600 mb-1">Total Pengunjung</p>
                <p className="text-2xl font-bold text-green-900">{stats.totalPengunjung}</p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-md">
                <p className="text-sm text-yellow-600 mb-1">Total Seluruh</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.records.length}</p>
              </div>
            </div>

            {/* Tujuan Breakdown */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Tujuan Pengunjung</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(stats.tujuanSummary).map(([tujuan, count]) => (
                  <div key={tujuan} className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                    <span className="text-sm text-gray-700">{tujuan}</span>
                    <span className="text-sm font-semibold text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Record Table */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Daftar Tamu/Pengunjung</h3>
              <div className="overflow-x-auto max-h-96 overflow-y-auto border rounded-md">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="px-3 py-2">No</th>
                      <th className="px-3 py-2">Nama</th>
                      <th className="px-3 py-2">Instansi/Alamat</th>
                      <th className="px-3 py-2">HP</th>
                      <th className="px-3 py-2">Tujuan</th>
                      <th className="px-3 py-2">Jenis Tamu</th>
                      <th className="px-3 py-2">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.records.length > 0 ? (
                      stats.records.map((record, index) => (
                        <tr key={record.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-3 py-2">{index + 1}</td>
                          <td className="px-3 py-2">{record.nama}</td>
                          <td className="px-3 py-2">{record.jenis_tamu === 'tamu' ? (record.instansi || '-') : (record.alamat || '-')}</td>
                          <td className="px-3 py-2">{record.hp || '-'}</td>
                          <td className="px-3 py-2">{record.tujuan}</td>
                          <td className="px-3 py-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              record.jenis_tamu === 'tamu' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {record.jenis_tamu === 'tamu' ? 'Tamu' : 'Pengunjung'}
                            </span>
                          </td>
                          <td className="px-3 py-2">{new Date(record.tanggal).toLocaleDateString('id-ID')}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-3 py-4 text-center text-gray-500">
                          Tidak ada data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => handleDownload('pdf')}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Download PDF
              </button>

              <button
                onClick={() => handleDownload('xlsx')}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Download Excel
              </button>
            </div>
          </div>
        )}

        {/* No Records */}
        {!isLoading && !error && stats?.records.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-600">Tidak ada data tamu untuk bulan {monthNames[month]} {year}</p>
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { getMonthlyStats } from '@/lib/actions';
import type { MonthlyStats } from '@/lib/types';
import type { JenisTamu } from '@/lib/types';
import { AdminPageWrapper } from '@/components/admin/admin-page-wrapper';
import { StatCard } from '@/components/admin/stat-card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, UserCheck, FileText } from 'lucide-react';

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

  const tamuRecords = stats?.records.filter((record) => record.jenis_tamu === 'tamu') ?? [];
  const pengunjungRecords = stats?.records.filter((record) => record.jenis_tamu === 'pengunjung') ?? [];

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
    <AdminPageWrapper
      title="Laporan Buku Tamu Bulanan"
      description="Preview dan export laporan buku tamu bulanan"
      actions={
        stats && !isLoading && (
          <>
            <Button onClick={() => handleDownload('pdf')} variant="destructive">
              Export PDF
            </Button>
            <Button onClick={() => handleDownload('xlsx')} variant="default" className="bg-green-600 hover:bg-green-700">
              Export Excel
            </Button>
          </>
        )
      }
    >
      {/* Filter Section */}
      <div className="bg-card rounded-lg border shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-1">
              Bulan
            </label>
            <Select value={month.toString()} onValueChange={(value) => setMonth(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih bulan" />
              </SelectTrigger>
              <SelectContent>
                {monthNames.slice(1).map((name, index) => (
                  <SelectItem key={index + 1} value={(index + 1).toString()}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium mb-1">
              Tahun
            </label>
            <Input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              min={2000}
              max={2100}
              className="w-full"
            />
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-1">
              Jenis
            </label>
            <Select value={jenis} onValueChange={(value) => setJenis(value as JenisTamu | '')}>
              <SelectTrigger>
                <SelectValue placeholder="Semua jenis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua</SelectItem>
                <SelectItem value="tamu">Tamu</SelectItem>
                <SelectItem value="pengunjung">Pengunjung</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="bg-card rounded-lg border shadow-sm p-6 mb-6">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      )}

      {/* Stats Preview */}
      {!isLoading && stats && (
        <div className="bg-card rounded-lg border shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            Preview Laporan {jenis === 'tamu' ? 'Tamu' : jenis === 'pengunjung' ? 'Pengunjung' : 'Buku Tamu'} Bulan {monthNames[month]} {year}
          </h2>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatCard
              title="Total Tamu"
              value={stats.totalTamu}
              icon={Users}
              className="bg-blue-50 dark:bg-blue-950/20"
            />
            <StatCard
              title="Total Pengunjung"
              value={stats.totalPengunjung}
              icon={UserCheck}
              className="bg-green-50 dark:bg-green-950/20"
            />
            <StatCard
              title="Total Seluruh"
              value={stats.records.length}
              icon={FileText}
              className="bg-yellow-50 dark:bg-yellow-950/20"
            />
          </div>

          {/* Tujuan Breakdown */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Tujuan Pengunjung</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.entries(stats.tujuanSummary).map(([tujuan, count]) => (
                <div key={tujuan} className="flex justify-between items-center bg-muted/50 p-2 rounded-md">
                  <span className="text-sm text-muted-foreground">{tujuan}</span>
                  <span className="text-sm font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Record Table */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">
              {jenis === 'tamu'
                ? 'Daftar Tamu'
                : jenis === 'pengunjung'
                  ? 'Daftar Pengunjung'
                  : 'Daftar Tamu dan Pengunjung (Terpisah)'}
            </h3>
            <div className="overflow-x-auto max-h-96 overflow-y-auto border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">No</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Instansi/Alamat</TableHead>
                    <TableHead>HP</TableHead>
                    <TableHead>Tujuan</TableHead>
                    <TableHead>Jenis Tamu</TableHead>
                    <TableHead>Tanggal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.records.length > 0 ? (
                    jenis ? (
                      stats.records.map((record, index) => (
                        <TableRow key={record.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-medium">{record.nama}</TableCell>
                          <TableCell>{record.jenis_tamu === 'tamu' ? (record.instansi || '-') : (record.alamat || '-')}</TableCell>
                          <TableCell>{record.hp || '-'}</TableCell>
                          <TableCell>{record.tujuan}</TableCell>
                          <TableCell>
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              record.jenis_tamu === 'tamu'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            }`}>
                              {record.jenis_tamu === 'tamu' ? 'Tamu' : 'Pengunjung'}
                            </span>
                          </TableCell>
                          <TableCell>{new Date(record.tanggal).toLocaleDateString('id-ID')}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <>
                        <TableRow className="bg-blue-50 dark:bg-blue-950/20">
                          <TableCell colSpan={7} className="font-semibold text-blue-900 dark:text-blue-100">Data Tamu</TableCell>
                        </TableRow>
                        {tamuRecords.length > 0 ? tamuRecords.map((record, index) => (
                          <TableRow key={record.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="font-medium">{record.nama}</TableCell>
                            <TableCell>{record.instansi || '-'}</TableCell>
                            <TableCell>{record.hp || '-'}</TableCell>
                            <TableCell>{record.tujuan}</TableCell>
                            <TableCell>
                              <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                Tamu
                              </span>
                            </TableCell>
                            <TableCell>{new Date(record.tanggal).toLocaleDateString('id-ID')}</TableCell>
                          </TableRow>
                        )) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-muted-foreground text-center py-4">
                              Tidak ada data tamu
                            </TableCell>
                          </TableRow>
                        )}

                        <TableRow className="bg-green-50 dark:bg-green-950/20">
                          <TableCell colSpan={7} className="font-semibold text-green-900 dark:text-green-100">Data Pengunjung</TableCell>
                        </TableRow>
                        {pengunjungRecords.length > 0 ? pengunjungRecords.map((record, index) => (
                          <TableRow key={record.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="font-medium">{record.nama}</TableCell>
                            <TableCell>{record.alamat || '-'}</TableCell>
                            <TableCell>{record.hp || '-'}</TableCell>
                            <TableCell>{record.tujuan}</TableCell>
                            <TableCell>
                              <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                Pengunjung
                              </span>
                            </TableCell>
                            <TableCell>{new Date(record.tanggal).toLocaleDateString('id-ID')}</TableCell>
                          </TableRow>
                        )) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-muted-foreground text-center py-4">
                              Tidak ada data pengunjung
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    )
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-muted-foreground text-center py-4">
                        Tidak ada data
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}

      {/* No Records */}
      {!isLoading && !error && stats?.records.length === 0 && (
        <div className="bg-card rounded-lg border shadow-sm p-8 text-center">
          <p className="text-muted-foreground">Tidak ada data tamu untuk bulan {monthNames[month]} {year}</p>
        </div>
      )}
    </AdminPageWrapper>
  );
}

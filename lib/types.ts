export type JenisTamu = 'tamu' | 'pengunjung';
export type TujuanPengunjung = 'Informasi Perkara' | 'Pengaduan' | 'Pendaftaran Perkara' | 'Menghadiri Sidang' | 'Pengambilan Produk' | 'Lainnya';

export interface Tamu {
  id: number;
  jenis_tamu: JenisTamu;
  nama: string;
  alamat: string | null;
  instansi: string | null;
  hp: string | null;
  tujuan: string;
  tanggal: string;
  old_id: number | null;
}

export interface TamuListParams {
  jenis_tamu: JenisTamu;
  page: number;
  perPage: number;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export type ActionResult = { success: boolean; message: string; id?: number };

export interface MonthlyStats {
  records: Tamu[];
  totalTamu: number;
  totalPengunjung: number;
  tujuanSummary: Record<string, number>;
}

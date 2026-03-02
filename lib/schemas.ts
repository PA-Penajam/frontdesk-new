import { z } from 'zod';
import { TujuanPengunjung } from './types';

export const tamuFormSchema = z.object({
  nama: z.string().min(1, 'Nama harus diisi'),
  instansi: z.string().optional(),
  hp: z.string().optional(),
  tujuan: z.string().min(1, 'Tujuan harus diisi'),
});

export const pengunjungFormSchema = z.object({
  nama: z.string().min(1, 'Nama harus diisi'),
  alamat: z.string().optional(),
  hp: z.string().optional(),
  tujuan: z.enum(['Informasi Perkara', 'Pengaduan', 'Pendaftaran Perkara', 'Menghadiri Sidang', 'Pengambilan Produk', 'Lainnya'], {
    errorMap: () => ({ message: 'Tujuan harus dipilih' }),
  }),
});

export const loginSchema = z.object({
  password: z.string().min(1, 'Password harus diisi'),
});

export type TamuFormInput = z.infer<typeof tamuFormSchema>;
export type PengunjungFormInput = z.infer<typeof pengunjungFormSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

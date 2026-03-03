# Frontdesk - Sistem Buku Tamu Digital

Aplikasi buku tamu digital untuk pencatatan tamu dan pengunjung, dibangun menggunakan Next.js 16, React 19, dan SQLite.

## Fitur

- Formulir buku tamu dan buku pengunjung
- Dashboard admin dengan autentikasi
- Pencarian dan filter berdasarkan tanggal
- Export data ke CSV dan Excel
- Laporan bulanan (PDF dan Excel)

## Tech Stack

| Komponen | Teknologi |
| --- | --- |
| Framework | Next.js 16.1.6 |
| UI | React 19, Tailwind CSS 4, shadcn/ui |
| Database | SQLite (better-sqlite3) |
| Auth | bcryptjs + httpOnly cookie session |
| Bahasa | TypeScript |

## Persyaratan

- Node.js v24 atau lebih tinggi
- pnpm

## Instalasi

### 1. Clone repositori

```bash
git clone git@github.com:PA-Penajam/frontdesk-new.git
cd frontdesk-new
```

### 2. Install dependensi

```bash
pnpm install
```

### 3. Konfigurasi environment

```bash
cp .env.example .env
```

Buka file `.env` dan isi `ADMIN_PASSWORD_HASH` dengan hash bcrypt dari password admin.

Generate hash menggunakan perintah berikut:

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('PASSWORD_ANDA', 10).then(h => console.log(h))"
```

Salin output ke `.env`:

```
ADMIN_PASSWORD_HASH=$2a$10$hasil_hash_anda
```

### 4. Build dan jalankan

```bash
# Build produksi
pnpm build

# Jalankan server
pnpm start
```

Aplikasi berjalan di [http://localhost:3000](http://localhost:3000).

## Development

```bash
pnpm dev
```

### Menjalankan test

```bash
pnpm test
```

### Lint

```bash
pnpm lint
```

## Migrasi Data (Opsional)

Jika memiliki data lama dalam format JSON, jalankan:

```bash
pnpm migrate
```

## Struktur Route

| Route | Deskripsi |
| --- | --- |
| `/` | Halaman utama |
| `/buku-tamu` | Formulir buku tamu |
| `/buku-pengunjung` | Formulir buku pengunjung |
| `/login` | Login admin |
| `/admin/daftar-tamu` | Daftar tamu (admin) |
| `/admin/daftar-pengunjung` | Daftar pengunjung (admin) |
| `/admin/laporan` | Laporan bulanan (admin) |

## Deploy Produksi

Panduan lengkap deployment ke VPS (PM2, Nginx, SSL, backup) tersedia di [DEPLOYMENT.md](DEPLOYMENT.md).

## Lisensi

Lihat file [LICENSE](LICENSE).

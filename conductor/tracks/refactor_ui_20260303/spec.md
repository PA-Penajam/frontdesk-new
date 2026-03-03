# Specification: Refactor Landing Page & Guest Form UI (Stitch Style)

## Objective
Melakukan perombakan visual pada halaman utama (Landing Page) dan formulir pendaftaran (Buku Tamu & Buku Pengunjung) untuk mengikuti standar desain Stitch Project. Implementasi harus menggunakan Shadcn UI untuk komponen dasar dan MagicUI untuk elemen interaktif yang modern.

## Scope
- **Landing Page (`app/page.tsx`)**: Refactor layout menggunakan komponen `BlurFade` dan `MagicCard`.
- **Buku Tamu Form (`app/buku-tamu/page.tsx`)**: Refactor formulir dengan input yang lebih modern, validasi visual yang jelas, dan animasi `motion`.
- **Buku Pengunjung Form (`app/buku-pengunjung/page.tsx`)**: Refactor serupa dengan formulir buku tamu.
- **Global Layout (`app/layout.tsx`)**: Integrasi navigasi (Sidebar/Header) yang lebih responsif dan dukungan Dark Mode yang lebih baik.

## Requirements
- Mengikuti prinsip **Clarity First** dan **Frictionless Flow**.
- Mempertahankan fungsionalitas backend dan validasi schema Zod yang sudah ada.
- Menjamin responsivitas penuh pada perangkat mobile.
- Menggunakan skema warna yang konsisten dengan identitas instansi.

## Success Criteria
- UI terlihat modern, bersih, dan profesional (Stitch style).
- Semua form berfungsi dengan validasi yang benar.
- Lolos pengujian responsivitas dan aksesibilitas dasar (kontras tinggi).
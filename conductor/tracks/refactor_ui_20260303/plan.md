# Implementation Plan: Refactor Landing Page & Guest Form UI

## Phase 1: Foundation & Global UI
- [ ] Task: Integrasi Shadcn & MagicUI Theme
    - [ ] Periksa dan sesuaikan `globals.css` dengan variabel CSS Tailwind 4.
    - [ ] Pastikan konfigurasi `ThemeProvider` (next-themes) berfungsi optimal untuk Dark Mode.
- [ ] Task: Refactor Layout & Navigation
    - [ ] Refactor `app/layout.tsx` untuk menyertakan navigasi modern yang responsif.
    - [ ] Update `components/header.tsx` dan `components/footer.tsx` dengan desain Stitch.

## Phase 2: Landing Page Refactor
- [ ] Task: Re-design Landing Page (`app/page.tsx`)
    - [ ] Implementasi `BlurFade` untuk animasi masuk konten.
    - [ ] Gunakan `MagicCard` untuk navigasi ke formulir buku tamu/pengunjung.
    - [ ] Tambahkan elemen hero yang menarik dan informatif.

## Phase 3: Guest Forms Refactor
- [ ] Task: Refactor Buku Tamu Form (`app/buku-tamu/page.tsx`)
    - [ ] Write Tests: Pastikan validasi form tetap berjalan.
    - [ ] Implementasi UI baru menggunakan `AnimatedList` atau komponen transisi MagicUI.
    - [ ] Refactor input fields menggunakan Shadcn `Input`, `Select`, dan `Textarea` yang distyle ulang.
- [ ] Task: Refactor Buku Pengunjung Form (`app/buku-pengunjung/page.tsx`)
    - [ ] Write Tests: Pastikan validasi form tetap berjalan.
    - [ ] Sinkronisasi desain dengan Buku Tamu Form untuk konsistensi.

## Phase 4: Finalization & Verification
- [ ] Task: Visual QA & Accessibility Check
    - [ ] Verifikasi kontras warna dan keterbacaan pada light/dark mode.
    - [ ] Uji responsivitas pada berbagai ukuran layar (Mobile, Tablet, Desktop).
- [ ] Task: Conductor - User Manual Verification 'Finalization & Verification' (Protocol in workflow.md)
- [ ] Task: Conductor - User Manual Verification 'Guest Forms Refactor' (Protocol in workflow.md)
- [ ] Task: Conductor - User Manual Verification 'Landing Page Refactor' (Protocol in workflow.md)
- [ ] Task: Conductor - User Manual Verification 'Foundation & Global UI' (Protocol in workflow.md)
# Product Guidelines: Frontdesk Digital (Refactor UI/UX)

## Bahasa & Komunikasi (Tone of Voice)
- **Gaya Bahasa**: Ramah & Terbuka. Gunakan Bahasa Indonesia yang akrab namun tetap menjaga kesantunan profesional.
- **Prinsip**: Hindari jargon teknis yang membingungkan bagi tamu umum. Gunakan instruksi yang suportif dan informatif.

## Prinsip User Experience (UX)
- **Clarity First**: Fokuskan perhatian pengguna pada elemen aksi utama dalam 3 detik pertama (misalnya, tombol "Isi Buku Tamu").
- **Frictionless Flow**: Minimalisir hambatan dalam alur kerja. Pastikan jumlah klik dari awal pengisian hingga selesai sesedikit mungkin.
- **Immediate Feedback**: Berikan feedback visual instan untuk setiap aksi (loading state, toast notification, atau animasi transisi) agar pengguna merasa sistem merespons dengan cepat.

## Desain Visual & UI
- **Estetika**: Mengikuti standar Stitch Project dengan penggunaan Shadcn UI untuk komponen dasar dan MagicUI untuk elemen interaktif yang memukau.
- **Konsistensi**: Gunakan sistem grid dan spacing yang konsisten di seluruh halaman admin dan publik.
- **Branding**: Tampilkan identitas instansi dengan cara yang elegan (misalnya melalui penggunaan warna aksen dan logo yang proporsional).

## Aksesibilitas & Inklusivitas
- **Kontras & Keterbacaan**: Pastikan kontras warna memenuhi standar untuk memudahkan pengguna dengan gangguan penglihatan ringan.
- **Tipografi**: Gunakan ukuran font yang cukup besar dan jenis huruf yang sangat mudah dibaca (Readability).
- **Dark Mode Support**: Pastikan semua elemen UI tetap terbaca dan estetis saat beralih ke mode gelap.

## Performa Visual
- **Optimasi Animasi**: Pastikan penggunaan MagicUI tidak menghambat performa perangkat dengan spesifikasi rendah (Smooth Animations).
- **Layout Shift**: Hindari perubahan layout yang tiba-tiba saat data dimuat (Gunakan Skeleton Screens).
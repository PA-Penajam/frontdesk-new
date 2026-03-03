# Technology Stack: Frontdesk Digital (Refactor UI/UX)

## Core Technologies
- **Framework**: Next.js 16.1.6 (App Router) - Memanfaatkan React 19 Server Components.
- **Language**: TypeScript - Untuk keamanan tipe data dan pengembangan yang kuat.
- **Runtime**: Node.js v24 (LTS) - Mesin utama backend.

## UI/UX Engineering
- **Styling**: Tailwind CSS 4 - Framework CSS utilitas utama.
- **UI Components**: Shadcn UI (Radix UI Primitives) - Fondasi komponen UI yang aksesibel.
- **Interactive UI**: MagicUI (Motion/Framer-Motion) - Animasi tingkat lanjut dan elemen visual modern.
- **Icons**: Lucide React - Library ikon yang konsisten.
- **Form Management**: React Hook Form + Zod - Penanganan form dan validasi skema.
- **Notifications**: Sonner - Toast library untuk feedback instan.

## Data & State Management
- **Database**: SQLite (via `better-sqlite3`) - Penyimpanan data yang ringan dan cepat.
- **ORM/Scripts**: tsx/migrate.ts - Untuk penanganan migrasi data.
- **Table Management**: TanStack Table v8 - Penanganan tabel data admin yang kompleks.

## Authentication & Security
- **Auth Strategy**: Custom Session Cookies + bcryptjs - Penanganan keamanan login admin.
- **Encryption**: bcryptjs - Hashing password admin.

## Tools & Testing
- **Package Manager**: pnpm - Efisiensi manajemen dependensi.
- **Testing**: Vitest - Framework pengujian performa tinggi.
- **Linting**: ESLint v9 - Penjagaan kualitas kode.
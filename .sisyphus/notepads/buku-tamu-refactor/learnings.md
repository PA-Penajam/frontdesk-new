# Task 7: Server Actions for CRUD, List with Filter/Search/Pagination, Delete

## Learnings

1. **Server Actions with `'use server'` Directive**: Next.js 16 server actions allow direct database operations from React components without API routes, simplifying code and reducing boilerplate.
2. **Type-Safe Operations**: Zod schemas ensure type safety and validation for form inputs, providing meaningful error messages.
3. **SQLite with better-sqlite3**: Direct SQLite access using `better-sqlite3` is fast and lightweight, with prepared statements preventing SQL injection.
4. **In-Memory Database Testing**: `getTestDb()` creates an in-memory SQLite database for fast, isolated tests. Seeds are transactional for consistency.
5. **Mocking Next.js Utilities**: `vi.mock()` from Vitest is used to mock `revalidatePath` and `cookies()` for testing server actions outside request context.
6. **Pagination and Filtering**: Dynamic SQL query building with search, date range, and pagination works well with SQLite's LIKE and BETWEEN operators.
7. **Error Handling**: Try/catch blocks with user-friendly messages improve UX when operations fail.

## Findings

- **SQLite Date Handling**: Dates are stored as strings (YYYY-MM-DD HH:MM:SS), simplifying date comparisons without timezone issues.
- **Transactional Seed Data**: Using transactions for seeding ensures test data is rolled back after each test run.
- **Performance Optimizations**: Indexes on `jenis_tamu` and `tanggal` fields in the `tamu` table speed up filtering and sorting queries.

## References

- Next.js 16 Server Actions documentation
- better-sqlite3 API reference
- Vitest testing framework
- Zod validation library

## Task 8: Login Page & Auth Server Actions

**Implementasi:** Login page dengan React Hook Form + Zod untuk validasi, dan server actions dengan Session Cookie.

**Key Learnings:**
1. Server Actions harus diannotasikan dengan 'use server' dan tidak boleh memanggil redirect() di dalamnya jika ingin diuji (karena akan melempar exception di context test).
2. Mocking dependencies di Vitest untuk Server Actions:
   - Gunakan vi.mock untuk module eksternal (next/navigation, next/headers)
   - Gunakan vi.mock untuk internal modules (lib/auth)
   - Clear all mocks sebelum setiap test dengan beforeEach() untuk menghindari tumpang tindih
3. React Hook Form + Zod Resolver adalah kombinasi yang powerful untuk form validation dengan type safety.
4. Session management dengan HttpOnly cookies lebih aman daripada localStorage, karena tidak bisa diakses oleh JavaScript di browser.
5. Penting untuk menampilkan loading state pada form submit untuk pengalaman user yang baik.

**File created/modified:**
- app/login/page.tsx: Client component login dengan RHF + Zod
- lib/actions-auth.ts: Server actions login dan logout
- lib/__tests__/actions-auth.test.ts: TDD tests untuk server actions

**Build:** Gagal karena unrelated TypeScript error di scripts/migrate.ts (property count pada object {}).
## Task 13: Admin Layout + Auth Guard Middleware

- **Created `middleware.ts` at project root**: Auth guard that protects `/admin/*` routes by checking for the presence of `admin-session` cookie. If not present, redirects to `/login`.
- **Created `app/admin/layout.tsx`**: Admin sidebar layout using shadcn/ui Sidebar component with navigation links:
  - Daftar Tamu → `/admin/daftar-tamu`
  - Daftar Pengunjung → `/admin/daftar-pengunjung`
  - Cetak Laporan → `/admin/cetak-laporan`
  - Logout button calling `logoutAction` from lib/actions-auth.ts

**Key Notes**:
- Middleware runs in Edge runtime: Use `request.cookies` instead of `cookies()` from next/headers (which is not available in Edge)
- Simple cookie existence check is sufficient for middleware auth guard
- Admin layout uses shadcn/ui Sidebar component with dark theme (slate-900) and gradient header

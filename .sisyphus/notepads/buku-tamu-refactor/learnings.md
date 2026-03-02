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

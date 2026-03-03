import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createTamu, createPengunjung, listTamu, deleteTamu, getMonthlyStats } from '../actions'
import { getTestDb, seedTestData } from '../test-utils'
import type { Database } from 'better-sqlite3'

// Mock Next.js cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}))

// Mock cookies (if needed)
vi.mock('next/headers', () => ({
  cookies: vi.fn()
}))

describe('Server Actions', () => {
  let testDb: Database

  beforeEach(() => {
    testDb = getTestDb()
  })

  describe('createTamu', () => {
    it('should insert record and return success with id', async () => {
      const result = await createTamu({
        nama: 'Test Tamu',
        instansi: 'Test Instansi',
        hp: '08123456789',
        tujuan: 'Test Tujuan'
      }, testDb)

      expect(result.success).toBe(true)
      expect(result.id).toBeDefined()
      expect(result.message).toContain('berhasil')
    })

    it('should reject invalid data (empty nama) with success=false', async () => {
      const result = await createTamu({
        nama: '',
        instansi: 'Test Instansi',
        hp: '08123456789',
        tujuan: 'Test Tujuan'
      }, testDb)

      expect(result.success).toBe(false)
      expect(result.id).not.toBeDefined()
      expect(result.message).toContain('Nama')
    })
  })

  describe('createPengunjung', () => {
    it('should insert with correct jenis_tamu="pengunjung"', async () => {
      const result = await createPengunjung({
        nama: 'Test Pengunjung',
        alamat: 'Test Alamat',
        hp: '08987654321',
        tujuan: 'Informasi Perkara'
      }, testDb)

      expect(result.success).toBe(true)
      
      const inserted = testDb.prepare('SELECT * FROM tamu WHERE id = ?').get(result.id)
      expect(inserted.jenis_tamu).toBe('pengunjung')
    })
  })

  describe('listTamu', () => {
    it('should return paginated results (seed 25, page 1, perPage 10 → length 10, total 25, totalPages 3)', async () => {
      const records = Array.from({ length: 25 }, (_, i) => ({
        jenis_tamu: 'tamu',
        nama: `Test Tamu ${i + 1}`,
        instansi: `Instansi ${i + 1}`,
        hp: `0812345678${i}`,
        tujuan: `Tujuan ${i + 1}`,
        tanggal: `2024-03-0${i % 9 + 1}`
      }))
      seedTestData(testDb, records)

      const result = await listTamu({
        jenis_tamu: 'tamu',
        page: 1,
        perPage: 10
      }, testDb)

      expect(result.data.length).toBe(10)
      expect(result.total).toBe(25)
      expect(result.totalPages).toBe(3)
      expect(result.page).toBe(1)
      expect(result.perPage).toBe(10)
    })

    it('should filter by search term (search matches nama)', async () => {
      const records = [
        { jenis_tamu: 'tamu', nama: 'John Doe', instansi: 'Company A', hp: '081', tujuan: 'Meeting' },
        { jenis_tamu: 'tamu', nama: 'Jane Smith', instansi: 'Company B', hp: '082', tujuan: 'Presentation' },
        { jenis_tamu: 'tamu', nama: 'Jim Brown', instansi: 'Company C', hp: '083', tujuan: 'Training' }
      ]
      seedTestData(testDb, records)

      const result = await listTamu({
        jenis_tamu: 'tamu',
        page: 1,
        perPage: 10,
        search: 'Jane'
      }, testDb)

      expect(result.data.length).toBe(1)
      expect(result.data[0].nama).toBe('Jane Smith')
    })

    it('should filter by date range', async () => {
      const records = [
        { jenis_tamu: 'tamu', nama: 'Test 1', instansi: 'A', hp: '081', tujuan: 'T', tanggal: '2024-03-01' },
        { jenis_tamu: 'tamu', nama: 'Test 2', instansi: 'B', hp: '082', tujuan: 'T', tanggal: '2024-03-15' },
        { jenis_tamu: 'tamu', nama: 'Test 3', instansi: 'C', hp: '083', tujuan: 'T', tanggal: '2024-03-30' }
      ]
      seedTestData(testDb, records)

      const result = await listTamu({
        jenis_tamu: 'tamu',
        page: 1,
        perPage: 10,
        startDate: '2024-03-10',
        endDate: '2024-03-20'
      }, testDb)

      expect(result.data.length).toBe(1)
      expect(result.data[0].tanggal).toBe('2024-03-15')
    })
  })

  describe('deleteTamu', () => {
    it('should remove record (count decreases)', async () => {
      const insertResult = testDb.prepare('INSERT INTO tamu (jenis_tamu, nama, tujuan) VALUES (?, ?, ?)').run('tamu', 'Delete Test', 'Test')
      
      const countBefore = testDb.prepare('SELECT COUNT(*) as count FROM tamu').get().count
      
      const deleteResult = await deleteTamu(insertResult.lastInsertRowid as number, testDb)
      
      const countAfter = testDb.prepare('SELECT COUNT(*) as count FROM tamu').get().count

      expect(deleteResult.success).toBe(true)
      expect(countAfter).toBe(countBefore - 1)
    })

    it('should return error for non-existent ID', async () => {
      const result = await deleteTamu(9999, testDb)

      expect(result.success).toBe(false)
      expect(result.message).toContain('tidak ditemukan')
    })
  })

  describe('getMonthlyStats', () => {
    it('should return correct counts for month', async () => {
      const records = [
        { jenis_tamu: 'tamu', nama: 'Tamu 1', instansi: 'A', hp: '081', tujuan: 'Meeting', tanggal: '2024-03-05' },
        { jenis_tamu: 'tamu', nama: 'Tamu 2', instansi: 'B', hp: '082', tujuan: 'Presentation', tanggal: '2024-03-10' },
        { jenis_tamu: 'pengunjung', nama: 'Pengunjung 1', alamat: 'Alamat 1', hp: '083', tujuan: 'Informasi Perkara', tanggal: '2024-03-15' },
        { jenis_tamu: 'pengunjung', nama: 'Pengunjung 2', alamat: 'Alamat 2', hp: '084', tujuan: 'Pengaduan', tanggal: '2024-03-20' },
        { jenis_tamu: 'pengunjung', nama: 'Pengunjung 3', alamat: 'Alamat 3', hp: '085', tujuan: 'Informasi Perkara', tanggal: '2024-03-25' },
        { jenis_tamu: 'tamu', nama: 'Tamu 3', instansi: 'C', hp: '086', tujuan: 'Training', tanggal: '2024-04-01' } // Different month
      ]
      seedTestData(testDb, records)

      const stats = await getMonthlyStats(2024, 3, undefined, testDb)

      expect(stats.totalTamu).toBe(2)
      expect(stats.totalPengunjung).toBe(3)
      expect(stats.records.length).toBe(5) // Excluding April record
      expect(stats.tujuanSummary['Informasi Perkara']).toBe(2)
    })
  })
})

'use server'

import { revalidatePath } from 'next/cache'
import { getDb } from './db'
import { tamuFormSchema, pengunjungFormSchema } from './schemas'
import type { Tamu, TamuListParams, PaginatedResult, ActionResult, MonthlyStats, JenisTamu } from './types'
import type { TamuFormInput, PengunjungFormInput } from './schemas'
import type { Database } from 'better-sqlite3'

// Helper function to get database (accepts optional db for testing)
function getDatabase(db?: Database) {
  return db || getDb()
}

// 1. Create Tamu
export async function createTamu(formData: TamuFormInput, db?: Database): Promise<ActionResult> {
  try {
    const validatedData = tamuFormSchema.parse(formData)
    const database = getDatabase(db)
    const result = database
      .prepare(
        `INSERT INTO tamu (
          jenis_tamu, nama, instansi, hp, tujuan, tanggal
        ) VALUES (?, ?, ?, ?, ?, datetime('now', 'localtime'))`
      )
      .run('tamu', validatedData.nama, validatedData.instansi || null, validatedData.hp || null, validatedData.tujuan)

    revalidatePath('/admin/daftar-tamu')
    return {
      success: true,
      message: 'Tamu berhasil ditambahkan',
      id: result.lastInsertRowid as number
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menambahkan tamu'
    return {
      success: false,
      message
    }
  }
}

// 2. Create Pengunjung
export async function createPengunjung(formData: PengunjungFormInput, db?: Database): Promise<ActionResult> {
  try {
    const validatedData = pengunjungFormSchema.parse(formData)
    const database = getDatabase(db)
    const result = database
      .prepare(
        `INSERT INTO tamu (
          jenis_tamu, nama, alamat, hp, tujuan, tanggal
        ) VALUES (?, ?, ?, ?, ?, datetime('now', 'localtime'))`
      )
      .run('pengunjung', validatedData.nama, validatedData.alamat || null, validatedData.hp || null, validatedData.tujuan)

    revalidatePath('/admin/daftar-pengunjung')
    return {
      success: true,
      message: 'Pengunjung berhasil ditambahkan',
      id: result.lastInsertRowid as number
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menambahkan pengunjung'
    return {
      success: false,
      message
    }
  }
}

// 3. List Tamu with Filter/Search/Pagination
 export async function listTamu(params: TamuListParams, db?: Database): Promise<PaginatedResult<Tamu>> {
  const database = getDatabase(db)
  
  // Build query
  let whereClause = `jenis_tamu = ?`
  const queryParams: (string | number)[] = [params.jenis_tamu]

  if (params.search) {
    whereClause += ` AND (nama LIKE ? OR instansi LIKE ? OR alamat LIKE ?)`
    const searchTerm = `%${params.search}%`
    queryParams.push(searchTerm, searchTerm, searchTerm)
  }

  if (params.startDate && params.endDate) {
    const start = params.startDate <= params.endDate ? params.startDate : params.endDate
    const end = params.startDate <= params.endDate ? params.endDate : params.startDate
    whereClause += ` AND tanggal >= ? AND tanggal <= ?`
    queryParams.push(start + ' 00:00:00', end + ' 23:59:59')
  } else if (params.startDate) {
    whereClause += ` AND tanggal >= ?`
    queryParams.push(params.startDate + ' 00:00:00')
  } else if (params.endDate) {
    whereClause += ` AND tanggal <= ?`
    queryParams.push(params.endDate + ' 23:59:59')
  }

  // Count total records for pagination
  const countQuery = `SELECT COUNT(*) as total FROM tamu WHERE ${whereClause}`
  const countResult = database.prepare(countQuery).get(...queryParams) as { total: number }
  const total = countResult.total

  // Apply pagination
  const offset = (params.page - 1) * params.perPage
  const dataQuery = `SELECT * FROM tamu WHERE ${whereClause} ORDER BY tanggal DESC LIMIT ? OFFSET ?`
  queryParams.push(params.perPage, offset)

  // Get data
  const data = database.prepare(dataQuery).all(...queryParams) as Tamu[]

  return {
    data,
    total,
    page: params.page,
    perPage: params.perPage,
    totalPages: Math.ceil(total / params.perPage)
  }
}

// 4. Delete Tamu
export async function deleteTamu(id: number, db?: Database): Promise<ActionResult> {
  try {
    const database = getDatabase(db)
    
    const result = database.prepare('DELETE FROM tamu WHERE id = ?').run(id)

    if (result.changes === 0) {
      return {
        success: false,
        message: 'Data tamu tidak ditemukan'
      }
    }

    // Revalidate both admin pages
    revalidatePath('/admin/daftar-tamu')
    revalidatePath('/admin/daftar-pengunjung')
    
    return {
      success: true,
      message: 'Tamu berhasil dihapus'
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menghapus tamu'
    return {
      success: false,
      message
    }
  }
}

// 5. Get Monthly Stats
export async function getMonthlyStats(year: number, month: number, jenis?: JenisTamu, db?: Database): Promise<MonthlyStats> {
  const database = getDatabase(db)
  
  const monthStr = String(month).padStart(2, '0')
  const datePattern = `${year}-${monthStr}-%`

  let query = `SELECT * FROM tamu WHERE tanggal LIKE ?`
  const params: (string)[] = [datePattern]

  if (jenis) {
    query += ` AND jenis_tamu = ?`
    params.push(jenis)
  }

  const records = database
    .prepare(query)
    .all(...params) as Tamu[]

  // Calculate stats
  const totalTamu = records.filter(r => r.jenis_tamu === 'tamu').length
  const totalPengunjung = records.filter(r => r.jenis_tamu === 'pengunjung').length
  
  const tujuanSummary: Record<string, number> = {}
  for (const record of records) {
    tujuanSummary[record.tujuan] = (tujuanSummary[record.tujuan] || 0) + 1
  }

  return {
    records,
    totalTamu,
    totalPengunjung,
    tujuanSummary
  }
}

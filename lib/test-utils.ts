import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

/**
 * Creates an in-memory SQLite database for testing purposes.
 * Reads and executes the schema from scripts/schema.sql.
 * Handles case when schema file is missing by inlining minimal schema.
 * @returns A connected Database instance
 */
export function getTestDb() {
  const db = new Database(':memory:');
  
  try {
    // Try to read schema from file first
    const schemaPath = path.resolve(process.cwd(), 'scripts/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schemaSql);
  } catch (error) {
    // Fallback to inline schema if file is missing
    db.exec(`
      CREATE TABLE IF NOT EXISTS tamu (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        jenis_tamu TEXT NOT NULL CHECK(jenis_tamu IN ('tamu', 'pengunjung')),
        nama TEXT NOT NULL,
        alamat TEXT,
        instansi TEXT,
        hp TEXT,
        tujuan TEXT NOT NULL,
        tanggal TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
        old_id INTEGER
      );
      CREATE INDEX IF NOT EXISTS idx_tamu_jenis ON tamu(jenis_tamu);
      CREATE INDEX IF NOT EXISTS idx_tamu_tanggal ON tamu(tanggal);
    `);
  }
  
  return db;
}

/**
 * Seed test data into the tamu table.
 * @param db The connected Database instance
 * @param records Array of partial Tamu records to insert
 */
export function seedTestData(db: import('better-sqlite3').Database, records: Partial<{
  jenis_tamu: 'tamu' | 'pengunjung';
  nama: string;
  alamat?: string;
  instansi?: string;
  hp?: string;
  tujuan: string;
  tanggal?: string;
  old_id?: number;
}>[]) {
  const insertStmt = db.prepare(`
    INSERT INTO tamu (
      jenis_tamu,
      nama,
      alamat,
      instansi,
      hp,
      tujuan,
      tanggal,
      old_id
    ) VALUES (
      @jenis_tamu,
      @nama,
      @alamat,
      @instansi,
      @hp,
      @tujuan,
      @tanggal,
      @old_id
    )
  `);
  
  const transaction = db.transaction((transRecords: typeof records) => {
    for (const record of transRecords) {
      insertStmt.run(record);
    }
  });
  
  transaction(records);
}
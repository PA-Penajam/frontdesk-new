import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

// Raw record type from JSON file
interface RawRecord {
  id: number;
  jenis_tamu: string;
  tanggal: string;
  nama: string;
  alamat: string | null;
  instansi: string | null;
  hp: string | null;
  tujuan: string;
}

// Cleaned record type
type CleanedRecord = Omit<RawRecord, 'id'> & { id: number; [key: string]: unknown };

// Migration result type
interface MigrationResult {
  totalInserted: number;
  tamuCount: number;
  pengunjungCount: number;
}

// Clean a single record
function cleanRecord(record: RawRecord): CleanedRecord {
  // Trim all string fields
  const cleaned: CleanedRecord = { ...record } as CleanedRecord;
  for (const key in cleaned) {
    const value = cleaned[key];
    if (typeof value === 'string') {
      cleaned[key] = value.trim();
    }
  }

  // Convert empty strings to null
  if (cleaned.alamat === '') cleaned.alamat = null;
  if (cleaned.instansi === '') cleaned.instansi = null;
  if (cleaned.hp === '') cleaned.hp = null;
  if (cleaned.tujuan === '') cleaned.tujuan = 'Lainnya'; // Default if empty
  if (cleaned.nama === '') cleaned.nama = 'Tamu Tidak Diketahui'; // Default if empty

  // Clean hp: remove non-phone characters and check validity
  if (typeof cleaned.hp === 'string') {
    // Check if contains non-phone characters
    const hasNonPhoneChars = cleaned.hp.replace(/[0-9+\-\s]/g, '') !== '';
    const isTooShort = cleaned.hp.trim().length < 5;
    if (hasNonPhoneChars || isTooShort) {
      cleaned.hp = null;
    }
  }

  // Clean nama: remove backticks
  if (typeof cleaned.nama === 'string') {
    cleaned.nama = cleaned.nama.replace(/`/g, '');
  }

  // Ensure jenis_tamu is valid
  if (cleaned.jenis_tamu !== 'tamu' && cleaned.jenis_tamu !== 'pengunjung') {
    cleaned.jenis_tamu = 'tamu'; // Default to tamu if invalid
  }

  return cleaned;
}

// Main migration function (export for testing)
export function runMigration(
  db: Database.Database,
  records: RawRecord[]
): MigrationResult {
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
      @id
    )
  `);

  // Run in transaction for performance
  const transaction = db.transaction((transRecords: RawRecord[]) => {
    for (const record of transRecords) {
      const cleaned = cleanRecord(record);
      insertStmt.run(cleaned);
    }
  });

  transaction(records);

  // Count inserted records
  const tamuCount = (db.prepare('SELECT COUNT(*) as count FROM tamu WHERE jenis_tamu = ?').get('tamu') as { count: number }).count;
  const pengunjungCount = (db.prepare('SELECT COUNT(*) as count FROM tamu WHERE jenis_tamu = ?').get('pengunjung') as { count: number }).count;

  return {
    totalInserted: records.length,
    tamuCount,
    pengunjungCount,
  };
}

// Main execution if run directly
if (require.main === module) {
  // Resolve paths
  const jsonPath = path.resolve(process.cwd(), '../frontdesk-old/frontdesk-merged.json');
  const dbPath = path.resolve(process.cwd(), 'data', 'frontdesk.db');

  // Ensure data directory exists
  const dataDir = path.dirname(dbPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Read JSON file
  console.log('Reading JSON file:', jsonPath);
  const jsonData = fs.readFileSync(jsonPath, 'utf8');
  const records: RawRecord[] = JSON.parse(jsonData);

  console.log(`Found ${records.length} records in JSON file`);

  // Open database connection
  console.log('Opening SQLite database:', dbPath);
  const db = new Database(dbPath);

  // Enable WAL mode for better performance
  db.pragma('journal_mode = WAL');

  // Read and execute schema SQL
  const schemaPath = path.resolve(process.cwd(), 'scripts', 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schemaSQL);
  }

  // Run migration
  console.log('Starting migration...');
  const result = runMigration(db, records);

  console.log(`Migration complete!`);
  console.log(`Total records inserted: ${result.totalInserted}`);
  console.log(`Tamu count: ${result.tamuCount}`);
  console.log(`Pengunjung count: ${result.pengunjungCount}`);

  // Close database connection
  db.close();
}
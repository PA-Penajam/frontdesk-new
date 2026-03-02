import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let dbInstance: Database.Database | null = null;

export function getDb(dbPath?: string): Database.Database {
  if (dbInstance) {
    return dbInstance;
  }

  const defaultPath = path.join(process.cwd(), 'data', 'frontdesk.db');
  const finalPath = dbPath || defaultPath;

  // Ensure data directory exists if using default path
  if (!dbPath) {
    const dataDir = path.dirname(finalPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  dbInstance = new Database(finalPath);

  // Enable WAL mode for better concurrent read performance
  dbInstance.pragma('journal_mode = WAL');

  // Read and execute schema SQL
  const schemaPath = path.join(process.cwd(), 'scripts', 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    dbInstance.exec(schemaSQL);
  }

  return dbInstance;
}
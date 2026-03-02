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
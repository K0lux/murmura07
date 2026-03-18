-- initial schema
CREATE TABLE IF NOT EXISTS chunks (
  id TEXT PRIMARY KEY,
  file_path TEXT,
  start_line INTEGER,
  end_line INTEGER,
  content TEXT,
  content_hash TEXT,
  embedding_model TEXT
);

CREATE TABLE IF NOT EXISTS embedding_cache (
  chunk_hash TEXT PRIMARY KEY,
  provider TEXT,
  model TEXT,
  vector TEXT
);

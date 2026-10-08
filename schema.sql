CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  username TEXT,
  token TEXT NOT NULL UNIQUE,
  telegram_id INTEGER,
  status INTEGER NOT NULL DEFAULT 1,
  webhook_url TEXT,
  description TEXT DEFAULT '',
  photo_file_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS telegram_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bot_id INTEGER NOT NULL,
  telegram_id INTEGER NOT NULL,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  start_parameter TEXT,
  is_blocked INTEGER NOT NULL DEFAULT 0,
  first_seen TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(bot_id, telegram_id),
  FOREIGN KEY(bot_id) REFERENCES bots(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bot_homepage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bot_id INTEGER NOT NULL UNIQUE,
  text TEXT DEFAULT '',
  photo_file_id TEXT,
  video_file_id TEXT,
  FOREIGN KEY(bot_id) REFERENCES bots(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reply_buttons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bot_id INTEGER NOT NULL,
  text TEXT NOT NULL,
  url TEXT,
  row_number INTEGER NOT NULL DEFAULT 0,
  position INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY(bot_id) REFERENCES bots(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS broadcasts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  content TEXT,
  media_type TEXT,
  media_file_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  total_users INTEGER NOT NULL DEFAULT 0,
  success_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TEXT
);

CREATE TABLE IF NOT EXISTS logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT NOT NULL,
  details TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bots_status
ON bots(status);

CREATE INDEX IF NOT EXISTS idx_users_bot
ON telegram_users(bot_id);

CREATE INDEX IF NOT EXISTS idx_users_telegram
ON telegram_users(telegram_id);

CREATE INDEX IF NOT EXISTS idx_logs_created
ON logs(created_at);
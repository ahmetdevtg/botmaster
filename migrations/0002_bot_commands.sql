-- Command menu entries and replies for each bot. Safe to run on a database without this table.
CREATE TABLE IF NOT EXISTS bot_commands (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bot_id INTEGER NOT NULL,
  command TEXT NOT NULL,
  description TEXT NOT NULL,
  response_text TEXT NOT NULL DEFAULT '',
  UNIQUE(bot_id, command),
  FOREIGN KEY(bot_id) REFERENCES bots(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_bot_commands_bot ON bot_commands(bot_id);

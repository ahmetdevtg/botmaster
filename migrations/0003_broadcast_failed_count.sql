-- Run ONLY if your existing broadcasts table does not yet have failed_count.
-- Do not run this after applying the updated schema.sql, which already includes the column.
ALTER TABLE broadcasts ADD COLUMN failed_count INTEGER NOT NULL DEFAULT 0;

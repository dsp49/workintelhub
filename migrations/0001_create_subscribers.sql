-- Newsletter subscribers.
--
-- email is stored lower-cased and carries the UNIQUE constraint, so a repeat
-- signup is a no-op at the database level rather than something the function
-- has to check for with a second round trip. created_at is the first signup;
-- a duplicate never overwrites it.
--
-- Everything except email is nullable on purpose. A missing name or country
-- must never be a reason to lose a subscriber.

CREATE TABLE IF NOT EXISTS subscribers (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  email       TEXT    NOT NULL UNIQUE,
  name        TEXT,
  page        TEXT,              -- path the signup came from, e.g. /blogs/bossware
  tag         TEXT,              -- topic tag already carried by the form
  country     TEXT,              -- Cloudflare cf-ipcountry, two letters
  created_at  TEXT    NOT NULL   -- ISO 8601, UTC
);

-- The admin list is ordered newest first and that is the only read path,
-- so this is the one index worth carrying.
CREATE INDEX IF NOT EXISTS idx_subscribers_created_at
  ON subscribers (created_at DESC);

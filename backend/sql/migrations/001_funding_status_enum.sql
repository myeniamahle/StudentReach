BEGIN;

DO $$
BEGIN
  CREATE TYPE funding_status AS ENUM ('active','approved','pending','unresolved');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

ALTER TABLE funding_status_history
  DROP CONSTRAINT IF EXISTS funding_status_history_status_check;

ALTER TABLE funding_status_history
  ALTER COLUMN status TYPE funding_status
  USING status::text::funding_status;

COMMIT;

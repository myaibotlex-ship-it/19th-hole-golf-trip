CREATE TABLE expenses (
  id          uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz   NOT NULL DEFAULT now(),
  updated_at  timestamptz   NOT NULL DEFAULT now(),
  date        date          NOT NULL,
  description text          NOT NULL,
  amount      numeric(10,2) NOT NULL CHECK (amount > 0),
  paid_by     text          NOT NULL,
  split_among text[]        NOT NULL,
  created_by  text          NOT NULL
);

CREATE INDEX expenses_paid_by_idx    ON expenses (paid_by);
CREATE INDEX expenses_created_at_idx ON expenses (created_at DESC);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER expenses_set_updated_at
  BEFORE UPDATE ON expenses
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE expenses DISABLE ROW LEVEL SECURITY;

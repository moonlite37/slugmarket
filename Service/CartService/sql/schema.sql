-- for testing
DROP TABLE IF EXISTS cart CASCADE;
CREATE TABLE cart (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID UNIQUE,
  session_id UUID NOT NULL UNIQUE,
  items      JSONB NOT NULL DEFAULT '[]'
);


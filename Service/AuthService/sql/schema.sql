-- These sql files are only used by the tests to restart state

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS "user" CASCADE;
CREATE TABLE "user" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data JSONB NOT NULL
);

CREATE UNIQUE INDEX user_sub_idx ON "user" ((data->>'sub'));

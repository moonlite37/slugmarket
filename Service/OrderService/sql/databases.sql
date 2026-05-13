CREATE DATABASE orders;
\connect orders
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS "order" CASCADE;
CREATE TABLE "order" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shopper UUID NOT NULL,
  seller UUID NOT NULL,
  data JSONB NOT NULL
);

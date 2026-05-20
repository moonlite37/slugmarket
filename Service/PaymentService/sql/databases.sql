CREATE DATABASE payment;
\connect payment
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS payment CASCADE;
CREATE TABLE payment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data JSONB NOT NULL
);

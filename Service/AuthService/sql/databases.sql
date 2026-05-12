CREATE DATABASE auth;
\connect auth
CREATE EXTENSION IF NOT EXISTS pgcrypto;


DROP TABLE IF EXISTS "user" CASCADE;
CREATE TABLE "user" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data JSONB NOT NULL
);

CREATE UNIQUE INDEX user_sub_idx ON "user" ((data->>'sub'));


INSERT INTO "user" (data)
VALUES (
  jsonb_build_object(
    'name', 'John Pork',
    'email', 'johnpork@email.com',
    'password', crypt('johnpork', gen_salt('bf'))
  )
);

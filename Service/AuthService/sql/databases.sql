CREATE DATABASE auth;

-- dont add this to schema or data
\connect auth

CREATE EXTENSION IF NOT EXISTS pgcrypto;
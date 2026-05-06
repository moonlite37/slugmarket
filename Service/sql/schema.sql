DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	data JSONB NOT NULL
);

CREATE UNIQUE INDEX users_sub_idx ON users ((data->>'sub'));

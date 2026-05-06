DROP TABLE IF EXISTS listing CASCADE;
CREATE TABLE listing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author UUID,
  data JSONB NOT NULL
);

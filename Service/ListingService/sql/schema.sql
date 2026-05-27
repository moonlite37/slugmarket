DROP TABLE IF EXISTS listing CASCADE;
CREATE TABLE listing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author UUID,
  data JSONB NOT NULL
);

DROP TABLE IF EXISTS category CASCADE;
CREATE TABLE category (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data JSONB NOT NULL
);

DROP TABLE IF EXISTS listing_category CASCADE;
CREATE TABLE listing_category (
  listing UUID REFERENCES listing(id) ON DELETE CASCADE,
  category UUID REFERENCES category(id) ON DELETE CASCADE,
  PRIMARY KEY (listing, category)
);

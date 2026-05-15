CREATE DATABASE listing;
\connect listing
CREATE EXTENSION IF NOT EXISTS pgcrypto;


DROP TABLE IF EXISTS listing CASCADE;
CREATE TABLE listing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author UUID,
  data JSONB NOT NULL
);


INSERT INTO listing (id, author, data)
VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001',
  jsonb_build_object(
    'username', 'John Pork',
    'title', 'Pork Chops',
    'description', '100% authentic pork chops made from pork',
    'created', NOW(),
    'price', 19.99,
    'discountPrice', 14.99,
    'stock', 42,
    'categories', ARRAY['food', 'pork'],
    'images', ARRAY['img1.jpg', 'img2.jpg']
  )
);
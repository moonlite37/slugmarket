-- fake listings
INSERT INTO listing (id, author, data)
VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001',
  jsonb_build_object(
    'author', 'John Pork',
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

INSERT INTO listing (id, author, data)
VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000020',
  jsonb_build_object(
    'author', 'Omega x Swatch',
    'title', 'Moonswatch',
    'description', 'Omega bioceramic design with Swatch movement',
    'created', NOW() - INTERVAL '1 day',
    'price', 349.99,
    'stock', 104,
    'categories', ARRAY['jewelry'],
    'images', ARRAY['img4.jpg', 'img3.jpg']
  )
);

INSERT INTO listing (id, author, data)
VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000020',
  jsonb_build_object(
    'author', 'Apple',
    'title', 'Airpods',
    'description', 'Next generation wireless earbuds',
    'created', NOW() - INTERVAL '2 day',
    'price', 149.99,
    'stock', 2000,
    'categories', ARRAY['tech'],
    'images', ARRAY['img5.jpg', 'img6.jpg']
  )
);

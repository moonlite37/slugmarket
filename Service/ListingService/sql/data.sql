-- fake listings
INSERT INTO category (id, data)
VALUES 
(
  '00000000-0000-0000-0000-000000000011',
  jsonb_build_object(
    'name', 'Food'
  )
),
(
  '00000000-0000-0000-0000-000000000012',
  jsonb_build_object(
    'name', 'Jewelry'
  )
),
(
  '00000000-0000-0000-0000-000000000013',
  jsonb_build_object(
    'name', 'Tech'
  )
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
    'images', ARRAY['img1.jpg', 'img2.jpg']
  )
);

INSERT INTO listing (id, author, data)
VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000002',
  jsonb_build_object(
    'username', 'Omega x Swatch',
    'title', 'Moonswatch',
    'description', 'Omega bioceramic design with Swatch movement',
    'created', NOW() - INTERVAL '1 day',
    'price', 349.99,
    'stock', 104,
    'images', ARRAY['img4.jpg', 'img3.jpg']
  )
);

INSERT INTO listing (id, author, data)
VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000020',
  jsonb_build_object(
    'username', 'Apple',
    'title', 'Airpods',
    'description', 'Next generation wireless earbuds',
    'created', NOW() - INTERVAL '2 day',
    'price', 149.99,
    'stock', 2000,
    'images', ARRAY['img5.jpg', 'img6.jpg']
  )
);

INSERT INTO listing_category (listing, category)
VALUES
(
  (
    SELECT id
    FROM listing
    WHERE data->>'title' = 'Pork Chops'
  ),
  '00000000-0000-0000-0000-000000000011'
),

(
  (
    SELECT id
    FROM listing
    WHERE data->>'title' = 'Moonswatch'
  ),
  '00000000-0000-0000-0000-000000000012'
),

(
  (
    SELECT id
    FROM listing
    WHERE data->>'title' = 'Airpods'
  ),
  '00000000-0000-0000-0000-000000000013'
);
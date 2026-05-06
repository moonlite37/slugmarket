-- Listing Database
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

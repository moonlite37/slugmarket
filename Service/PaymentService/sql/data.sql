INSERT INTO payment (id, data)
VALUES (
  gen_random_uuid(),
  jsonb_build_object(
    'status', 'created'
  )
);

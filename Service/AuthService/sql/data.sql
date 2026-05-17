INSERT INTO "user" (data)
VALUES (
  jsonb_build_object(
    'name', 'John Pork',
    'email', 'johnpork@email.com',
    'roles','["admin"]',
    'password', crypt('johnpork', gen_salt('bf'))
  )
);

INSERT INTO "user" (data)
VALUES (
  jsonb_build_object(
    'name', 'Apple',
    'email', 'apple@icloud.com',
    'roles','["corporate", "seller"]',
    'password', crypt('tim cook', gen_salt('bf'))
  )
);

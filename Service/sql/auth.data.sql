-- Auth Database
INSERT INTO users (data)
VALUES (
  jsonb_build_object(
    'name', 'John Pork',
    'email', 'johnpork@email.com',
    'password', crypt('johnpork', gen_salt('bf'))
  )
);

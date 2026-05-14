import { createApp } from './app';

const port = 4000;

createApp().then((app) => {
  app.listen(port, '0.0.0.0', () => {
    console.log(`OrderService (GraphQL) running on port ${port}`);
    console.log(`GraphQL endpoint: http://localhost:${port}/graphql`);
  });
});

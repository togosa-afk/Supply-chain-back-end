import 'dotenv/config';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';

import { createApp } from './app';
import { connectDB } from './db';
import { resolvers, typeDefs } from './graphql/schema';
import { env } from './config/env';

const startServer = async () => {
  await connectDB();

  const app = createApp();

  const apolloServer = new ApolloServer({ typeDefs, resolvers });
  await apolloServer.start();

  app.use('/graphql', expressMiddleware(apolloServer));

  app.listen(env.port, () => {
    console.log(`Server running at http://localhost:${env.port}`);
    console.log(`GraphQL available at http://localhost:${env.port}/graphql`);
  });
};

startServer().catch((error: unknown) => {
  console.error('Failed to start server:', error);
  process.exitCode = 1;
});
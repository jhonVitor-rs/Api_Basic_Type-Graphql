import "reflect-metadata";
import path from 'node:path';
import { ApolloServer } from 'apollo-server';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { buildSchema } from 'type-graphql';

import { UserResolver } from './resolvers/userResolver';
import { PostResolver } from './resolvers/postResolver';
import { context } from './prisma.context';

async function startServer() {
  const schema = await buildSchema({
    resolvers: [UserResolver, PostResolver],
    emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
  });

  const server = new ApolloServer({
    schema,
    context,
  });

  const { url, server: httpServer } = await server.listen();

  SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect: () => {
        console.log('Client connected to WebSocket');
      },
      onDisconnect: () => {
        console.log('Client disconnected from WebSocket');
      },
    },
    {
      server: httpServer,
      path: server.graphqlPath,
    }
  );

  console.log(`HTTP server running on ${url}`);
}

startServer();

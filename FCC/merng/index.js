const { ApolloServer } = require('apollo-server');
// const gql = require('graphql-tag');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./resolvers')
const { MONGODB } = require('./config');


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req })  // forward that request, so that we can access the req body...
});

mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true  })
  .then(() => {
    console.log('MongoDB connected...');
    return server.listen({ port: 5000 });
  })
  .then(res => {
    console.log(`Server running at ${res.url}`)
  });

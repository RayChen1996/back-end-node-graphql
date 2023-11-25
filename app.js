const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");

const app = express();

// 3. 定义GraphQL Schema
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// 4. 提供解析函数
const resolvers = {
  Query: {
    hello: () => "Hello, GraphQL!",
  },
};

// 5. 创建Apollo服务器
const server = new ApolloServer({ typeDefs, resolvers });

// 6. 启动Apollo服务器并将中间件添加到Express应用
async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
}

// 7. 启动Express服务器
const PORT = 3000;
startServer().then(() => {
  app.listen(PORT, () => {
    console.log(
      `Server running at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
});

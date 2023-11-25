const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const mongoose = require("mongoose");

const app = express();

// 3. 定义GraphQL Schema
const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    price: Float!
  }

  type Query {
    products: [Product]
  }
`;

// 4. 提供解析函数
const resolvers = {
  Query: {
    products: async () => {
      // 在这里，你可以使用 mongoose 查询数据库并返回产品数据
      const products = await Product.find();
      return products;
    },
  },
};

// 5. 连接到 MongoDB 数据库
mongoose.connect(
  "mongodb+srv://ray10315332:GayqbQeJq5Jxh3em@cluster0.pberq7k.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// 6. 定义 Product 模型
const Product = mongoose.model("Product", {
  name: String,
  price: Number,
});

// 7. 创建Apollo服务器
const server = new ApolloServer({ typeDefs, resolvers });

// 8. 启动Apollo服务器并将中间件添加到Express应用
async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
}

// 9. 启动Express服务器
const PORT = 3000;
startServer().then(() => {
  app.listen(PORT, () => {
    console.log(
      `Server running at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
});

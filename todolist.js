const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const mongoose = require("mongoose");

const app = express();

// 3. 定义GraphQL Schema
const typeDefs = gql`
  type Todo {
    id: ID!
    task: String!
    completed: Boolean!
  }

  type Query {
    todos: [Todo]
    todo(id: ID!): Todo
  }

  type Mutation {
    addTodo(task: String!): Todo
    updateTodo(id: ID!, task: String!, completed: Boolean!): Todo
    deleteTodo(id: ID!): Todo
  }
`;

// 4. 提供解析函数
const resolvers = {
  Query: {
    todos: async () => {
      const todos = await Todo.find();
      return todos;
    },
    todo: async (_, { id }) => {
      const todo = await Todo.findById(id);
      return todo;
    },
  },
  Mutation: {
    addTodo: async (_, { task }) => {
      const todo = new Todo({ task, completed: false });
      await todo.save();
      return todo;
    },
    updateTodo: async (_, { id, task, completed }) => {
      const todo = await Todo.findByIdAndUpdate(
        id,
        { task, completed },
        { new: true }
      );
      return todo;
    },
    deleteTodo: async (_, { id }) => {
      const todo = await Todo.findByIdAndDelete(id);
      return todo;
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

// 6. 定义 Todo 模型
const Todo = mongoose.model("Todo", {
  task: String,
  completed: Boolean,
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

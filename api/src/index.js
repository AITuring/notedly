// index.js
// This is the main entry point of our application
const express = require('express');
const {ApolloServer} = require('apollo-server-express');
require('dotenv').config();

// 导入本地模块
const db = require('./db');
const models = require('./models');
// 使用GraphQL模式语言编制一个模式
const typeDefs = require('./schema');
// 为模式字段提供解析函数
const resolvers = require('./resolvers');

// 指定端口
const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

const app = express();
// 连接数据库
db.connect(DB_HOST);


// 设置Apollo Server
const server = new ApolloServer({
    typeDefs, 
    resolvers,
    context: ()=>{
        // 把数据库模型添加到上下文中
        return { models};
    }
});

// 应用Apollo GraphQL中间件，把路径设为api
server.applyMiddleware({ app, path: '/api'});

app.listen({port}, () => console.log(`GraphQL Server running at http://localhost:${port}${server.graphqlPath}`));

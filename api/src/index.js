// index.js
// This is the main entry point of our application
const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const jwt = require('jsonwebtoken');
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

// 通过jwt获取用户信息
const getUser = token => {
    if (token) {
        try {
            // 返回通过令牌获取的用户信息
            return jwt.verify(token, process.env.JWT_SECRET)
        } catch(err) {
            // 如果令牌有问题，抛出错误
            throw new Error('Session invalid')
        }
    }
}

const app = express();
// 连接数据库
db.connect(DB_HOST);


// 设置Apollo Server
const server = new ApolloServer({
    typeDefs, 
    resolvers,
    context: ({ req })=>{
        // 从首部获取令牌
        const token = req.headers.authorization
        // 尝试使用令牌检索用户
        const user = getUser(token)
        console.log(user)
        // 把数据库模型添加到上下文中
        return { models, user };
    }
});

// 应用Apollo GraphQL中间件，把路径设为api
server.applyMiddleware({ app, path: '/api'});

app.listen({port}, () => console.log(`GraphQL Server running at http://localhost:${port}${server.graphqlPath}`));

// index.js
// This is the main entry point of our application
const express = require('express');
const {ApolloServer, gql} = require('apollo-server-express');
require('dotenv').config();
const db = require('./db');

const app = express();
const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;
const models = require('./models');
// 连接数据库
db.connect(DB_HOST);

// 废弃的本地存储，全部放到数据库中
// let notes = [
//     {
//         id: '1',
//         content: 'note 1',
//         author: 'Luke'
//     },
//     {
//         id: '2',
//         content: 'note 2',
//         author: 'Anakin'
//     },
//     {
//         id: '3',
//         content: 'note 3',
//         author: 'C-3PO'
//     }
// ];
// 使用GraphQL模式语言编制一个模式
const typeDefs = gql`
type Query {
    hello: String
    notes: [Note!]!
    note(id: ID!): Note!
}
type Note {
    id: ID!
    content: String!
    author: String!
}
type Mutation {
    newNote(content: String!): Note!
}
`
// 为模式字段提供解析函数
const resolvers = {
    Query: {
        hello: ()=> 'Hello World',
        notes: async()=> {
            // 调用MongoDB的find方法
            return await models.Note.find();
        },
        note: async(parent, args)=> {
            return await models.Note.findById(args.id)
        }
    },
    Mutation: {
        // 创建新笔记
        newNote: async (parent, args)=> {
            return await models.Note.create({
                content: args.content,
                author: 'lsy'
            })
        }
    }
}

// 设置Apollo Server
const server = new ApolloServer({typeDefs, resolvers})

// 应用Apollo GraphQL中间件，把路径设为api
server.applyMiddleware({ app, path: '/api'})

// app.get('/', (req, res) => {
//     res.send('Hello, world')
// });

app.listen({port}, () => console.log(`GraphQL Server running at http://localhost:${port}${server.graphqlPath}`));

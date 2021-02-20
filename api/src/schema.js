const {gql} = require('apollo-server-express');

// 使用GraphQL模式语言编制一个模式
module.exports = gql`
scalar DateTime
type Note {
    id: ID!
    content: String!
    author: String!
    createdAt: DateTime!
    updatedAt: DateTime!
}
type Query {
    hello: String
    notes: [Note!]!
    note(id: ID!): Note!
}
type Mutation {
    newNote(content: String!): Note!
    updateNote(id: ID!, content: String!): Note!
    deleteNote(id: ID!): Boolean!
}
`
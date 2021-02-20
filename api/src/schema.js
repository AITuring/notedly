const {gql} = require('apollo-server-express');

// 使用GraphQL模式语言编制一个模式
module.exports = gql`
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
    updateNote(id: ID!, content: String!): Note!
    deleteNote(id: ID!): Boolean!
}
`
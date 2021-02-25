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
    favoriteCount: Int!
    favoritedBy: [User!]
}
type User {
    id: ID!
    username: String!
    email: String!
    avatar: String!
    notes: [Note!]
    favorites: [User!]
}
type NoteFeed {
    notes: [Note!]
    cursor: String!
    hasNextPage: Boolean!
}
type Query {
    hello: String
    notes: [Note!]!
    note(id: ID!): Note!
    user(username: String!): User
    users:[User!]!
    me: User!
    noteFeed(cursor: String): NoteFeed
}
type Mutation {
    newNote(content: String!): Note!
    updateNote(id: ID!, content: String!): Note!
    deleteNote(id: ID!): Boolean!
    signUp(username: String!, email: String!, password: String!): String!
    signIn(username: String, email: String, password: String!): String!
    toggleFavorite(id: ID!): Note!
}
`
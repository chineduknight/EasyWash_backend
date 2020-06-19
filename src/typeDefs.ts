import { gql } from 'apollo-server-express';

export default gql`
  type User{
    id: ID
    name: String!
    email: String!
    password:String!
    phone: String
  }
  input UserInput{
    name: String!
    email: String!
    password:String!
    phone: String
  }
  input LoginInput{
    email: String!
    password:String!
  }
 
  type Mutation {
    register(data:UserInput!):User!
    login(data:LoginInput!):User!
    getUsers:String,
    logout:Boolean!
  }
  type Query {
    hello: String!
    users:[User]
  }
`;
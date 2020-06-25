import { GraphQLError, } from 'graphql'
import { ApolloError } from 'apollo-server-express';

const errorHandler = (error: GraphQLError) => {

  // Dump error to console for developer in development
  console.log(`Current Error --->  ${error}`)

  if (error.originalError instanceof ApolloError) {
    return new GraphQLError(error.message)
  }

  //Mongoose bad ObjectID
  if (error.extensions.exception.name === 'CastError') {
    return new GraphQLError('Resource not found')
  }

  // Mongoose Duplicate Key
  if (error.extensions.exception.code === 11000) {
    return new GraphQLError('Duplicate field value entered')
  }
  // Mongoose Validation Error
  if (error.extensions.exception.name === 'ValidationError') {
    const message = error.extensions.exception.message
    return new GraphQLError(message)
  }
  // GraphQL Validation Error
  if (error.extensions.code === 'GRAPHQL_VALIDATION_FAILED') {
    const message = error.message
    return new GraphQLError(message)
  }
  return new GraphQLError('Internal Server Error')
}
export default errorHandler
import { hello } from './resolvers/query/hello'
import { users } from './resolvers/query/users'
import { register,login,getUsers,logout } from './resolvers/mutation/users'
export default {
  Mutation: {
    register,
    login,
    getUsers,
    logout
  },
  Query: {
    hello,
    users
  },
};
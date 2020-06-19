import express, { Request, Response } from 'express';
import session from 'express-session'
import { ApolloServer } from 'apollo-server-express';
import typeDefs from './typeDefs'
import resolvers from './resolvers';
import connectMongo from 'connect-mongo'
import cors from 'cors';
import 'dotenv/config';
import { prisma } from './prisma-mongo/generated/prisma-client/index'
const MongoStore = connectMongo(session)

const SESS_LIFETIME = 1000 * 60 * 60 * 2

const {
  SESS_NAME = 'sid',
  SESS_SECRET = 'asdfasdf/wer325',
  NODE_ENV = 'development',
  MONGO_URI = ''
} = process.env
console.log('mongod',MONGO_URI);

const IN_PROD = NODE_ENV === 'production'
const app = express();

app.use(session({
  name: SESS_NAME,
  resave: false,
  saveUninitialized: false,
  secret: SESS_SECRET,
  store: new MongoStore({ url: MONGO_URI }),
  cookie: {
    maxAge: SESS_LIFETIME,
    sameSite: true,
    secure: IN_PROD,
    httpOnly: true,
  }
}))

// Enable CORS
app.use(cors({
  credentials: true,
  origin: '*'
  // origin: 'http://localhost:3579'
}));
// app.use(cors())


interface playgroundSettings {
  'request.credentials': 'omit' | 'include' | 'same-origin';
  'schema.polling.enable': boolean;
}
const settings: playgroundSettings = {
  'request.credentials': 'include',
  'schema.polling.enable': false,
};

// set up server
const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context({ req, res }: { req: Request, res: Response }) {
      return {
        prisma,
        req,
        res
      }
    },
    playground: {
      settings
    },
  });

  server.applyMiddleware({
    app,
    path: '/graphql',
    cors: false,
  });

  // start express
  const PORT = process.env.PORT || 3030;

  app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
};

startServer();

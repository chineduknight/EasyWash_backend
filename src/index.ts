import 'dotenv/config';
import express from 'express';
import session from 'express-session'
import { ApolloServer } from 'apollo-server-express';
import typeDefs from './typeDefs'
import resolvers from './resolvers';
// import connectPG from 'connect-pg-simple'
import cors from 'cors';
import { prisma } from './prisma/generated/prisma-client/index'


// const PGstore = connectPG(session);
const SESS_LIFETIME = 1000 * 60 * 60 * 2;

const {
  SESS_NAME,
  SESS_SECRET,
  NODE_ENV,
  LOCAL_URL,
  PROD_URL,
  // DATABASE_URL
} = process.env

const IN_PROD = NODE_ENV === 'production'
const app = express();

app.use(session({
  name: SESS_NAME,
  secret: SESS_SECRET,
  resave: false,
  saveUninitialized: false,
  // store: new PGstore({
  //   conString: DATABASE_URL
  // }),
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
  origin:NODE_ENV === "development" ? LOCAL_URL : PROD_URL,
}));


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
    context({ req, res }: { req: any, res: any }) {
      return {
        prisma,
        req,
        res
      }
    },
    playground: NODE_ENV === "development" ? {
      settings
    }:false,
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

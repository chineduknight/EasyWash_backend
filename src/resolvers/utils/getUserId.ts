import { Request } from 'express';

export default (req:Request) => {
  if (!req!.session!.userId) {
    throw new Error("Unauthenticated")
  }
  return req!.session!.userId
}
import bcrypt from 'bcryptjs';
import getUserId from '../utils/getUserId'

export const register = async (_parent: any, { data }: any, { prisma, req }: any) => {
  if (data.password.length < 8) {
    throw new Error('Password must be 8 characters or longer.');
  }

  const password = await bcrypt.hash(data.password, 10);
  const user = await prisma.createUser({
    ...data,
    password,
  });
  req!.session!.userId = user.id

  return user
}

export const login = async (_parent: any, { data }: any, { prisma, req }: any) => {
  const user = await prisma.user({ email: data.email })

  if (!user) {
    throw new Error('Invalid Credentials');
  }
  const isMatch = await bcrypt.compare(data.password, user.password);

  if (!isMatch) {
    throw new Error('Invalid Credentials');
  }
  req!.session!.userId = user.id
  return user;
}

export const getUsers = async (_parent: any, args: any, { req }: any) => {
  const userId = getUserId(req)
  console.log('userid', userId);

  return "to be protected"
}

export const logout = async (_parent: any, args: any, { req, res }: any) => {
  try {
    await new Promise((response) => req!.session!.destroy(() => response()));
    res.clearCookie('sid');
    return true;
  } catch (err) {
    console.log(err);
    throw new Error("There was an error");
  }
}

import { prisma } from '../prisma-mongo/generated/prisma-client';

async function main() {
  // Create a new user called `Alice`
  // const newUser = await prisma.createUser({ name: 'Alice' });
  // console.log(`Created new user: ${newUser.name} (ID: ${newUser.id})`);

  // Read all users from the database and print them to the console
  // const allUsers = await prisma.users();
  // console.log(allUsers);

  const users = await prisma.users({
    where: {
      name: 'Alicesdaf',
    },
  });
  console.log(users);
}

main().catch((e) => console.error(e));

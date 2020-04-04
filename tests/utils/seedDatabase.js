import 'cross-fetch/polyfill'
import bcrypt from 'bcryptjs';
import prisma from '../../src/prisma';
import jwt from 'jsonwebtoken';

const userOne = {
  input: {
    name: "Test user",
    email: "testuser@example.com",
    password: bcrypt.hashSync('Red098!@./')
  },
  user: undefined,
  jwt: undefined
}

const userTwo = {
  input: {
    name: "Test user 2",
    email: "testuser2@example.com",
    password: bcrypt.hashSync('Red098!@./')
  },
  user: undefined,
  jwt: undefined
}

const seedDatabase = async () => {
  //Delete test data
  await prisma.mutation.deleteManyUsers();

  //Create user one
  userOne.user = await prisma.mutation.createUser({ data: userOne.input });
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET);

  //Create userTwo
  userTwo.user = await prisma.mutation.createUser({ data: userTwo.input });
  userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET);

}

export { seedDatabase as default, userOne, userTwo };
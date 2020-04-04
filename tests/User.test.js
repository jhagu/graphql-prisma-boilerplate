import 'cross-fetch/polyfill'
import prisma from '../src/prisma';
import seedDatabase, { userOne } from './utils/seedDatabase';
import getClient from './utils/getClient';
import { CREATE_USER, GET_USERS, ME, SIGN_IN } from './utils/operations';

const client = getClient();

beforeEach(seedDatabase, 10000);

test('Should create a new user', async () => {
  const variables = {
    data: {
      name: "Test user 3",
      email: "testuser3@example.com",
      password: "test1234"
    }
  }

  const response = await client.mutate({
    mutation: CREATE_USER,
    variables
  });

  const userExists = await prisma.exists.User({ id: response.data.createUser.user.id });

  expect(userExists).toBe(true);
});

test('Should expose public profiles', async () => {

  const response = await client.query({ query: GET_USERS });

  expect(response.data.users.length).toBe(2);
  expect(response.data.users[0].email).toBe(null);
  expect(response.data.users[0].name).toBe('Test user');
});

test('Should not signin with bad authentication', async () => {
  const variables = {
    data: {
      email: "testuser@example.com",
      password: "asdfg1234"
    }
  }

  await expect(
    client.mutate({
      mutation: SIGN_IN,
      variables
    })).rejects.toThrow("Incorrect password");
});

test('Should not signup with short password', async () => {

  const variables = {
    data: {
      name: "Test user",
      email: "testuser@example.com",
      password: "test123"
    }
  }

  await expect(
    client.mutate({ 
      mutation: CREATE_USER,
      variables 
    })).rejects.toThrow("Password length must be 8 characters or longer");
});

test('Should fetch user profile', async () => {
  const client = getClient(userOne.jwt)

  const { data } = await client.query({ query: ME });

  expect(data.me.id).toBe(userOne.user.id);
})

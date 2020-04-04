import {
  getHashedPassword,
  getUserToken,
  validatePassword,
  getUserIdFromToken
} from '../utils/utils';

const Mutation = {

  async signIn(parent, args, { prisma }, info) {

    const { data } = args;

    const user = await prisma.query.user({
      where: {
        email: data.email
      }
    });

    if (!user) {
      throw new Error('User not found')
    }

    const isMatch = await validatePassword(data.password, user.password);

    if (!isMatch) {
      throw new Error('Invalid password');
    }

    return {
      user,
      access_token: getUserToken(user.id)
    }
  },

  async createUser(parent, args, { prisma }, info) {

    const { data } = args;

    const password = await getHashedPassword(data.password);

    const user = await prisma.mutation
      .createUser({
        data: {
          ...data,
          password
        }
      });

    return {
      user,
      access_token: getUserToken(user.id)
    }
  },

  async deleteUser(parent, args, { prisma, request }, info) {

    const userId = getUserIdFromToken(request);

    return await prisma.mutation.deleteUser({
      where: {
        id: userId
      }
    }, info);
  },

  async updateUser(parent, args, { prisma, request }, info) {

    const userId = getUserIdFromToken(request);

    if(typeof args.data.password === 'string'){
      args.data.password = await getHashedPassword(args.data.password);
    }

    return await prisma.mutation.updateUser({
      where: {
        id: userId
      },
      data: args.data
    }, info);
  }
}

export { Mutation as default };
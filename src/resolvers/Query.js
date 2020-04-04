import { getUserIdFromToken } from '../utils/utils';

const Query = {

  async me(parent, args, { prisma, request }, info) {

    const userId = getUserIdFromToken(request);
    
    const userExists = await prisma.exists.User({
      id: userId
    });

    if (!userExists) {
      throw new Error('User not found')
    }

    const me = await prisma.query.user({
      where: {
        id: userId
      }
    }, info);

    return me;
  },

  async users(parent, args, { prisma }, info) {

    const op_args = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    };

    if (args.query) {
      op_args.where = {
        name_contains: args.query
      }
    }
    return await prisma.query.users(op_args, info);
  },

}

export { Query as default };
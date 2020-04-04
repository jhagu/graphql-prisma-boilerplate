import { getUserIdFromToken } from '../utils/utils';

const User = {
  //Customizing email resolver
  email: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, ctx, info) {
      const { request } = ctx;
      const userId = getUserIdFromToken(request, false);
      if (userId && userId === parent.id) {
        return parent.email;
      } else {
        return null
      }
    }
  }
}


export { User as default };
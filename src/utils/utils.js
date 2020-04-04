import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const getUserToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '2h' });
}

const getHashedPassword = async (password) => {
  if (password.length < 8) {
    throw new Error('Password length must be 8 characters or longer');
  }
  return await bcrypt.hash(password, 10);
}

const validatePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
}

const getUserIdFromToken = (request, requireAuth = true) => {

  // HTTP Authorization --> request.request.headers
  // WS Authorization --> request.connection.context

  const authorization =
    request.request ?
      request.request.headers.authorization :
      request.connection.context.Authorization

  if (authorization) {
    const token = authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    return decodedToken.userId;
  }

  if (requireAuth) {
    throw new Error('Authorization required');
  }

  return null;

}

export { getUserIdFromToken, getUserToken, getHashedPassword, validatePassword };
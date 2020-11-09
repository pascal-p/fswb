const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server');

const { SECRET_KEY } = require('../config');

module.exports = (context) => {
  // context = { ... headers }
  const authHeader = context.req.headers.authorization;

  if (authHeader) {
    // Bearer ...token...
    const token = authHeader.split('Bearer ')[1]; // we only want the token

    if (token) {
      // check that the token is valid and not expired
      try {
        const user = jwt.verify(token, SECRET_KEY);
        return user;
      }
      catch (err) {
        throw new AuthenticationError('Invalid/Expired token');
      }
    }

    throw new Error('Authentication token must be \'Bearer [token]\'')
  }

  throw new Error('Authorization header must be provided')
}

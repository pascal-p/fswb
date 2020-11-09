const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { SECRET_KEY } = require('../config');
const { validateRegisterInput, validateLoginInput } = require('../utils/validator');
const User = require('../models/User');

generateToken = (user) => {
  return jwt.sign({
    id: user.id,
    email: user.email,
    username: user.username
  }, SECRET_KEY, {expiresIn: '1h' } );
}

module.exports = {
  Mutation: {
    async login(
      _parent,
      { username, password },
      _context,  // not used here
      _info      // ditto
      
    ) {
      const { valid, errors } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }
      
      const user = await User.findOne({ username });
      
      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });        
      }
      console.log("find user...", user);

      const match = await bcrypt.compare(password, user.password);
      console.log("find match for: ", user.username);
      
      if (!match) {
        errors.general = 'Wrong credentials';
        throw new UserInputError('Wrong credentials', { errors }); 
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token
      };
    },
    
    // register(_parent, args, context, info) { ... }
    async register(
      _parent,
      {
        registerInput: {
          username, email, password, confirmPassword
        }
      },
      _context,  // not used here
      _info      // ditto
    ) {
      // validate users
      const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      // make sure user does NOT already exist
      const user = await User.findOne({ username });

      if (user) {
        throw new UserInputError('username is taken', {
          errors: {
            username: 'This username is taken'
          }
        });
      }

      // hash password and create auth. token
      password = await bcrypt.hash(password, 12); // 12 == number of rounds

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString()
      });

      const res = await newUser.save();
      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token
      };

    }
  }
}

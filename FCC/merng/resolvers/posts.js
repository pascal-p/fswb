const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../models/Post');
const checkAuth = require('../utils/check-auth');

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 }); // fetch all of them + sort in DESC order (-1)
        return posts;
      }
      catch (err) {
        throw new Error(err)
      }
    },
    async getPost(_, { postId }) {
      try {
        const post = Post.findById(postId);
        if (post) {
          return post;
        }
        else {
          throw new Error('Post not found');
        }
      }
      catch (err) {
        throw new Error(err)
      }
    }
  },

  Mutation: {
    async createPost(_, { body }, context) { // context will contain the req. body
      const user = checkAuth(context);

      if (args.body.trim() === '') {
        throw new Error('Post body must not be empty');
      }

      // no error, we can proceed with this authenticated user
      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
      });

      const post = await newPost.save();

      context.pubsub.publish('NEW_POST', {
        newPost: post
      });

      return post;
    },

    async deletePost(_, { postId }, context) { // context will contain the req. body
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);

        if (user.username === post.username) {
          await post.delete();
          return 'Post deleted successfully';
        }
        else {
          throw new AuthenticationError('Action not allowed');
        }
      }
      catch (err) {
        throw new Error(err);
      }
      // need to make sure that this user is the owner of the post

    },

    async likePost(_, { postId }, context) {
      const { username } = checkAuth(context);
      const post = await Post.findById(postId);

      if (post) {
        if (post.likes.find(like => like.username === username)) {
          // Post already like => unlike it
          post.likes = post.likes.filter(like => like.username !== username);
        }
        else {
          // Post NOT liked => like it
          post.likes.push({
            username,
            createdAt: new Date().toISOString()
          });
        }

        await post.save();
        return post;
      }
      else {
        throw new UserInputError('Post not found');
      }
    }
  },

  Subscription: {
    newPost: {
      subscribe: (_parent, _,  { pubsub }) => pubsub.asyncIterator('NEW_POST')
    }
  },

}

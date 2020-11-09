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
      console.log("createPost - got user: ", user);

      // no error, we can preoceed with this authenticated user
      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
      });

      const post = await newPost.save();
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
      
    }    
  }
}

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CommentSchema = new Schema(
  {
    rating:  {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment:  {
      type: String,
      required: true
    },
    author:  {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    dish: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dish'
    }
  },
  {
    timestamps: true
  });

let Comments = mongoose.model('Comment', CommentSchema);

module.exports = Comments;

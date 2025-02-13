const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema(
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
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  });

const DishSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    comments:[commentSchema]
  },
  {
    timestamps: true // inject created_at, updated_at
  });

let Dishes = mongoose.model('Dish', DishSchema);

module.exports = Dishes;

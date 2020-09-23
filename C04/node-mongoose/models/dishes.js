const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    }
  },
  {
    timestamps: true
  });

let Dishes = mongoose.model('Dish', DishSchema);

module.exports = Dishes;

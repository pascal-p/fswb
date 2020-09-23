const mongoose = require('mongoose');

const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url,
                                 { useUnifiedTopology: true,
                                   useFindAndModify: false,  // https://mongoosejs.com/docs/deprecations.html#findandmodify
                                   useNewUrlParser: true }).catch(console.error);

connect.then((db) => {
  console.log('Connected correctly to server');

  Dishes.create({
    name: 'Uthapizza',
    description: 'Test'
  })
  .then((dish) => {
    console.log("\nCreated new dish: ", dish);
    return Dishes.findByIdAndUpdate(
      dish._id,
      { $set: {description: 'Updated test'} },
      { new: true })
      .exec();
  })
  .then((dish) => {
    console.log("\nFind dish: ", dish);

    dish.comments.push({
      rating: 5,
      comment: 'I\'m getting a sinking feeling!',
      author: 'Leonardo di Carpaccio'
    });

    return dish.save();
  })
  .then((dish) => {
    console.log("\nAbout to delete dish: ", dish);

    return Dishes.deleteOne({});
  })
  .then(() => {
    console.log("\nDeleted dish... Closing db connection...");

    return mongoose.connection.close();
  })
  .catch((err) => {
    console.log(err);
  });
});

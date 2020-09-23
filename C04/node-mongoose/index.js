const mongoose = require('mongoose');

const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url,
                                 { useUnifiedTopology: true,
                                   useNewUrlParser: true }).catch(console.error);

connect.then((db) => {
  console.log('Connected correctly to server');

  let newDish = Dishes({
    name: 'Uthappizza',
    description: 'test'
  });

  newDish.save()
    .then((dish) => {
      console.log("Created new dish: ", dish);
      return Dishes.find({});
    })
    .then((dishes) => {
      console.log("Find all dishes: ", dishes);
      return Dishes.deleteOne({});
    })
    .then(() => {
      console.log("Deleted dish... Colsing db connection...");
      return mongoose.connection.close();
    })
    .catch((err) => {
      console.log(err);
    });
});

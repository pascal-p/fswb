let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password:  {
    type: String,
    required: true
  },
  admin:   {
    type: Boolean,
    default: false
  }
});

let User = mongoose.model('User', UserSchema);

module.exports = User;

const passportLocalMongoose = require('passport-local-mongoose');
const consts = require('../modules/consts');

const { Schema } = consts.mongoose;

const User = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  username: String,
  password: String,
});
User.plugin(passportLocalMongoose);

module.exports = consts.mongoose.model('UserModel', User, 'users');

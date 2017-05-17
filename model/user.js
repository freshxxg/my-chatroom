var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  UID: String,
  username: String,
  password: String,
  avatar: String,
    createTime: {type:Date, default: Date.now}
})

module.exports = mongoose.model('User', UserSchema);
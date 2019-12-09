const mongoose = require("mongoose");
const Schema = mongoose.Schema;

console.log("user user");
//create schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});
User = mongoose.model("users", UserSchema);
module.exports = User;

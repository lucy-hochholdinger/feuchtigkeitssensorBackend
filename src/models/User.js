// Database model from mongoose to create a collection and populate it
const mongoose = require('mongoose');

const { Schema } = mongoose;

const botSchema = new Schema({
  emailadress: String,
  username: String,
  passwordHash: String,
  createdAt: Date,
});

const Bot = mongoose.model('user', botSchema);

module.exports = Bot;

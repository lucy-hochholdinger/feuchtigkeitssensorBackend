// Database model from mongoose to create a collection and populate it
const mongoose = require('mongoose');

const { Schema } = mongoose;

const botSchema = new Schema({
  mac: String,
  val: Number,
  createdAt: Date
});

const Bot = mongoose.model('waterData', botSchema);

module.exports = Bot;
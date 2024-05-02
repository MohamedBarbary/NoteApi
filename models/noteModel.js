const mongoose = require('mongoose');
const User = require('./userModel');
const googleUser = require('./userModel');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    maxLength: 50,
  },
  content: {
    type: String,
    required: true,
    minLength: 2,
  },
});
const Note = mongoose.model('Note', noteSchema);
module.exports = Note;

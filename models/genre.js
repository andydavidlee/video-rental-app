const mongoose = require('mongoose');
const Joi = require('joi');

//Schema
const genreSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    }
  });
  //Model
  const Genre = mongoose.model('Genres', genreSchema);

  //JOI Validation
function validateGenre(genre) {
    const schema = {
      name: Joi.string().min(3).required()
    };
    return Joi.validate(genre, schema);
}

module.exports.genreSchema = genreSchema;
module.exports.Genre = Genre;
module.exports.validateGenre = validateGenre;
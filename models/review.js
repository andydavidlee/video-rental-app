// Review file in the models folder. Below is the SCHEMA for the reviews table in the database. 

//Require Modules
const Joi = require('joi'); // To validate the data before passing on to the database
const mongoose = require('mongoose'); // The ability to interact with mongoDB
const { fileLoader } = require('ejs');


//Review Schema. Sets the parameters of information you wish to add to the database.
const Review = mongoose.model('Reviews', new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true, 
    minlength: 5,
    maxlength: 255
  },
  rating: { 
    type: Number, 
    required: true,
    min: 0,
    max: 100
  },
  description: { 
    type: String, 
    required: true,
    trim: true,
    min: 0,
    max: 1000
  }
}));

//Joi validation. Validates the data before passing it on to the database. Extra precautionary.
function validateReview(review) {
  const schema = {
    title: Joi.string().min(5).max(50).required(),
    rating: Joi.number().min(0).required(100),
    description: Joi.string().min(5).max(1000).required()
  };

  return Joi.validate(review, schema);
}
//Exports
exports.Review = Review; //Export Review Schema 
exports.validate = validateReview; //Export Joi validation
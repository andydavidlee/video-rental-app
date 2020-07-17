//Require Modules
const Joi = require('joi');
const mongoose = require('mongoose');
//Genre module - This allows us to embed the genreSchema in the movieSchema 
const {genreSchema} = require('./genre');

//Movie Schema
const Movie = mongoose.model('Movies', new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true, 
    minlength: 5,
    maxlength: 255
  },
  genre: { 
    type: genreSchema,  
    required: true
  },
  numberInStock: { 
    type: Number, 
    required: true,
    min: 0,
    max: 255
  },
  dailyRentalRate: { 
    type: Number, 
    required: true,
    min: 0,
    max: 255
  }
}));

//Joi validation
//You may notice that the Joi schema validates just the genreId not the genre object
//This is because the client will be sending genreID not the genre object 
//But we will be sending the genre object to the database
function validateMovie(movie) {
  const schema = {
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required()
  };

  return Joi.validate(movie, schema);
}
//Exports
exports.Movie = Movie; //Export Movie Schema 
exports.validate = validateMovie; //Export Joi validation
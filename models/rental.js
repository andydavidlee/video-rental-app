//Required Modules
const Joi = require('joi');
//Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');


//Rental Schema
//Notice that we are not reusing the customerSchema or movieSchema rather we are creating a new schema for each of them
//This is because we only need some of the information from customer and movies not all of it.
const Rental = mongoose.model('Rental', new mongoose.Schema({
  customer: { 
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      },
      isGold: {
        type: Boolean,
        default: false
      },
      phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      }      
    }),  
    required: true
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true, 
        minlength: 5,
        maxlength: 255
      },
      dailyRentalRate: { 
        type: Number, 
        required: true,
        min: 0,
        max: 255
      }   
    }),
    required: true
  },
  dateOut: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  dateReturned: { 
    type: Date
  },
  rentalFee: { 
    type: Number, 
    min: 0
  }
}));

//Client Validation - We only want the client to send the customerId and the movieId everything else should be handled by the server
function validateRental(rental) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  };
  
  return Joi.validate(rental, schema);
}
//Exports - RentalSchema and Joi Validation 
exports.Rental = Rental; 
exports.validate = validateRental;
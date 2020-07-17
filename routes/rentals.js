//Required Modules 
const {Rental, validate} = require('../models/rental'); 
const {Movie} = require('../models/movie'); 
const {Customer} = require('../models/customer'); 
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

Fawn.init(mongoose);


//GET rentals
router.get('/', async (req, res) => {
  //Finding all rentals and listing them by there dateOut
  //-dateOut = list them in descending order
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

//POST rentals
router.post('/', async (req, res) => {
  //Validate the clients request and display error if not valid
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  //Check the Customer ID is valid
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer.');

  //Check the Movie ID is valid
  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie.');

  //Check the Movie is in stock
  if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

  //Create a new Rental object
  let rental = new Rental({ 
    customer: {
      _id: customer._id,
      name: customer.name, 
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });

  //Group the operations together as a transaction using Fawn module
  try{
    new Fawn.Task()
      .save('rentals', rental)
      .update('movies', {_id: movie._id}, {$inc: {numberInStock: -1}})
      .run();

      res.send(rental);
  }catch(ex){
    res.status(500).send('Something failed');
  }
});

//GET rental by ID
router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) return res.status(404).send('The rental with the given ID was not found.');

  res.send(rental);
});

//Export the route
module.exports = router; 
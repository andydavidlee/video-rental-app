// Reviews file in routes folder. This will allow you to use the CRUD operations with the reviews table in the database.

//Required Modules
const {Review, validate} = require('../models/review'); // Imports the Review Class or review SCHEMA and JOI validation from the review file in the models folder.
const mongoose = require('mongoose'); // Allows you to interact with MongoDB
const express = require('express'); // Import Express node
const router = express.Router(); // connects the routes file to the index.js file

//Get all Reviews
router.get('/', async (req, res) => {
  const review = await Review.find().sort('title');
  res.send(review);
});

//Post Review
router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    let review = new Review({ 
      title: req.body.title,
      rating: req.body.rating,
      description: req.body.description
    });
    review = await review.save();
  res.send(review);
});

//Update Review
router.put('/:id', async (req, res) => {
  const { error } = validate(req.body); 
  console.log(error);
  if (error) return res.status(400).send(error.details[0].message);
  console.log(error);

  const review = await Review.findByIdAndUpdate(req.params.id,
    { 
      title: req.body.title,
      rating: req.body.rating,
      description: req.body.description
    }, { new: true });

  if (!review) return res.status(404).send('The review with the given ID was not found.');
  
  res.send(review);
});

//Delete Review
router.delete('/:id', async (req, res) => {
    const review = await Review.findByIdAndRemove(req.params.id);
  
    if (!review) return res.status(404).send('The review with the given ID was not found.');
  res.send("Review deleted");
});

//Find Review by ID
router.get('/:id', async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) return res.status(404).send('The review with the given ID was not found.');
  res.send(review);
});

//Export Routes
module.exports = router; 
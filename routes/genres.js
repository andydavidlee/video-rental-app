//Required modules
//const asyncMiddleware = require('../middleware/async');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const {Genre, validateGenre} = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

//Genres GET Route
router.get('/', async(req, res, next) => {
    //throw new Error('Could not get the genres.');
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

//Genres POST Route
//2nd value in this case auth is any middleware you want to run when a user hits this route
router.post('/', auth, async(req, res) => {
  const { error } = validateGenre(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({name: req.body.name});
  genre = await genre.save();
  res.send(genre);
});

//Genres PUT(Update) Route
router.put('/:id', async(req, res) => {

  const { error } = validateGenre(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true});
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  res.send(genre);
});

//Genres DELETE by ID Route
router.delete('/:id', [auth, admin], async(req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  res.send(genre);
});

//Genres GET by ID Route
router.get('/:id', async(req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  res.send(genre);
});

//Export Router
module.exports = router;
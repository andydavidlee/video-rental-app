//Required modules
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const Joi = require('joi');
const router = express.Router();

//Genres GET Route
router.post('/', async(req, res) => {
  const { error } = validateAuth(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  //Find email in users collection and return
  let user = await User.findOne({ email: req.body.email });
  if(!user) return res.status(400).send('Invalid email or password');

  //Checks the password against the returned user using bcrypt.compare
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if(!validPassword) return res.status(400).send('Invalid email or password');

  //Generate JSON Web Token
  const token = user.generateAuthToken();

  res.send(token);
});

  //JOI Validation for 
  function validateAuth(auth) {
    const schema = {
      email: Joi.string().min(3).max(255).required().email(),
      password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(auth, schema);
}


//Export Router
module.exports = router;
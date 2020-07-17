//Required modules
const auth = require('../middleware/auth');

const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, validateUser} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

//Genres GET Route
router.post('/', async(req, res) => {
  const { error } = validateUser(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if(user) return res.status(400).send('Email already in use');

  user = new User(_.pick(req.body,['name', 'email', 'password']));

  //Hash and Salt
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  //Generate JSON Web Token
  const token = user.generateAuthToken();

  res.header('x-auth-token', token); //We could send this back in the body if we wanted to....

  //Use lodash to pick what data to send back
  res.send(_.pick(user, ['_id', 'name', 'email']));

});

router.get('/me', auth, async(req, res)=> {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

//Export Router
module.exports = router;
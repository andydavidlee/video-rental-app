const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const Joi = require('joi');

//Schema
//Notice the email schema is set to unique.
//The password will be hashed so we need it to be a bit larger maxlength: 1024,

//1. Lets add a new property to our schema to see if a user is admin or not
const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024,
    },
    isAdmin: Boolean
  });
  //2. Then is Mongodb compass make one of your users admin by adding the property isAdmin: true to a user
  //3. See Test API folder for example. 01_MongoDBCompass


  //Adds generateAuthToken() to the userSchema
  userSchema.methods.generateAuthToken = function(){
    //We use this as we want the ID from this user
    
    //4. Let's now make sure if a user is admin it gets added to the token
    //5. isAdmin: this.isAdmin
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
    return token;
  }

  //6. So we create a bit of middleware that checks if a user is authorized 
  //7. Lets create a bit of middleware that checks if they are admin
  //8. Create a new file: middleware/admin.js
  //9. Open: middleware/admin.js

  
  //Model
  const User = mongoose.model('User', userSchema);

  //JOI Validation
function validateUser(user) {
    //Notice we use JOI to make sure the email is a valid email
    //Also notice the the max length is set to 255 as when it is hashed it will get longer. 
    const schema = {
      name: Joi.string().min(5).max(50).required(),
      email: Joi.string().min(3).max(255).required().email(),
      password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validateUser = validateUser;
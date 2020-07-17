//Required modules
const {Customer, validateCustomer} = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

//Genres GET Route
router.get('/', async(req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});

//Genres POST Route
router.post('/', async(req, res) => {
  const { error } = validateCustomer(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone
  });
  customer = await customer.save();
  res.send(customer);
});

//Genres PUT(Update) Route
router.put('/:id', async (req, res) => {
  const { error } = validateCustomer(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(req.params.id,
    { 
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone
    }, 
    { 
      new: true 
    });

  if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  res.send(customer);
});


//Genres DELETE by ID Route
router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
  
    if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  
    res.send(customer);
  });

//Genres GET by ID Route
router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
  
    if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  
    res.send(customer);
  });

//Export Router
module.exports = router;
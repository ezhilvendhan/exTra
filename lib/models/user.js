'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
//Expense Schema
var ExpenseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  amount:  {
    type: Number,
    required: true
  },
  comment:  {
    type: String
  },
  date:  {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  }
}, {strict: true});

// Schema
var UserSchema = new Schema({
  userid: {
    type: String,
    unique: true,
    index: true,
    required: true
  },
  email: {
    type: String,
    index: true,
    required: true
  },
  fname:  {
    type: String,
    required: true
  },
  lname:  {
    type: String,
    required: true
  },
  password:  {
    type: String,
    required: true
  },
  expense: {
    type: [ExpenseSchema]
  },
  role: {
    type: String
  }
}, {strict: true});


mongoose.model('User', UserSchema);

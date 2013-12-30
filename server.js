'use strict';

// Module dependencies.
var express = require('express'),
    path = require('path'),
    fs = require('fs');

var app = express();

// Connect to database
var db = require('./lib/db/mongo');

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  require(modelsPath + '/' + file);
});

// Populate empty DB with dummy data
require('./lib/db/dummydata');

// Express Configuration
require('./lib/config/express')(app);

// Controllers
var usersApi = require('./lib/controllers/api/user'),
    expenseApi = require('./lib/controllers/api/expense'),
    index = require('./lib/controllers');

// Server Routes
app.post('/api/users/create', usersApi.create);
app.post('/api/users/get', usersApi.get);
app.post('/api/users/update', usersApi.update);
app.post('/api/users/remove', usersApi.remove);
app.post('/api/users/signout', usersApi.signout);

app.post('/api/expense/create', expenseApi.create);
app.post('/api/expense/getall', expenseApi.getAll);
app.post('/api/expense/get', expenseApi.get);
app.post('/api/expense/update', expenseApi.update);
app.post('/api/expense/remove', expenseApi.remove);

// Angular Routes
app.get('/partials/*', index.partials);
app.get('/*', index.index);

process.on('uncaughtException', function(err) {
    // handle the error safely
    console.log(err);
});

// Start server
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Express server listening on port %d in %s mode', port, app.get('env'));
});

// Expose app
exports = module.exports = app;
'use strict';

var path = require('path');

exports.partials = function partials(req, res) {
  var stripped = req.url.split('.')[0];
  var requestedView = path.join('./', stripped);
  res.render(requestedView, function render(err, html) {
    if(err) {
      res.render('404');
    } else {
      res.send(html);
    }
  });
};

exports.index = function index(req, res) {
  res.render('index');
};

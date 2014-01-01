'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    async = require('async'),
    msg = require('../../util/msg'),
    passwordHash = require('password-hash');

exports.create = function create(req, res) {
  //hash the password
  req.body.password = passwordHash.generate(req.body.password);
  User.create(req.body, function (err, user) {
    if(err) {
      if(err.code == 11000) {
        return res.json({failure: msg.INVALID_USERID});
      } else {
        return res.json({failure: err});
      }
    }
    if(user) {
      req.session.currentuser = user;
      return res.json(getDisplayUser(user));
    } else {
      res.json(msg.ERR_USER_CREATION);
    }
  });
};

exports.get = function get(req, res) {
  User.findOne({userid: req.body.userid},
    function (err, user) {
      if(err) {
        res.json({failure: err});
      }
      if(user && passwordHash.verify(req.body.password, user.password)) {
        req.session.currentuser = user;
        return res.json(getDisplayUser(user));
      } else {
        return res.json({failure: msg.INVALID_LOGIN});
      }
    });
};

exports.update = function update(req, res) {
  if(req.session.currentuser.role === 'admin') {
    User.findOneAndUpdate(
      {userid: req.body.userid},
      {$set: req.body},
      function (err, updated) {
        if(err) return res.send(err);
        if(updated) {
          req.session.currentuser = user;
          return res.json(updated);
        }
    });
  }
};

exports.remove = function remove(req, res) {
  if(req.session.currentuser.role === 'admin') {
    User.remove({userid: req.body.userid}, function (err) {
      if(err) return res.send(err);
      else {
        res.json({success: true});
      }
    });
  }
};

exports.signout = function signout(req, res) {
  req.session.currentuser = null;
  return res.json({success: true});
};


function getDisplayUser(user) {
  return {userid: user.userid,
          fname: user.fname,
          lname: user.lname,
          expense: user.expense,
          email: user.email
  };
}
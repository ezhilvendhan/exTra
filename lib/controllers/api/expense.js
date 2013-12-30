'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    async = require('async'),
    util = require('../../util/util'),
    msg = require('../../util/msg');


exports.create = function create(req, res) {
  if(util.isValidExpenseColl(req.body.expense)) {
    User.findOneAndUpdate(
        util.getSearchParam(req), {$set: {expense: req.body.expense}},
        function (err, updated) {
          if(err) return res.send(err);
          if(updated) return res.json(updated);
        }
    );
  } else {
    return res.json({failure: msg.INVALID_EXPENSE});
  }
};

exports.getAll = function getAll(req, res) {
  User.findOne(
      {userid: req.session.currentuser.userid},
      function (err, user) {
        if(err) return res.send(err);
        if(user) res.json(user.expense);
        else res.json([]);
      }
  );
};

exports.get = function get(req, res) {
  var filter = req.body,
      doFilter = function doFilter(filter, expense) {
        return util.isDateOnRange(expense.date, filter.fromdate, filter.todate) &&
                  util.isTimeOnRange(expense.time, filter.fromtime, filter.totime) &&
                    util.isAmountOnRange(expense.amount, filter.fromamount, filter.toamount);
      };
  User.findOne(
      {userid: req.session.currentuser.userid},
      function (err, user) {
        if(err) return res.send(err);
        if(user) res.json(user.expense.filter(doFilter.bind(null, filter)));
        else res.json([]);
      }
  );
};

exports.update = function update(req, res) {
  if(util.isValidExpenseColl(req.body.expense)) {
    User.findOneAndUpdate(
        util.getSearchParam(req), {$set: {expense: req.body.expense}},
        function (err, updated) {
          if(err) return res.send(err);
          if(updated) return res.json(updated);
        }
    );
  } else {
    return res.json({failure: msg.INVALID_EXPENSE});
  }

};

exports.remove = function remove(req, res) {
  User.findOneAndUpdate(
      util.getSearchParam(req), {$set: {expense: req.body.expense}},
      function (err, updated) {
        if(err) return res.send(err);
        if(updated) return res.json(updated);
      }
  );
};


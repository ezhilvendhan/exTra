'use strict';

var dateutil = require('date-utils');

exports.isValidUser = isValidUser;
exports.isInvalidUser = isInvalidUser;
exports.isValidExpenseColl = isValidExpenseColl;
exports.getSearchParam = getSearchParam;
exports.isEmptyString = isEmptyString;
exports.isNotEmptyString = isNotEmptyString;
exports.to24HrFormat = to24HrFormat;
exports.isDateOnRange = isDateOnRange;
exports.isTimeOnRange = isTimeOnRange;
exports.isAmountOnRange = isAmountOnRange;

function isValidUser(user, req) {
  try {
    return (user.userid === req.session.currentuser.userid);
  } catch(e) {
    return false;
  }
}

function isInvalidUser(user, req) {
  return !(isValidUser(user, req));
}

function isValidExpenseColl(arr) {
  if(! Array.isArray(arr)) return false;
  var validCnt = 0;
  arr.every(function(exp) {
    if(isValidExpense(exp)) {
      validCnt++;
      return true;
    }
    return false;
  });
  return validCnt === arr.length;
}

function getSearchParam(req) {
  var param = {userid: req.session.currentuser.userid};
  if(req.body.expense && req.body.expense._id) {
    param.expense = {};
    param.expense._id = req.body.expense._id;
  }
  return param;
}

function isEmptyString(str) {
  if(str && str.trim() !== '') return false;
  return true;
}

function isNotEmptyString(str) {
  return !(isEmptyString(str));
}

function to24HrFormat(str) {
  var arr = str.split(':'),
      appendZero = function(num) {
        if(num.length !== 2) {
          if(num.length === 1) num = '0'+num;
          else num = '00';
        }
        return num;
      };
  arr[0] = appendZero(arr[0]);
  arr[1] = appendZero(arr[1]);
  return arr.join(':');
}

function isDateOnRange(value, from, to) {
  if(isNotEmptyString(from)) {
    if(new Date(value) < new Date(from)) {
      return false;
    }
  }
  if(isNotEmptyString(to)) {
    if(new Date(value) > new Date(to)) {
      return false;
    }
  }
  return true;
}

function isTimeOnRange(value, from, to) {
  if(isNotEmptyString(from)) {
    if(to24HrFormat(value) < to24HrFormat(from)) {
      return false;
    }
  }
  if(isNotEmptyString(to)) {
    if(to24HrFormat(value) > to24HrFormat(to)) {
      return false;
    }
  }
  return true;
}

function isAmountOnRange(value, from, to) {
  if(isNotEmptyString(from)) {
    if(parseFloat(value) < parseFloat(from)) {
      return false;
    }
  }
  if(isNotEmptyString(to)) {
    if(parseFloat(value) > parseFloat(to)) {
      return false;
    }
  }
  return true;
}

function isValidExpense(exp) {
  return isValidName(exp) && isValidDate(exp)
          && isValidTime(exp) && isValidAmount(exp);
}
function isValidName(exp) {
  return (exp.name && exp.name.trim().length > 0);
}
function isValidDate(exp) {
  var dateArr,
      dateSep = "-";
  if(exp.date && exp.date.split(dateSep).length === 3) {
    dateArr = exp.date.split(dateSep);
    return (Date.validateDay(parseInt(dateArr[2]),//day,year,month
                parseInt(dateArr[0]),
                parseInt(dateArr[1])-1));
  }
  return false;
}
function isValidTime(exp) {
  var timeArr,
      timeSep = ":";
  if(exp.time && exp.time.split(timeSep).length === 2) {
    timeArr = exp.time.split(timeSep);
    return (Date.validateHour(parseInt(timeArr[0]))
           && Date.validateMinute(parseInt(timeArr[1])));
  }
  return false;
}
function isValidAmount(exp) {
  return (exp.amount && parseFloat(exp.amount) > 0);
}
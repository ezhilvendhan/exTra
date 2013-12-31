'use strict';

angular.module('extraApp')
  .controller('loginCtrl', ['$scope', '$http', '$location', 'UserService',
      function loginCtrlCb($scope, $http, $location, UserService) {
        //invalidate
        signout($scope, $http, $location, UserService);
        //vars
        $scope.signup = false;
        $scope.userid = '';
        $scope.password = '';
        $scope.newuser = {};

        //functions
        $scope.login = loginFn($scope, $http, $location, UserService);

        $scope.toggleSignupForm = function toggleSignupForm() {
          $scope.signup = !$scope.signup;
          $scope.error = '';
        };
        $scope.createUser = createUser($scope, $http, $location, UserService);
    }
  ]
);

angular.module('extraApp')
  .controller('MainCtrl', ['$scope', '$http',
    '$location', 'UserService',
    function MainCtrlCb($scope, $http, $location, UserService) {
      initExpGrid($scope);

      if(!UserService.getUser()) {
        $location.path('/');
      } else {
        initFilterModel($scope);
        initNewExpenseModel($scope);
        $scope.updatestatus = '';

        $scope.expenses = UserService.getUser().expense;
        calculateAvg($scope);

        $scope.filter = filterFn($scope, $http, $location, UserService);
        $scope.clearFilter = clearFilterFn($scope, $http, $location, UserService);
        $scope.createExpense = createExpenseFn($scope, $http, $location, UserService);
        $scope.updateExpenses = updateExpensesFn($scope, $http, $location, UserService);
      }
}]);

function signout($scope, $http, $location, UserService) {
  $http.post('/api/users/signout', UserService.getUser())
    .success(function(data) {
      if(data) {
        UserService.setUser(null);
      }
  })
  .error(function signoutErr(data) {
    $scope.error = EXTRAAPP_ERR_MSG;
  });
}

function loginFn($scope, $http, $location, UserService) {
  return function _loginFn() {
    var user = {};
    user.userid = this.userid;
    user.password = this.password;
    $http.post('/api/users/get', user)
      .success(function(data) {
        if(data.failure) {
          $scope.error = data.failure;
        } else if(data) {
          UserService.setUser(data);
          $location.path('/main');
        }
    })
    .error(function(data) {
      $scope.error = EXTRAAPP_ERR_MSG;
    });
  }
}

function createUser($scope, $http, $location, UserService) {
  return function _createUser() {
    $scope.newuser.expense = [];
    $http.post('/api/users/create', $scope.newuser)
      .success(function(data) {
        if(data.failure) {
          $scope.error = data.failure;
        } else if(data) {
          UserService.setUser(data);
          $location.path('/main');
        }
    })
    .error(function(data) {
      $scope.error = EXTRAAPP_ERR_MSG;
    });
  }
};

function initExpGrid($scope) {
  $scope.deleteExpFn = function deleteExpFn(row) {
    deleteExpense(row.entity, UserService);
  };
  $scope.delExpense =
    '<button id="expense.delBtn" type="button" class="btn label label-danger"'+
    ' ng-click="deleteExpFn(row)" >x</button> ';
  $scope.dateTpl = '<input type="text" bs-datepicker '+
                        'ng-model="row.entity[col.field]" data-date-format="yyyy-mm-dd">';
  $scope.timeTpl = '<input type="text" bs-timepicker data-show-meridian="false" '+
                        'ng-model="row.entity.time" data-default-time={{row.entity.time}}>';

  $scope.gridOptions = {
      data: 'expenses',
      enableCellSelection: true,
      enableRowSelection: false,
      showFilter: true,
      columnDefs: [{field: 'name', displayName: 'Name', enableCellEdit: true},
                   {field:'date', displayName:'Date', enableCellEdit: true, cellFilter: 'date:\'yyyy-MM-dd\''},
                   {field: 'time', displayName: 'Time', enableCellEdit: true, cellTemplate: $scope.timeTpl},
                   {field:'amount', displayName:'Amount', enableCellEdit: true, cellFilter: 'currency'},
                   {field: 'description', displayName: 'Description', enableCellEdit: true},
                   {displayName:'Delete', cellTemplate:$scope.delExpense}
                  ]
  };
}

function initFilterModel($scope) {
  $scope.filterExp = {};
  $scope.filterExp.fromdate = '';
  $scope.filterExp.todate = '';
  $scope.filterExp.fromtime = '';
  $scope.filterExp.totime = '';
  $scope.filterExp.fromamount = '';
  $scope.filterExp.toamount = '';
  $scope.filterExp.description = '';
  $scope.filterExp.name = '';
  return $scope;
}

function filterFn($scope, $http, $location, UserService) {
  return function _filterFn() {
    var user = UserService.getUser();
    $http.post('/api/expense/get', $scope.filterExp)
      .success(function(data) {
        if(data) {
          $scope.expenses = data;
          calculateAvg($scope);
        }
        else {
          $scope.error = EXTRAAPP_ERR_MSG;
        }
    })
    .error(function filterFnErr(data) {
      $scope.error = EXTRAAPP_ERR_MSG;
    });
  }
}

function clearFilterFn($scope, $http, $location, UserService) {
  return function _clearFilterFn() {
    $http.post('/api/expense/getall')
      .success(function(data) {
        if(data) {
          initFilterModel($scope);
          UserService.getUser().expense = data;
          $scope.expenses = data;
          calculateAvg($scope);
        }
    })
    .error(function clearFilterFnErr(data) {
      $scope.error = EXTRAAPP_ERR_MSG;
    });
  }
}

function initNewExpenseModel($scope) {
  $scope.newexpense = {};
  $scope.newexpense.name = '';
  $scope.newexpense.date = '';
  $scope.newexpense.time = '';
  $scope.newexpense.amount = '';
  $scope.newexpense.description = '';
  return $scope;
}

function createExpenseFn($scope, $http, $location, UserService) {
  return function _createExpenseFn() {
    $scope.error = '';
    var user = UserService.getUser();
    if(isNaN(parseFloat($scope.newexpense.amount))) {
      $scope.error = EXTRAAPP_INVALID_AMOUNT;
      return false;
    }
    user.expense.push($scope.newexpense);
    $http.post('/api/expense/create', user)
      .success(function(data) {
        if(data) {
          $scope.newexpense = {};
          calculateAvg($scope);
        }
        else {
          $scope.error = EXTRAAPP_ERR_MSG;
        }
    })
    .error(function createExpenseFnErr(data) {
      $scope.error = EXTRAAPP_ERR_MSG;
    });
  }
}

function updateExpensesFn($scope, $http, $location, UserService) {
  return function _updateExpensesFn() {
    var user = updateExpense($scope.expenses, UserService);
    $http.post('/api/expense/update', user)
      .success(function(data) {
        if(data.failure) {
          $scope.updatestatus = data.failure;
        } else if(data) {
          $scope.expenses = data.expense;
          calculateAvg($scope);
          $scope.updatestatus = EXTRAAPP_SAVE_SUCCESSFUL;
          setTimeout(function(){
            $scope.updatestatus = '';
          }, 1000);
        } else {
          $scope.updatestatus = EXTRAAPP_SAVE_FAILURE;
        }
    })
    .error(function updateExpensesFnErr(data) {
      $scope.updatestatus = EXTRAAPP_ERR_MSG;
    });
  }
}

function deleteExpense(expenses, UserService) {
  var user = UserService.getUser(),
      originalExp = user.expense,
      deleteAnExpense = function deleteAnExpense(ex) {
        originalExp.every(function(original, idx) {
          if(original._id === ex._id) {
            originalExp.splice(idx, 1);
            return false;
          }
          return true;
        });
      };
  if(Array.isArray(expenses)) {
    expenses.forEach(function(ex) {
      deleteAnExpense(ex);
    })
  } else if(expenses){
      deleteAnExpense(expenses);
  }
  return user;
}

function updateExpense(expenses, UserService) {
  var user = UserService.getUser(),
      originalExp = user.expense,
      replaceExp = function replaceExp(updated) {
        originalExp.every(function(original, idx) {
          if(original._id === updated._id) {
            originalExp[idx] = updated;
            return false;
          }
          return true;
        });
      };
  if(Array.isArray(expenses)) {
    expenses.forEach(function(updated) {
      replaceExp(updated);
    })
  } else if(expenses){
      replaceExp(expenses);
  }
  return user;
}

function calculateAvg($scope) {
  var sorted = $scope.expenses.sort(function(exp1, exp2) {
    if(exp1.date < exp2.date) return -1;
    if(exp1.date > exp2.date) return 1;
    return 0;
  });
  var getTotalExpense = function getTotalExpense(sorted) {
    return sorted.reduce(function(prev, curr, idx, array) {
      return prev + parseFloat(curr.amount);
    }, 0);
  };
  if(sorted.length > 0) {
    var earliest = new Date(sorted[0].date),
        latest = new Date(sorted[sorted.length-1].date),
        days = earliest.getDaysBetween(latest),
        weeks = Math.round(days/7),
        total = getTotalExpense(sorted);
    if(weeks > 0) {
      $scope.weeklyAvg = (total/weeks).toFixed(2);
      $scope.dailyAvg = (total/days).toFixed(2);
    } else {
      if(days < 1) days = 1;
      $scope.weeklyAvg = (total/days*7).toFixed(2);
      $scope.dailyAvg = (total/days).toFixed(2);
    }
    $scope.total = total;
  }
}
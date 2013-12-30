'use strict';

angular.module('extraApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [{
      'title': 'Signout',
      'link': '/'
    }];

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });

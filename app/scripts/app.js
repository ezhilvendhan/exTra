'use strict';

angular.module('extraApp', [
  '$strap',
  'ngGrid',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
]).config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/login',
      controller: 'loginCtrl'
    })
    .when('/main', {
      templateUrl: 'partials/main',
      controller: 'MainCtrl'
    })
    .otherwise({
      redirectTo: '/main'
    });
  $locationProvider.html5Mode(true);
});
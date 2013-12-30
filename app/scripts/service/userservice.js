angular.module('extraApp')
  .factory('UserService', ['$http', function($http) {
    return {
      setUser: function(user) {
        this.currentUser = user;
      },
      getUser: function() {
        return this.currentUser;
      }
    };
}]);
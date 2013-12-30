'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('extraApp'));

  var MainCtrl,
    scope,
    $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/users/get')
      .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of Users to the scope', function () {
    expect(scope.get).toBeUndefined();
    $httpBackend.flush();
    expect(scope.get.length).toBe(0);
  });
});

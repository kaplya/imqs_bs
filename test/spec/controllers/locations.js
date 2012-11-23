'use strict';

describe('Controller: LocationsCtrl', function() {

  // load the controller's module
  beforeEach(module('imqsBsApp'));

  var LocationsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller) {
    scope = {};
    LocationsCtrl = $controller('LocationsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    expect(scope.awesomeThings.length).toBe(3);
  });
});

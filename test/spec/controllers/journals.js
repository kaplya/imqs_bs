'use strict';

xdescribe('Controller: JournalsCtrl', function() {

  // load the controller's module
  beforeEach(module('imqsBsApp'));

  var JournalsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller) {
    scope = {};
    JournalsCtrl = $controller('JournalsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    expect(scope.awesomeThings.length).toBe(3);
  });
});

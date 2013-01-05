'use strict';

xdescribe('Controller: JournalShowCtrl', function() {

  // load the controller's module
  beforeEach(module('imqsBsApp'));

  var JournalShowCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller) {
    scope = {};
    JournalShowCtrl = $controller('JournalShowCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    expect(scope.awesomeThings.length).toBe(3);
  });
});

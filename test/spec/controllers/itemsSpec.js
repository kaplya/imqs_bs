'use strict';

describe('Controller: ItemsCtrl', function() {

  // load the controller's module
  beforeEach(module('imqsBsApp'));

  var ItemsCtrl,
    scope,
    $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
    
    var items = [
      {name: "Beer", code: "02700"},
      {name: "Juice", brand: "J7"},
      {name: "Tea"}
    ];
    $httpBackend = _$httpBackend_;
    $httpBackend.expect('GET', '/items').respond(items);

    scope = $rootScope.$new();
    ItemsCtrl = $controller('ItemsCtrl', { $scope: scope });
    $controller('InitCtrl', { $scope: scope });

  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should attach a list of items to the scope', function() {
    expect(scope.items).toBeUndefined();
    $httpBackend.flush();
    expect(scope.items.length).toBe(3);
  });

});

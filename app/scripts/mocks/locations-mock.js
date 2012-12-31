'use strict';

imqsBsAppDev.run(["$httpBackend", function($httpBackend) {
  var items = [
  	{ id: 1, name: "West Store", city: "Tokyo"},
  	{ id: 2, name: "Europe Store", city: "Paris"}
  ];
  
  items.reverse();

  var nextId = 3;

  $httpBackend.whenGET('/locations').respond(items);
}]);
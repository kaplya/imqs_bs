'use strict';

imqsBsAppDev.run(["$httpBackend", function($httpBackend) {
  var items = [
  	{ id: 1, name: "West Store", city: "Tokyo"},
  	{ id: 2, name: "Europe Store", city: "Paris"}
  ];
  
  items.reverse();

  var nextId = 3;

  $httpBackend.whenGET('/locations').respond(items);

  $httpBackend.whenGET(/locations\/[1-9]+/).respond(function (method, url, data, headers) {
  	var r = angular.fromJson(data);
  	var id = /\/([0-9]+)/.exec(url)[1];

  	var i;
  	angular.forEach(items, function (v) {
  		if(v.id == id) {
  			i = v;
  			return false;
  		}
  	});

  	if(i)
  		return [200, i];
  	else
  		return [402, 'not found'];

  });
}]);
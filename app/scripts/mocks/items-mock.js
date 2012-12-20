'use strict';

imqsBsAppDev.run(["$httpBackend", function($httpBackend) {
  var items = [
    {id: 1, name: "Beer", code: "02700"},
    {id: 2, name: "Juice", brand: "J7"},
    {id: 3, name: "Tea"}
  ];
  
  items.reverse();

  var nextId = 4;

  $httpBackend.whenGET('/items').respond(items);

  $httpBackend.whenGET(/items\/[1-9]+/).respond(function (method, url, data, headers) {
    var r = angular.fromJson(data);
    var id = /\/([0-9]+)/.exec(url)[1];

    var i;
    angular.forEach(items, function(v) {
      if(v.id == id) {
        i = v;
        return false;
      }
    });
    console.log(i);
    if(i)
      return [200, i];
    else
      return [402, 'not found'];

  });

  $httpBackend.whenPUT(/items\/[1-9]+/).respond(function(method, url, data, headers) {
  	var r = angular.fromJson(data);
  	var id = /\/([0-9]+)/.exec(url)[1];
    var e = {};

  	if(r.name == "" || r.name == null)
  	  e.name = ["can't be blank"];

  	if(!$.isEmptyObject(e))
  	  return [400, e];
  	
  	angular.forEach(items, function(v, i) {
      if(v.id == id) {
        this[i] = r;
        return false;
      }
    }, items);

    return [200, data];

  });

  $httpBackend.whenPOST('/items').respond(function(method, url, data, headers) {
    var r = angular.fromJson(data);
    var e = {};
    
    if(r.name == '3')
      return [500];

    if(r.name == "" || r.name == null)
      e['name'] = ["can't be blank"];

    if(!$.isEmptyObject(e))
      return [400, e];

    r.id = nextId;
    nextId++;
    
    items.unshift(r);
    console.log(r);
    return [200, r];

  });

  $httpBackend.whenDELETE(/\/items\/[1-9]+/).respond(function(method, url, data, headers) {
    var id = /\/([0-9]+)/.exec(url)[1];
    
    if(id == 1)
      return [400, { main: ["can't delete"] }];

    angular.forEach(items, function(v,i) {
      if(v.id != id)
        return true;

      this.splice(i,1);
      return false;

    }, items);

    return [200];

  });

}]);
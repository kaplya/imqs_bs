'use strict';

imqsBsAppDev.run(["$httpBackend", function($httpBackend) {
  
  var PATH = 'ines';

  var items = [
     {id: 1, journal_id: 2, date: "29.11.2012", item_code: "01", item_name: "Juice", qty: "10"},
     {id: 2, journal_id: 2, date: "29.11.2012", item_code: "02", item_name: "Potato", qty: "7"},
     {id: 3, journal_id: 2, date: "29.11.2012", item_code: "03", item_name: "Sugar", qty: "5"}
  ];
  
  items.reverse();

  var nextId = 4;

  // $httpBackend.whenGET(new RegExp(PATH + '\?')).respond(items);
  
  function getQueryParams(qs) {
    qs = qs.split("+").join(" ");

    var params = {}, tokens,
        re = /[?&]([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }

    return params;
  }

  $httpBackend.whenGET(/^\/lines\?/).respond(function (method, url, data) {
    console.log(url);
    var p = getQueryParams(url);

    var _items = [];
    if(p.journal_id) {
      angular.forEach(items, function (v, i) {
        if (v.journal_id == p.journal_id) {
          _items.push(v);
        }
      });
    } else {
      _items = items;
    }

    return [200, _items];
  });

  $httpBackend.whenGET(/\/lines\/[0-9]+/).respond(function (method, url, data) {
    console.log(url);
    var id = /\/([0-9]+)/.exec(url)[1];
    var i;
    angular.forEach(items, function (v) {
      if(v.id == id) {
        i = v;
        return false;
      }
    });
    
    return [200, i];

  });


  $httpBackend.whenPUT(/lines\/[1-9]+/).respond(function (method, url, data, headers) {
    console.log(url);
    var r = angular.fromJson(data);
    var id = /\/([0-9]+)/.exec(url)[1];
    var e = {};

    if(r.name == 'eRRoR') {
      e.name = ['error test'];
    }
    
    if(!$.isEmptyObject(e)) { return [400, e] }

    angular.forEach(items, function (v,i) {
      if(v.id == id) {
        this[i] = r;
        return false;
      }
    }, items);

    return [200, data];

  });

/*  
  $httpBackend.whenPOST('/journals').respond(function (method, url, data, header) {
    var r = angular.fromJson(data);
    var e = {};

    if(r.number == 'eRRoR') {
      e['number'] = ['error test 1', 'error test 2'];
      e['date'] = ['error test 3'];
      e['j_type'] = ['error test 4'];
      e['main'] = ['error test 5'];
    }

    if(!$.isEmptyObject(e)) { return [400, e] }

    r.id = nextId;
    nextId++;

    items.unshift(r);
    return [200, r];

  });

  $httpBackend.whenDELETE(/\/journals\/[1-9]+/).respond(function (method, url, data, headers) {
    var id = /\/([0-9]+)/.exec(url)[1];
    
    if(id == 1) {
      return [400, { main: ['error test 1', 'error test 2'] }];
    }

    angular.forEach(items, function (v, i) {
      if(v.id != id) { return true; }
      this.splice(i, 1);
      return true;
    }, items);

    return [200];

  })  */

}]);
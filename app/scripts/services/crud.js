'use strict';

imqsBsApp.factory('Crud', function() {
  var defaultOpts = {
  	itemsList: 'itemsList',
  	itemModal: 'modalEdit',
  	item: 'i'
  };
  return {
    init: function(scope, resource, opts) {
    	var opts = angular.extend({}, defaultOpts, opts);

	    scope[opts.itemModal] = { shown: false };
	  	scope.modalDel = { shown: false };
	    scope.spin = true;

	    resource.query(function (data) {
	      scope[opts.itemsList] = data;
	      scope.spin = false;
	    });

	    scope.edit = function () {
	      scope[opts.itemModal].data = {};
	      scope[opts.itemModal].listData = this[opts.item];
	      scope[opts.itemModal].spin = true;

	      resource.get( { id: this[opts.item].id }, function (data) {
	        scope[opts.itemModal].data = data;
	        scope[opts.itemModal].spin = false;
	      });
	    	scope[opts.itemModal].shown = true;
	    };
	    
	    scope.new = function () {
	  		scope[opts.itemModal].data = {};
	      scope[opts.itemModal].shown = true;
	    };

	    scope.createOrUpdate = function () {
	      scope[opts.itemModal].data.error = undefined;
	      scope[opts.itemModal].spin = true;
	      var update = function () {
	        resource.update({ id: scope[opts.itemModal].data.id }, scope[opts.itemModal].data, function (data) {
	          scope[opts.itemModal].spin = false;
	          scope[opts.itemModal].shown = false;
	          angular.copy(data, scope[opts.itemModal].listData);
	        }, function (r) {
	          scope[opts.itemModal].data.error = r.data;
	          scope[opts.itemModal].spin = false;          
	        })
	      };
	      var create = function () {
	        resource.create(scope[opts.itemModal].data, function (data) {
	          scope[opts.itemModal].shown = false;
	          scope[opts.itemModal].spin = false;
	          scope[opts.itemsList].unshift(data);
	        }, function (r) {
	          scope[opts.itemModal].data.error = r.data;
	          scope[opts.itemModal].spin = false;
	        });
	      };

	      if (scope[opts.itemModal].data.id) {
	        update();
	      } else {
	        create();
	      };
	    };
	    
	    scope.delete = function () {
	      scope.modalDel.error = undefined;
	      scope.modalDel.shown = true;
	      scope.modalDel.listData = this[opts.item];
	    };

	    scope.destroy = function () {
	      scope.modalDel.error = undefined;
	      scope.modalDel.spin = true;
	      var id = scope.modalDel.listData.id,
	        index;
	      resource.destroy({ id: id }, function () {
	        scope.modalDel.spin = false;
	        scope.modalDel.shown = false;
	        angular.forEach(scope[opts.itemsList], function (v, i) {
	          if (v.id != id) { return true; }
	          index = i;
	          return false;
	        });
	        scope[opts.itemsList].splice(index, 1);
	      }, function (r) {
	        scope.modalDel.error = r.data;
	        scope.modalDel.spin = false;
	      });
	    }
    }
  };
});

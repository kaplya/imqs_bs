'use strict';

imqsBsApp.factory('Crud', function() {
  var defaultOpts = {
  	itemsList: 'itemsList'
  };
  return {
    init: function(scope, resource, opts) {
    	var opts = angular.extend({}, defaultOpts, opts);

	    scope.modalEdit = { shown: false };
	  	scope.modalDel = { shown: false };
	    scope.spin = true;

	    resource.query(function (data) {
	      scope[opts.itemsList] = data;
	      scope.spin = false;
	    });

	    scope.edit = function () {
	      scope.modalEdit.data = {};
	      scope.modalEdit.listData = this.i;
	      scope.modalEdit.spin = true;

	      resource.get( { id: this.i.id }, function (data) {
	        scope.modalEdit.data = data;
	        scope.modalEdit.spin = false;
	      });
	    	scope.modalEdit.shown = true;
	    };
	    
	    scope.new = function () {
	  		scope.modalEdit.data = {};
	      scope.modalEdit.shown = true;
	    };

	    scope.createOrUpdate = function () {
	      scope.modalEdit.data.error = undefined;
	      scope.modalEdit.spin = true;
	      var update = function () {
	        resource.update({ id: scope.modalEdit.data.id }, scope.modalEdit.data, function (data) {
	          scope.modalEdit.spin = false;
	          scope.modalEdit.shown = false;
	          angular.copy(data, scope.modalEdit.listData);
	        }, function (r) {
	          scope.modalEdit.data.error = r.data;
	          scope.modalEdit.spin = false;          
	        })
	      };
	      var create = function () {
	        resource.create(scope.modalEdit.data, function (data) {
	          scope.modalEdit.shown = false;
	          scope.modalEdit.spin = false;
	          scope[opts.itemsList].unshift(data);
	        }, function (r) {
	          scope.modalEdit.data.error = r.data;
	          scope.modalEdit.spin = false;
	        });
	      };

	      if (scope.modalEdit.data.id) {
	        update();
	      } else {
	        create();
	      };
	    };
	    
	    scope.delete = function () {
	      scope.modalDel.error = undefined;
	      scope.modalDel.shown = true;
	      scope.modalDel.listData = this.i;
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

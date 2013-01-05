'use strict';

imqsBsApp.factory('CrudB', function() {

  var defaultOpts = {
  	models: {
  		list: 'list',
  		item: 'item',
  		show: 'show',
  		edit: 'edit' // conflict with edit method
  	},
  	initRequest: 'list',
  	initRequestParams: {}
  };

  return function(scope, resource, opts) {

	var opts = angular.extend({}, defaultOpts, opts),
		callbacks = {};
		
		opts.models = angular.extend({}, defaultOpts.models, opts.models);

    scope[opts.models.edit] = { shown: false };
  	scope.modalDel = { shown: false };
    scope.spin = true;

    if(opts.initRequest == 'list') {
	    resource.query(opts.initRequestParams, function (data) {
	      scope[opts.models.list] = data;
	      scope.spin = false;
	    });
    } else if (opts.initRequest == 'item') {
	    resource.get(opts.initRequestParams, function (data) {
	      scope[opts.models.item] = data;
	      scope.spin = false;
	    });    	
    }

    scope.edit = function () {
      if(angular.isFunction(callbacks.beforeEdit)) {
      	if(callbacks.beforeEdit(this) === false) { return };
      }

      scope[opts.models.edit].data = {};
      scope[opts.models.edit].listData = this[opts.models.item];
      scope[opts.models.edit].spin = true;

      resource.get( { id: this[opts.models.item].id }, function (data) {
        scope[opts.models.edit].data = data;
        scope[opts.models.edit].spin = false;
      });
    	scope[opts.models.edit].shown = true;
    };
    
    scope.new = function () {
  		scope[opts.models.edit].data = {};
      scope[opts.models.edit].shown = true;
    };

    scope.createOrUpdate = function () {
      scope[opts.models.edit].data.error = undefined;
      scope[opts.models.edit].spin = true;
      var update = function () {
        resource.update({ id: scope[opts.models.edit].data.id }, scope[opts.models.edit].data, function (data) {
          scope[opts.models.edit].spin = false;
          scope[opts.models.edit].shown = false;
          angular.copy(data, scope[opts.models.edit].listData);
        }, function (r) {
          scope[opts.models.edit].data.error = r.data;
          scope[opts.models.edit].spin = false;          
        })
      };
      var create = function () {
        resource.create(scope[opts.models.edit].data, function (data) {
          scope[opts.models.edit].shown = false;
          scope[opts.models.edit].spin = false;
          scope[opts.models.list].unshift(data);
          if(angular.isFunction(callbacks.afterCreate)) {
          	callbacks.afterCreate(data);
          };
        }, function (r) {
          scope[opts.models.edit].data.error = r.data;
          scope[opts.models.edit].spin = false;
        });
      };

      if (scope[opts.models.edit].data.id) {
        update();
      } else {
        create();
      };
    };
    
    scope.delete = function () {
      scope.modalDel.error = undefined;
      scope.modalDel.shown = true;
      scope.modalDel.listData = this[opts.models.item];
    };

    scope.destroy = function () {
      scope.modalDel.error = undefined;
      scope.modalDel.spin = true;
      var id = scope.modalDel.listData.id,
        index;
      resource.destroy({ id: id }, function () {
        scope.modalDel.spin = false;
        scope.modalDel.shown = false;
        angular.forEach(scope[opts.models.list], function (v, i) {
          if (v.id != id) { return true; }
          index = i;
          return false;
        });
        scope[opts.models.list].splice(index, 1);
      }, function (r) {
        scope.modalDel.error = r.data;
        scope.modalDel.spin = false;
      });
    }
    return callbacks;

  };
});

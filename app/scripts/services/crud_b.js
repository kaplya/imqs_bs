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

		function formCtrl($scope) {
			var fScope = $scope;
			fScope.isShown = false;
			fScope.isBusy = false;
      
      fScope.createOrUpdate = function () {    
        fScope.errors = undefined;
        fScope.isBusy = true;
        var update = function () {
          resource.update({ id: fScope.model.id }, fScope.model, function (data) {
            fScope.isBusy = false;
            fScope.isShown = false;
            angular.copy(data, scope.model);
          }, function (r) {
            fScope.errors = r.data;
            fScope.isBusy = false;
          })
        };
        var create = function () {
          resource.create(fScope.model, function (data) {
            fScope.isBusy = false;
            fScope.isShown = false;
            if(angular.isArray(scope.modelsList)) {
              scope.modelsList.unshift(data);
            }
            if(angular.isFunction(callbacks.afterCreate)) {
              callbacks.afterCreate(data);
            };
          }, function (r) {
            fScope.errors = r.data;
            fScope.isBusy = false;
          });
        };

        if (fScope.model.id) { update() } 
        else { create() };
      };

      fScope.destroy = function () {
        fScope.errors = undefined;
        fScope.isBusy = true;
        resource.destroy({ id: fScope.model.id }, function () {
          fScope.isBusy = false;
          fScope.isShown = false;
          if(angular.isArray(scope.modelsList)) {
            var index;
            angular.forEach(scope.modelsList, function (v, i) {
              if (v.id != fScope.model.id) { return true; }
              index = i; return false;
            });
            scope.modelsList.splice(index, 1);
          };
          if(angular.isFunction(callbacks.afterDestroy)) {
            callbacks.afterDestroy();
          }
        }, function (r) {
          fScope.errors = r.data;
          fScope.isBusy = false;
        });
      }
      return fScope;
		};

    var fScopes = {};
    scope.FormCtrl = function ($scope) {
      fScopes['newOrEdit'] = formCtrl($scope);
    };    

    scope.NewOrEditFormCtrl = function ($scope) {
      fScopes['newOrEdit'] = formCtrl($scope);
    };

    scope.DelFormCtrl = function ($scope) {
      fScopes['del'] = formCtrl($scope);
    };

		scope.isBusy = true;

		var opts = angular.extend({}, defaultOpts, opts),
			callbacks = {};
		
		opts.models = angular.extend({}, defaultOpts.models, opts.models);

    if(opts.initRequest == 'list') {
	    resource.query(opts.initRequestParams, function (data) {
	      scope.modelsList = data;
	      scope.isBusy = false;
	    });
    } else if (opts.initRequest == 'item') {
	    resource.get(opts.initRequestParams, function (data) {
	    	scope.model = data;
	      scope.isBusy = false;
	    });    	
    }
    
    scope.new = function () {
      fScopes['newOrEdit'].isShown = true;
      fScopes['newOrEdit'].model = {};
      fScopes['newOrEdit'].errors = undefined;
    };

    scope.edit = function () {
      if(angular.isFunction(callbacks.beforeEdit)) {
      	if(callbacks.beforeEdit(this) === false) { return };
      }
			fScopes['newOrEdit'].isShown = true;
      fScopes['newOrEdit'].isBusy = true;
      fScopes['newOrEdit'].errors = undefined;
			scope.model = this.model;
      resource.get( { id: scope.model.id }, function (data) {
        fScopes['newOrEdit'].model = data;
        fScopes['newOrEdit'].isBusy = false;
      });
    };

    scope.delete = function () {
      fScopes['del'].isShown = true;
      fScopes['del'].errors = undefined;
      fScopes['del'].model = this.model;
    };
        
    return callbacks;
  
  };  
});

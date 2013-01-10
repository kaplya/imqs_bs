'use strict';

imqsBsApp.factory('CrudC', function() {

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

  function updateModel(dst) {   
    angular.forEach(arguments, function(obj) {
      if (obj !== dst) {
        angular.forEach(obj, function (value, key) {
          if (key == '$$hashKey') { return true };
          dst[key] = obj[key];
        });
      }
    });
    return dst;
  };

  return function(scope, resource, opts) {

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
    };

    scope.new = function () {
      scope.model = null;
      scope.mode = 'NewOrEdit';
      scope.isShown = true;
    };

    function formCtrl($scope) {
			var fScope = $scope;
      fScope.errors = undefined;
      fScope.isShown = true;
      fScope.isBusy = true;

      if (fScope.model) {
        resource.get( { id: fScope.model.id }, function (data) {
          fScope.model = data;
          fScope.isBusy = false;
        });
      } else {
        fScope.model = {};
      }

      fScope.createOrUpdate = function () {    
        fScope.errors = undefined;
        fScope.isBusy = true;
        var update = function () {
          resource.update({ id: fScope.model.id }, fScope.model, function (data) {
            fScope.isBusy = false;
            fScope.isShown = false;
            updateModel(fScope.$parent.model, data);
            fScope.$parent.mode = null;
          }, function (r) {
            fScope.errors = r.data;
            fScope.isBusy = false;
          })
        };
        var create = function () {
          angular.extend(fScope.model, opts.initRequestParams);
          resource.create(fScope.model, function (data) {
            fScope.isBusy = false;
            fScope.isShown = false;
            fScope.$parent.mode = null;
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
      };

      fScope.cancel = function () {
        fScope.$parent.mode = null;
        fScope.isShown = false;
      };

		};

    scope.FormCtrl = ['$scope', function ($scope) {
      formCtrl($scope);
    }];    

    scope.NewOrEditFormCtrl = ['$scope', function ($scope) {
      formCtrl($scope);
    }];

    scope.DelFormCtrl = ['$scope', function ($scope) {
      formCtrl($scope);
    }];

    scope.ShowFormCtrl = ['$scope', function ($scope) {      
      var fScope = $scope;
      fScope.mode = null;

      fScope.edit = function () {
        // if(angular.isFunction(callbacks.beforeEdit)) {
        //   if(callbacks.beforeEdit(this) === false) { return };
        // }
        fScope.mode = 'NewOrEdit';
      };

      fScope.delete = function () {
        fScope.isShown = true;
        fScope.errors = undefined;
      };
    }];
  
  };  
});

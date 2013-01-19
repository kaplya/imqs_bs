'use strict';

imqsBsApp.factory('CrudC', function() {

  var defaultOpts = {
    modelName: 'model',
    modelsListName: 'modelsList',
  	initRequest: 'list',
  	initRequestParams: {},
    modes: {
      new: 'NewOrEdit',
      edit: 'NewOrEdit',
      delete: 'Del'
    }
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

		
    var opts = angular.extend({}, defaultOpts, opts);
    
    // opts.models = angular.extend({}, defaultOpts.models, opts.models);
    opts.modes = angular.extend({}, defaultOpts.modes, opts.modes);

    function formCtrl($scope) {
			var fScope = $scope;
      fScope.errors = undefined;
      fScope.isShown = true;
      fScope.isBusy = true;

      if (fScope[opts.modelName]) {
        resource.get( { id: fScope[opts.modelName].id }, function (data) {
          fScope[opts.modelName] = data;
          fScope.isBusy = false;
        });
      } else {
        fScope[opts.modelName] = {};
      }

      fScope.createOrUpdate = function () {    
        fScope.errors = undefined;
        fScope.isBusy = true;
        var update = function () {
          resource.update({ id: fScope[opts.modelName].id }, fScope[opts.modelName], function (data) {
            fScope.isBusy = false;
            fScope.isShown = false;
            updateModel(fScope.$parent[opts.modelName], data);
            fScope.$parent.mode = null;
          }, function (r) {
            fScope.errors = r.data;
            fScope.isBusy = false;
          })
        };
        var create = function () {
          angular.extend(fScope[opts.modelName], opts.initRequestParams);
          resource.create(fScope[opts.modelName], function (data) {
            fScope.isBusy = false;
            fScope.isShown = false;
            fScope.$parent.mode = null;
            if(angular.isArray(scope[opts.modelsListName])) {
              scope[opts.modelsListName].unshift(data);
            }
            fScope.$emit('afterSuccessCreation', { id: data.id });
          }, function (r) {
            fScope.errors = r.data;
            fScope.isBusy = false;
          });
        };

        if (fScope[opts.modelName].id) { update() } 
        else { create() };
      };

      fScope.destroy = function () {
        fScope.errors = undefined;
        fScope.isBusy = true;
        resource.destroy({ id: fScope[opts.modelName].id }, function () {
          fScope.isBusy = false;
          fScope.isShown = false;
          //fScope.$parent.mode = null;
          if(angular.isArray(scope[opts.modelsListName])) {
            var index;
            angular.forEach(scope[opts.modelsListName], function (v, i) {
              if (v.id != fScope[opts.modelName].id) { return true; }
              index = i; return false;
            });
            scope[opts.modelsListName].splice(index, 1);
          };
          fScope.$emit('afterSuccessDestroy', { modelName: opts.modelName });
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

    scope.InitCtrl =['$scope', function (scope) {
      scope.isBusy = true;
      if(opts.initRequest == 'list') {
        resource.query(opts.initRequestParams, function (data) {
          scope[opts.modelsListName] = data;
          scope.isBusy = false;
        });
      } else if (opts.initRequest == 'item') {
        resource.get(opts.initRequestParams, function (data) {
          scope[opts.modelName] = data;
          scope.isBusy = false;
        });     
      };

      scope.new = function () {
        scope[opts.modelName] = null;
        scope.mode = opts.modes.new;
        scope.isShown = true;
      };
    }];

    scope.ShowFormCtrl = ['$scope', function ($scope) {      
      var fScope = $scope;
      fScope.mode = null;

      fScope.edit = function () {
        if(fScope.$emit('beforeEdit').defaultPrevented) { 
          return 
        };
        fScope.mode = opts.modes.edit;
      };

      fScope.delete = function () {
        fScope.mode = opts.modes.delete;
        fScope.errors = undefined;
      };
    }];

    scope.NewOrEditFormCtrl = ['$scope', function ($scope) {
      formCtrl($scope);
    }];

    scope.DelFormCtrl = ['$scope', function ($scope) {
      formCtrl($scope);
    }];

  
  };  
});

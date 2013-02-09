'use strict';

imqsBsApp.factory('Crud', function() {

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
    opts.modes = angular.extend({}, defaultOpts.modes, opts.modes);
    
    function createOrUpdate(fScope) {    
      fScope.errors = undefined;
      fScope.isBusy = true;
      var update = function () {
        resource.update({ id: fScope[opts.modelName].id }, fScope[opts.modelName], function (data) {
          fScope.isBusy = false;
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
          fScope.$parent.mode = null;
          if(angular.isArray(fScope[opts.modelsListName])) {
            fScope[opts.modelsListName].unshift(data);
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

    function destroy(fScope) {
      fScope.errors = undefined;
      fScope.isBusy = true;
      resource.destroy({ id: fScope[opts.modelName].id }, function () {
        fScope.isBusy = false;
        //fScope.$parent.mode = null;
        if(angular.isArray(fScope[opts.modelsListName])) {
          var index;
          angular.forEach(fScope[opts.modelsListName], function (v, i) {
            if (v.id != fScope[opts.modelName].id) { return true; }
            index = i; return false;
          });
          fScope[opts.modelsListName].splice(index, 1);
        };
        fScope.$emit('afterSuccessDestroy', { modelName: opts.modelName });
      }, function (r) {
        fScope.errors = r.data;
        fScope.isBusy = false;
      });
    };

    function cancel(fScope) {
      fScope.$parent.mode = null;
    };    

    function new_(fScope) {
      fScope[opts.modelName] = null;
      fScope.mode = opts.modes.new;
    };

    function edit(fScope) {
      if(fScope.$emit('beforeEdit').defaultPrevented) { 
        return 
      };
      fScope.mode = opts.modes.edit;
    };

    function delete_(fScope) {
      fScope.mode = opts.modes.delete;
      fScope.errors = undefined;
    };

    scope.InitCtrl =['$scope', function ($scope) {
      $scope.mode = null;
      $scope.isBusy = true;
      if(opts.initRequest == 'list') {
        resource.query(opts.initRequestParams, function (data) {
          $scope[opts.modelsListName] = data;
          $scope.isBusy = false;
        });
      } else if (opts.initRequest == 'item') {
        resource.get(opts.initRequestParams, function (data) {
          $scope[opts.modelName] = data;
          $scope.isBusy = false;
        });
        $scope.edit = function () { edit ($scope) };
        $scope.delete = function () { delete_($scope) };
      };

      $scope.new = function () { new_($scope) };
    }];

    scope.ShowFormCtrl = ['$scope', function ($scope) {      
      $scope.mode = null;

      $scope.edit = function () { edit ($scope) };
      $scope.delete = function () { delete_($scope) };
    }];

    scope.NewOrEditFormCtrl = ['$scope', function ($scope) {
      $scope.errors = undefined;

      if ($scope[opts.modelName]) {
        $scope.isBusy = true;
        resource.get( { id: $scope[opts.modelName].id }, function (data) {
          $scope[opts.modelName] = data;
          $scope.isBusy = false;
        });
      } else {
        $scope[opts.modelName] = {};
      }

      $scope.createOrUpdate = function () { createOrUpdate($scope) };
      $scope.destroy = function () { destroy($scope) };
      $scope.cancel = function () { cancel($scope) };
    }];

    scope.DelFormCtrl = ['$scope', function ($scope) {
      $scope.destroy = function () { destroy($scope) };
      $scope.cancel = function () { cancel($scope) };
    }];
  
  };  
});
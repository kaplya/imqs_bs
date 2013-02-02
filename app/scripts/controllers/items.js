'use strict';

imqsBsApp
  .factory('Item', ['$resource', function ($resource) {
  	return $resource('/items/:id/:action');  	
  }])
  .controller('ItemsCtrl', ["$scope", 'Item', 'Crud', function($scope, Item, Crud) {

    $scope.templates = {
      body: "views/items.html"
    };

    Crud($scope, Item, { modelName: 'i', modelsListName: 'items'});

  }]);

'use strict';

imqsBsApp
  .factory('Item', ['$resource', function ($resource) {
  	return $resource('/items/:id/:action');  	
  }])
  .controller('ItemsCtrl', ["$scope", 'Item', 'Crud', function($scope, Item, Crud) {

    $scope.templates = {
      body: "views/items.html"
    };

    Crud.init($scope, Item, { itemsList: 'items' });

  }]);

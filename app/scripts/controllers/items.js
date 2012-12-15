'use strict';

imqsBsApp
  .factory('Item', ['$resource', function ($resource) {
	return $resource('/items/:id/:action');  	
  }])
.controller('ItemsCtrl', ["$scope", 'Item', function($scope, Item) {
  $scope.templates = {};
  $scope.templates.body = "views/items.html";
  Item.query(function(data) {
  	$scope.items = data;
  });

}]);

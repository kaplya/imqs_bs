'use strict';

imqsBsApp
  .factory('Item', ['$resource', function ($resource) {
	return $resource('/items/:id/:action');  	
  }])
.controller('ItemsCtrl', ["$scope", 'Item', function($scope, Item) {
  
  $scope.templates = {
  	body: "views/items.html"
  };

  $scope.modal = { shown: false, del: false };
  
  Item.query(function(data) {
  	$scope.items = data;
  });

  $scope.edit = function () {
    
    Item.get( { id: this.i.id }, function (data) {
      $scope.modal.d = data;
    });

    this.modal.shown = true;
  };
  
  $scope.new = function () {
    this.modal.shown = true;
  };

  $scope.delete = function () {
  	this.modal.del = true;
  };

}]);

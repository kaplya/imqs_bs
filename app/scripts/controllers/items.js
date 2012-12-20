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
    
    $scope.modal.listData = this.i;
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

  $scope.createOrUpdate = function () {
    
    this.modal.shown = false;
    Item.update({ id: this.modal.d.id }, this.modal.d, function (data) {
      angular.copy(data, $scope.modal.listData);
    });
  };

}]);

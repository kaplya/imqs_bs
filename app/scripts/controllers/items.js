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
  $scope.modalDel = { shown: false };

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
    this.modal.d = {};
    this.modal.shown = true;
  };

  $scope.createOrUpdate = function () {
    
    $scope.modal.d.error = undefined;
    var update = function () { 
      Item.update({ id: $scope.modal.d.id }, $scope.modal.d, function (data) {
        $scope.modal.shown = false;
        angular.copy(data, $scope.modal.listData);
      }, function (r) {
        $scope.modal.d.error = r.data;
      });
    };

    var create = function () { 
      Item.create($scope.modal.d, function (data) { 
        $scope.modal.shown = false;
        $scope.items.unshift(data);
      }, function (r) {
        $scope.modal.d.error = r.data;
      });
    };

    if ($scope.modal.d.id) update(); 
    else create();

  };

  $scope.delete = function () {
    $scope.modalDel.error = undefined;
    this.modalDel.shown = true;
    this.modalDel.listData = this.i;
  };

  $scope.destroy = function () {
    $scope.modalDel.error = undefined;
    var index,
      id = $scope.modalDel.listData.id;
    Item.destroy({ id: id }, function () {
        angular.forEach($scope.items, function(v,i) {
          if (v.id == id) {
            index = i;
            return false;
          }
        });
        $scope.items.splice(index,1);
        $scope.modalDel.shown = false;
      }, function (r) {
        $scope.modalDel.error = r.data;
        console.log($scope.$id);
    });
  };

}]);

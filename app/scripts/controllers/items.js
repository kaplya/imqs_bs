'use strict';

imqsBsApp
  .factory('Item', ['$resource', function ($resource) {
	return $resource('/items/:id/:action');  	
  }])
  .controller('ItemsCtrl', ["$scope", 'Item', '$timeout', function($scope, Item, $timeout) {


    $scope.templates = {
      body: "views/items.html"
    };

    $scope.modalEdit = { shown: false };
    $scope.modalDel = { shown: false };
    $scope.spin = true;

    Item.query(function(data) {
      $scope.items = data;
      $scope.spin = false;
    });

    $scope.edit = function () {
      $scope.modalEdit.listData = this.i;
      $scope.modalEdit.spin     = true;
      $scope.modalEdit.d        = {};
      Item.get( { id: this.i.id }, function (data) {
        $scope.modalEdit.d = data;
        $scope.modalEdit.spin = false;
      });
      this.modalEdit.shown = true;
    };
    
    $scope.new = function () {
      this.modalEdit.d = {};
      this.modalEdit.shown = true;
    };

    $scope.createOrUpdate = function () {
      $scope.modalEdit.d.error = undefined;
      $scope.modalEdit.spin = true;
      
      var update = function () { 
        Item.update({ id: $scope.modalEdit.d.id }, $scope.modalEdit.d, function (data) {
          $scope.modalEdit.shown = false;
          angular.copy(data, $scope.modalEdit.listData);
          $scope.modalEdit.spin = false;
        }, function (r) {
          $scope.modalEdit.d.error = r.data;
          $scope.modalEdit.spin = false;
        });
      };

      var create = function () { 
        Item.create($scope.modalEdit.d, function (data) { 
          $scope.modalEdit.shown = false;
          $scope.items.unshift(data);
          $scope.modalEdit.spin = false;
        }, function (r) {
          $scope.modalEdit.d.error = r.data;
          $scope.modalEdit.spin = false;
        });
      };

      if ($scope.modalEdit.d.id) update(); 
      else create();

    };

    $scope.delete = function () {
      $scope.modalDel.error = undefined;
      this.modalDel.shown = true;
      this.modalDel.listData = this.i;
    };

    $scope.destroy = function () {
      $scope.modalDel.error = undefined;
      $scope.modalDel.spin = true;
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
          $scope.modalDel.spin = false;
        }, function (r) {
          $scope.modalDel.error = r.data;
          $scope.modalDel.spin = false;
      });
    };

  }]);

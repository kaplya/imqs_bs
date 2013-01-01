'use strict';

imqsBsApp
	.controller('CrudCtrl', ['$scope', 'Resource', function ($scope, Resource) {

    $scope.modalEdit = { shown: false };
  	$scope.modalDel = { shown: false };
    $scope.spin = true;

    Resource.query(function (data) {
      $scope.itemsList = data;
      $scope.spin = false;
    });

    $scope.edit = function () {
      $scope.modalEdit.data = {};
      $scope.modalEdit.listData = this.i;
      $scope.modalEdit.spin = true;

      Resource.get( { id: this.i.id }, function (data) {
        $scope.modalEdit.data = data;
        $scope.modalEdit.spin = false;
      });
    	this.modalEdit.shown = true;
    };
    
    $scope.new = function () {
  		this.modalEdit.data = {};
      this.modalEdit.shown = true;
    };

    $scope.createOrUpdate = function () {
      $scope.modalEdit.data.error = undefined;
      $scope.modalEdit.spin = true;
      var update = function () {
        Resource.update({ id: $scope.modalEdit.data.id }, $scope.modalEdit.data, function (data) {
          $scope.modalEdit.spin = false;
          $scope.modalEdit.shown = false;
          angular.copy(data, $scope.modalEdit.listData);
        })
      };
      var create = function () {
        Resource.create($scope.modalEdit.data, function (data) {
          $scope.modalEdit.shown = false;
          $scope.modalEdit.spin = false;
          $scope.itemsList.unshift(data);
        }, function (r) {
          $scope.modalEdit.data.error = r.data;
          $scope.modalEdit.spin = false;
        });
      };

      if ($scope.modalEdit.data.id) {
        update();
      } else {
        create();
      };
    };
    
    $scope.delete = function () {
      $scope.modalDel.error = undefined;
      this.modalDel.shown = true;
      $scope.modalDel.listData = this.i;
    };

    $scope.destroy = function () {
      $scope.modalDel.error = undefined;
      var id = $scope.modalDel.listData.id,
        index;
      Resource.destroy({ id: id }, function () {
        $scope.modalDel.shown = false;
        angular.forEach($scope.itemsList, function (v, i) {
          if (v.id != id) { return true; }
          index = i;
          return false;
        });
        $scope.itemsList.splice(index, 1);
      }, function (r) {
        $scope.modalDel.error = r.data;
      });
    }

	}]);
'use strict';

imqsBsApp
	.controller('CrudCtrl', ['$scope', 'Resource', function ($scope, Resource) {

    $scope.modalEdit = { shown: false };
  	$scope.modalDel = { shown: false };

  	Resource.query(function (data) {
      $scope.itemsList = data;
    });

    $scope.edit = function () {
      $scope.modalEdit.data = {};
      $scope.modalEdit.listData = this.i;
      Resource.get( { id: this.i.id }, function (data) {
        $scope.modalEdit.data = data;
      });
    	this.modalEdit.shown = true;
    };
    
    $scope.new = function () {
  		this.modalEdit.data = {};
      this.modalEdit.shown = true;
    };

    $scope.createOrUpdate = function () {
      $scope.modalEdit.data.error = undefined;
      var update = function () {
        Resource.update({ id: $scope.modalEdit.data.id }, $scope.modalEdit.data, function (data) {
          $scope.modalEdit.shown = false;
          angular.copy(data, $scope.modalEdit.listData);
        })
      };
      var create = function () {
        Resource.create($scope.modalEdit.data, function (data) {
          $scope.modalEdit.shown = false;
          $scope.itemsList.unshift(data);
        }, function (r) {
          $scope.modalEdit.data.error = r.data;
        });
      };

      if ($scope.modalEdit.data.id) {
        update();
      } else {
        create();
      };
    };
    
    $scope.delete = function () {
    	this.modalDel.shown = true;
      $scope.modalDel.listData = this.i;
    };

    $scope.destroy = function () {
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
      });
    }

	}]);
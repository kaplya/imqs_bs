'use strict';

imqsBsApp
	.controller('CrudCtrl', ['$scope', 'Resource', function ($scope, Resource) {

  	$scope.modalEdit = { shown: false };

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
  		this.modal.shown = true;
    };

    $scope.createOrUpdate = function () {
      var update = function () {
        Resource.update({ id: $scope.modalEdit.data.id }, $scope.modalEdit.data, function (data) {
          $scope.modalEdit.shown = false;
          angular.copy(data, $scope.modalEdit.listData);
        })
      };
      if ($scope.modalEdit.data.id) {
        update();
      }
    };
    
    $scope.delete = function () {
    	this.modal.del = true;
    };

	}]);
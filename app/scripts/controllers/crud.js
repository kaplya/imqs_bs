'use strict';

imqsBsApp
	.controller('CrudCtrl', ['$scope', 'Resource', function ($scope, Resource) {

  	$scope.modalEdit = { shown: false };

  	Resource.query(function (data) {
      $scope.itemsList = data;
    });

    $scope.edit = function () {
      $scope.modalEdit.data = {};
      Resource.get( { id: this.i.id }, function (data) {
        $scope.modalEdit.data = data;
      });
    	this.modalEdit.shown = true;
    };
    
    $scope.new = function () {
  		this.modal.shown = true;
    };
    
    $scope.delete = function () {
    	this.modal.del = true;
    };

	}]);
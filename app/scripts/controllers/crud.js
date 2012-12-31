'use strict';

imqsBsApp
	.controller('CrudCtrl', ['$scope', 'Resource', function ($scope, Resource) {

		$scope.modal = { shown: false, del: false };

		Resource.query(function (data) {
      $scope.locations = data;
    });

    $scope.edit = function () {
	  	this.modal.shown = true;
    };
    
    $scope.new = function () {
  		this.modal.shown = true;
    };
    
    $scope.delete = function () {
    	this.modal.del = true;
    };

	}]);
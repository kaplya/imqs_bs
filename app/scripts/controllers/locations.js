'use strict';

imqsBsApp.controller('LocationsCtrl', ["$scope", function($scope) {
  $scope.templates = {
  	body: "views/locations.html"
  };
  // $scope.templates.sb = "'views/locations_sb.html'";
  
  $scope.modal = { shown: false, del: false };
  $scope.locations = [
  	{ name: "West Store", city: "Tokyo"},
  	{ name: "Europe Store", city: "Paris"}
  ];
  
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

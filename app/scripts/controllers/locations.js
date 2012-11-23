'use strict';

imqsBsApp.controller('LocationsCtrl', function($scope) {
  $scope.templates = {};
  $scope.templates.body = "views/locations.html";
  // $scope.templates.sb = "'views/locations_sb.html'";
  $scope.locations = [
  	{ name: "West Store", city: "Tokyo"},
  	{ name: "Europe Store", city: "Paris"}
  ];
});

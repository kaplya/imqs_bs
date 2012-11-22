'use strict';

imqsBsApp.controller('ItemsCtrl', function($scope) {
  $scope.templates = {};
  $scope.templates.body = "views/items.html";

  $scope.items = [
	{name: "Beer", code: "02700"},
	{name: "Juice", brand: "J7"},
	{name: "Tea"}
  ];

});

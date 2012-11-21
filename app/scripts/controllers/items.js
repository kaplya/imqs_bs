'use strict';

imqsBsApp.controller('ItemsCtrl', function($scope) {
  $scope.templates = {};
  $scope.templates.body = "views/items.html";

  $scope.items = [
	{name: "Beer"},
	{name: "Juice"},
	{name: "Tea"}
  ];

});

'use strict';

imqsBsApp
  .factory('Location', ['$resource', function ($resource) {
    return $resource('/locations/:id/:action');
  }])
  .controller('LocationsCtrl', ["$scope", 'Location', 'Crud', function($scope, Location, Crud) {
    $scope.templates = {
    	body: "views/locations.html"
    };
    // $scope.templates.sb = "'views/locations_sb.html'";

    Crud.init($scope, Location);

  }]);
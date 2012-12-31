'use strict';

imqsBsApp
  .factory('Location', ['$resource', function ($resource) {
    return $resource('/locations/:id/:action');
  }])
  .controller('LocationsCtrl', ["$scope", 'Location', '$controller', function($scope, Location, $controller) {
    $scope.templates = {
    	body: "views/locations.html"
    };
    // $scope.templates.sb = "'views/locations_sb.html'";

    $controller('CrudCtrl', { $scope: $scope, Resource: Location });

  }]);
'use strict';

imqsBsApp
  .factory('Location', ['$resource', function ($resource) {
    return $resource('/locations/:id/:action');
  }])
  .controller('PromoCtrl', ["$scope", 'Location', 'Crud', function($scope, Location, Crud) {

    Crud($scope, Location, { modelName: 'l', modelsListName: 'locations'});

  }]);
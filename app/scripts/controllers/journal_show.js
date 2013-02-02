'use strict';

imqsBsApp
	.factory('Line', ['$resource', function ($resource) {
		return $resource('/lines/:id');
	}])
	.controller('JournalShowCtrl', ['$scope', '$route', 'Journal', 'Crud', '$location', function($scope, $route, Journal, Crud, $location) {
	  
		$scope.templates = {
		  // sb: 'views/journal_show.html',
		  body: 'views/journal_show.html'
		};

	  var id = $route.current.params.id;

	  Crud($scope, Journal, {
	  	modelName: 'j',
	  	initRequest: 'item',
	  	initRequestParams: { id: id }
	  });

	  $scope.$on('afterSuccessDestroy', function (e, args) {
	  	if (args.modelName != 'j') { return }
	  	$location.path('/journals');
	  });

	  $scope.LinesCtrl = ['$scope', 'Line', 'Crud', '$controller', function ($scope, Line, Crud, $controller) {
		  Crud($scope, Line,
		  	{
		  		modelName: 'l',
		  		modelsListName: 'lines',
		  		initRequestParams: { journal_id: id },
		  		modes: { 
		  			new: 'NewOrEditLine', 
		  			edit: 'NewOrEditLine'
		  		}
		  	}
		  );
		  $controller('InitCtrl', { $scope: $scope });
	  }];

	}]);

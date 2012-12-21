angular.module('ui')
	.directive('error', [function () {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, iElm, iAttr, ctrl) {
				var errorAttr = iAttr.ngModel.split('.');
				errorAttr.splice(-1,0, iAttr.error || 'error');
				errorAttr = errorAttr.join('.');
				scope.$watch(errorAttr, function (newValue) {
					if(newValue == "" || newValue == undefined || newValue == null) {
						ctrl.$setValidity('error', true);
					} else {
						ctrl.$setValidity('error', false);
					}
				});
			}
		};
	}]);
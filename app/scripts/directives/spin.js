angular.module('ui')
	.directive('spin', [function () {
		return {
			restrict: 'A',
			link: function (scope, iElm, iAttr, ctrl) {
				var spinner = new Spinner();
				scope.$watch(iAttr.spin, function (newValue) {
					if (newValue == true || newValue == 'true') {
						spinner.spin();
						iElm.append(spinner.el);
					}
					else {
						spinner.stop();
					}
				});
			}
		};
	}]);
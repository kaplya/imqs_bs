angular.module('ui')
	.directive('spin', [function () {
		return {
			restrict: 'A',
			require: '?modal',
			link: function (scope, iElm, iAttr, ctrl) {
				var opts = {
				  lines: 13, // The number of lines to draw
				  length: 7, // The length of each line
				  width: 4, // The line thickness
				  radius: 10, // The radius of the inner circle
				  corners: 1, // Corner roundness (0..1)
				  rotate: 0, // The rotation offset
				  color: '#000', // #rgb or #rrggbb
				  speed: 1, // Rounds per second
				  trail: 60, // Afterglow percentage
				  shadow: false, // Whether to render a shadow
				  hwaccel: false, // Whether to use hardware acceleration
				  className: 'spinner', // The CSS class to assign to the spinner
				  zIndex: 1060, // The z-index (defaults to 2000000000)
				  top: 'auto', // Top position relative to parent in px
				  left: 'auto' // Left position relative to parent in px
				};
				var spinner = new Spinner(opts);
				scope.$watch(iAttr.spin, function (newValue) {
					if (newValue == true || newValue == 'true') {
						spinner.spin(iElm[0]);
						iElm.find('input, select, button, textarea').attr('disabled', 'disabled');
						if(ctrl) {
							ctrl.disableClickAndEscapeClose(true);
						}
					}
					else {
						spinner.stop();
						iElm.find('input, select, button, textarea').attr('disabled', null);
						if(ctrl) {
							ctrl.disableClickAndEscapeClose(false);
						}

					}
				});
			}
		};
	}]);
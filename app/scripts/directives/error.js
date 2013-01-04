angular.module('ui')
	.directive('error', [function () {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, iElm, iAttr, ctrl) {
				var errorSpan;
				var errorAttr = iAttr.ngModel.split('.');
				errorAttr.splice(-1, 0, iAttr.error || 'error');
				errorAttr = errorAttr.join('.');
				scope.$watch(errorAttr, function (newValue, oldValue) {
					if(newValue == "" || newValue == undefined || newValue == null) {
						if (!errorSpan) return;
						var g = iElm.parents('.control-group');
						g.removeClass('error');
						ctrl.$setValidity('error', true);
						errorSpan.remove();
					} else {
						errorSpan = angular.element('<span class="help-inline"></span>');
						errorSpan.text(angular.isArray(newValue) ? newValue.join('; ') : newValue);
						if(iElm.parent('.input-append').length) {
							iElm.parent('.input-append').after(errorSpan);
						} else {
							iElm.after(errorSpan);
						}
						var g = iElm.parents('.control-group');
						g.addClass('error');
						ctrl.$setValidity('error', false);
					}
				});
			}
		};
	}]);
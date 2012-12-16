'use strict';

describe('button', function () {

	var scope, $sandbox, $compile, $timeout;

	beforeEach(module('ui'));

	beforeEach(inject(function ($injector, $rootScope, _$compile_, _$timeout_) {
		scope = $rootScope;
		$compile = _$compile_;
		$timeout = _$timeout_;

		$sandbox = $('<div id="sandbox"></div>').appendTo($('body'));
		scope.model = {};
	}));

	afterEach(function() {
		$sandbox.remove();
		scope.$destroy();
	});

	var templates = {
		'default': 				'<div class="btn" ng-model="buttonValue" data-toggle="button" button>',
		'withMethod': 			'<button class="btn" ng-model="buttonValue" button="click()"></button>',
		'withMethodAndText': 	'<button class="btn" ng-model="buttonValue" data-toggle="button" button="click()" undefined-text="Loading...">' +
								'Show' +
								'</button>'
	};

	function compileDirective(template) {
		template = template ? templates[template] : templates['default'];
		template = $(template).appendTo($sandbox);
		return $compile(template)(scope);
	};

	// Tests
	describe('without method', function () {

		it('should remove "data-toggle" attr for you', function () {
			var elm = compileDirective();
			expect(elm.attr('data-toggle')).toBeUndefined();
		});

		describe('model change to view', function () {

			it('should add class', function () {
				var elm = compileDirective();
				scope.$apply(function () {
					scope.buttonValue = true;
				});
				expect(elm.hasClass('active')).toBe(true);
			});

			it('should remove class', function () {
				var elm = compileDirective();
				scope.$apply(function () {
					scope.buttonValue = false;
				});
				expect(elm.hasClass('active')).toBe(false);
			});

			it('should not be disabled', function () {
				var elm = compileDirective();
				expect(elm.is(":disabled")).toBe(false);
				
				scope.$apply(function () {
					scope.buttonValue = true;
				});
				expect(elm.is(":disabled")).toBe(false);

				scope.$apply(function () {
					scope.buttonValue = undefined;
				});
				expect(elm.is(":disabled")).toBe(false);
				
				scope.$apply(function () {
					scope.buttonValue = true;
				});
				expect(elm.is(":disabled")).toBe(false);
			});

		});

		describe('view change to model', function () {

			it('should set model true on click', function () {
				var elm = compileDirective();
				expect(scope.buttonValue).toBeUndefined();
				elm.trigger('click');
				expect(scope.buttonValue).toBe(true);
			});

			it('should set model false on double-click', function () {
				var elm = compileDirective();
				expect(scope.buttonValue).toBeUndefined();
				elm.trigger('click');
				elm.trigger('click');
				expect(scope.buttonValue).toBe(false);
			});
		});
	});

	describe('with method', function () {

		it('should execute method', function() {
			var elm = compileDirective('withMethod');
			var ex = false;
			scope.click = function () {
				ex = true;
			};
			elm.trigger('click');
			expect(ex).toBe(true);
		});

		it('should not set model to true on click', function () {
			var elm = compileDirective('withMethod');
			expect(scope.buttonValue).toBeUndefined();
			elm.trigger('click');
			expect(scope.buttonValue).toBeUndefined();
		});

		describe('model change to view', function () {
			it('should add class', function () {
				var elm = compileDirective('withMethod');
				scope.$apply(function () {
					scope.buttonValue = true;
				});
				expect(elm.hasClass('active')).toBe(true);
			});

			it('should remove class', function () {
				var elm = compileDirective('withMethod');
				scope.$apply(function () {
					scope.buttonValue = false;
				});
				expect(elm.hasClass('active')).toBe(false);
			});

			it('should disable', function () {
				var elm = compileDirective('withMethod');
				expect(scope.buttonValue).toBeUndefined();
				expect(elm.is(":disabled")).toBe(true);
				
				scope.$apply(function () {
					scope.buttonValue = true;
				});			
				expect(elm.is(":disabled")).toBe(false);

				scope.$apply(function () {
					scope.buttonValue = false;
				});
				expect(elm.is(":disabled")).toBe(false);

				scope.$apply(function () {
					scope.buttonValue = undefined;
				});
				expect(elm.is(":disabled")).toBe(true);
			});
		});

	});

	describe('with method and undefined-text', function () {

		it('should show undefinded-text if undefined', function () {
			var elm = compileDirective('withMethodAndText');
			expect(scope.buttonValue).toBeUndefined();
			expect(elm.text()).toBe('Loading...');
			
			scope.$apply(function () {
				scope.buttonValue = true;
			});		
			scope.$apply(function () {
				scope.buttonValue = undefined;
			});
			expect(elm.text()).toBe('Loading...');

			scope.$apply(function () {
				scope.buttonValue = false;
			});		
			scope.$apply(function () {
				scope.buttonValue = undefined;
			});
			expect(elm.text()).toBe('Loading...');
		});

		it('should show element text if value is true of false', function () {
			var elm = compileDirective('withMethodAndText');
			expect(scope.buttonValue).toBeUndefined();
			
			scope.$apply(function () {
				scope.buttonValue = true;
			});
			expect(elm.text()).toBe("Show");

			scope.$apply(function () {
				scope.buttonValue = undefined;
			});
			scope.$apply(function () {
				scope.buttonValue = false;
			});
			expect(elm.text()).toBe("Show");

		});

	});

});
'use strict';

ddescribe('msg', function () {
	
	var scope,
		sandbox,
		templates,
		$compile;
	
	templates = {
		default: "<form name='myForm'><input ng-model='foo' error></form>"
	};

	beforeEach(module('ui'));

	beforeEach(inject(function($rootScope, _$compile_) {
		$compile = _$compile_; 
		sandbox = $('<div id="sandbox"></div>').appendTo($('body'));
		scope = $rootScope.$new();
	}));

	afterEach(function () {
		sandbox.remove();
		scope.$destroy();
	});

	function compile(template) {
		template = template ? templates[template] || template : templates['default'];
		$(template).appendTo(sandbox);
		return $compile(template)(scope);
	};

	it('should supprot custom error name attr', function () {
		
		var elm = compile("<form name='myForm'><input ng-model='foo' error='myError'></form>");
		expect(scope.myForm.$invalid).toBeFalsy();
		
		scope.$apply(function (s) {
			s.myError = { foo: 'bar' };
		});
		expect(scope.myForm.$invalid).toBeTruthy();

	});

	it('should change form state', function () {
		var elm = compile();		
		expect(scope.myForm.$invalid).toBeFalsy();
		
		scope.$apply(function (s) {
			s.error = { foo: 'bar' };
		});
		expect(scope.myForm.$invalid).toBeTruthy();

		scope.$apply(function (s) {
			s.error = { foo: '' };
		});
		expect(scope.myForm.$invalid).toBeFalsy();

	});



});
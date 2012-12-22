'use strict';

describe('msg', function () {
	
	var scope,
		sandbox,
		templates,
		$compile;
	
	templates = {
		default: "<form name='myForm'><input ng-model='foo' error></form>",
		group: '<form name="myForm">' +
				'<div class="control-group">' +
						'<input ng-model="foo" error>' +
				'</div>' +
			'</form>'
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

	it('should support custom error name attr', function () {
		
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

	it('should add and remove error class on control group', function () {
		var elm = compile('group');
		expect(elm.find('div').hasClass('error')).toBeFalsy();
		
		scope.$apply(function (s) {
			s.error = { foo: 'bar' };
		});
		expect(elm.find('div').hasClass('error')).toBeTruthy();
		
		scope.$apply(function (s) {
			s.error = { foo: '' };
		});
		expect(elm.find('div').hasClass('error')).toBeFalsy();

	});

	it('should add and remove span with a error', function () {
		var elm = compile();
		
		expect(elm.find('input').next('span')[0]).toBeUndefined();
		scope.$apply(function (s) {
			s.error = { foo: ['bar 1', 'bar 2'] };
		});
		expect(elm.find('input').next('span')[0]).toBeDefined();
		expect(elm.find('input').next('span').text()).toEqual('bar 1; bar 2');

		scope.$apply(function (s) {
			s.error = { foo: '' };
		});
		expect(elm.find('input').next('span')[0]).toBeUndefined();

	});


});
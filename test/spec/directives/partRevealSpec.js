'use strict';

describe('part and reveal', function () {

	beforeEach(module('ui'));

	var scope,
		partElm,
		revealElm,
		$compile;

	beforeEach(inject(function (_$compile_, $rootScope) {
		$compile = _$compile_;
		scope = $rootScope.$new();
	}));

	function compile(tmpl) {
		return $compile(tmpl)(scope);
	};

	describe('(common)', function () {

		it('should run controller', function () {
			var tmpl = '' +
				'<div part="form" is="modal" part-controller="Ctrl">' +
					'MODAL' +
				'</div>' +
				'<div reveal on="state">' +
					'MAIN' +
				'</div>';
			compile(tmpl);

			var check = false;
			scope.Ctrl = function () {
				check = true;
			};
			scope.$apply('state="form"');
			expect(check).toBeTruthy();
		});

		it('should destoy part if reveal destoyed', function () {
			var tmpl = '' +
				'<div part="form" is="modal">' +
					'MODAL' +
				'</div>' +
				'<div id="reveal" reveal on="state">' +
					'MAIN' +
				'</div>';

			var elm = compile(angular.element(tmpl).appendTo('body'));
			
			scope.$apply('state="form"');
			var r = angular.element('#reveal');
			expect(r.parent().length).toBe(1);
			r.remove();
			expect(r.parent().length).toBe(0);
		});

		it('should work even reveal was described first', function () {
			var tmpl = '' +
				'<div reveal on="state">' +
					'MAIN' +
				'</div>' +
				'<div part="form" is="modal" part-controller="Ctrl">' +
					'MODAL' +
				'</div>';
			compile(tmpl);
			var check = false;
			scope.Ctrl = function () {
				check = true;
			};
			scope.$apply('state="form"');
			expect(check).toBeTruthy();
		});

	it('should not leak jq data when compiled but not attached to parent when parent is destroyed',
      inject(function($rootScope, $compile) {
	    	var element = $compile(
	      '<div ng-repeat="i in []">' +
	        '<reveal on="url">' +
	          '<div part="a" is="row">{{name}}</div>' +
	        '</reveal>' +
	      '</div>')($rootScope);
	    $rootScope.$apply();

    // element now contains only empty repeater. this element is dealocated by local afterEach.
    // afterwards a global afterEach will check for leaks in jq data cache object
  }));

	});

	describe('(modal)', function () {
	
		beforeEach(function () {
			var partTmpl = '' +
				'<div part="form" is="modal">' +
					'MODAL' +
				'</div>';
			var revealTmpl = '' +
				'<div reveal on="state">' +
					'MAIN' +
				'</div>';

			partElm = compile(angular.element(partTmpl).appendTo('body'));

			revealTmpl = angular.element(revealTmpl);
			revealTmpl.appendTo(angular.element('<div id="reveal">').appendTo('body'));
			revealElm = compile(revealTmpl);
		});

		it('should append and remove part to body', function () {
			scope.$apply('state="form"');
			var l = angular.element('body>div').last();
			expect(l.text()).toBe('MODAL');
			scope.$apply('state=""');
			l = angular.element('body>div').last();
			expect(l.text()).toBe('MAIN');
		});

		it('should not hide reveal element', function () {
			scope.$apply('state="form"');
			expect(revealElm.css('display')).not.toBe('none');
		});

	});

	describe('(row)', function () {
		
		beforeEach(function () {
			var partTmpl = '' +
				'<div part="form" is="row">' +
					'ROW' +
				'</div>';
			var revealTmpl = '' +
				'<div reveal on="state">' +
					'MAIN' +
				'</div>';

			partElm = compile(angular.element(partTmpl).appendTo('body'));

			revealTmpl = angular.element(revealTmpl);
			revealTmpl.appendTo(angular.element('<div id="reveal">').appendTo('body'));
			revealElm = compile(revealTmpl);
		});

		it('should insert part after reveal element and remove it', function () {
			scope.$apply('state="form"');
			expect(revealElm.next().text()).toBe('ROW');
			scope.$apply('state=""');
			expect(revealElm.next().length).toBe(0);
		});

		it('should hide reveal element', function () {
			scope.$apply('state="form"');
			expect(revealElm.css('display')).toBe('none');
		});

	});

})
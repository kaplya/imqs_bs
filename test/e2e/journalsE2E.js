'use strict'

describe('journals', function () {
	var ITEMS = '[ng-repeat$="journals"]',
		NEW_BTN = 'button:contains("New")',
		FORM = 'div[part="NewOrEdit"]',
		CANCEL_BTN = 'button:contains("Cancel")',
		SUBMIT_BTN = 'input[type="submit"]';

	beforeEach(function () {
		browser().navigateTo('/#/journals');
	});

	it('should render items when user navigate to /journals', function () {
		expect(element('h1:first').text()).toMatch(/Journals/);
	});

	it('should have two journals', function () {
		expect(repeater(ITEMS).count()).toBe(2);
	});

	describe('(new and create)', function () {

		it('should open and close form', function () {
			element(NEW_BTN).click();
			expect(element(FORM).css('display')).toEqual('block');
			using(FORM).element(CANCEL_BTN).click();
			expect(element(FORM).count()).toBe(0);
		});

		it('should show empty form', function () {
			element(NEW_BTN).click();
			using(FORM).input('j.number').enter('Foo');
			using(FORM).element(CANCEL_BTN).click();
			element(NEW_BTN).click();
			expect(using(FORM).input('j.number').val()).toEqual('');
		});

		it('should show submitted data in the list', function () {
			element(NEW_BTN).click();
			using(FORM).input('j.number').enter('Foo');
			using(FORM).input('j.date').enter('01.01.2013');
			using(FORM).select('j.j_type').option('Supply');
			using(FORM).element(SUBMIT_BTN).click();
			browser().navigateTo('#/journals');
			expect(repeater(ITEMS).count()).toBe(3);
			expect(repeater(ITEMS).row(0)).toEqual(['Foo', '01.01.2013', 'Supply']);
		});

	})

});
'use strict'

describe('journals', function () {
	var ITEMS = '[ng-repeat$="journals"]',
		NEW_BTN = 'button:contains("New")',
		FORM = '[modal*="journalModal"]',
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
			expect(element(FORM).css('display')).toEqual('none');
			element(NEW_BTN).click();
			expect(element(FORM).css('display')).toEqual('block');
			using(FORM).element(CANCEL_BTN).click();
			expect(element(FORM).css('display')).toEqual('none');
		});

		it('should show empty form', function () {
			element(NEW_BTN).click();
			using(FORM).input('journalModal.data.number').enter('Foo');
			using(FORM).element(CANCEL_BTN).click();
			element(NEW_BTN).click();
			expect(using(FORM).input('journalModal.data.number').val()).toEqual('');
		});

		it('should show submitted data in the list', function () {
			element(NEW_BTN).click();
			using(FORM).input('journalModal.data.number').enter('Foo');
			using(FORM).input('journalModal.data.date').enter('01.01.2013');
			using(FORM).select('journalModal.data.j_type').option('Supply');
			using(FORM).element(SUBMIT_BTN).click();
			browser().navigateTo('#/journals');
			expect(repeater(ITEMS).count()).toBe(3);
			expect(repeater(ITEMS).row(0)).toEqual(['Foo', '01.01.2013', 'Supply']);
		});

	})

});
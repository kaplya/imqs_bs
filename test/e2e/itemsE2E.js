'use strict'

describe('items', function() {

  var FORM = "div[modal='modal.shown']",
    EDIT_BTN = "button:contains('Edit')",
    ITEMS = 'tr[ng-repeat="i in items"]';

  beforeEach(function() {
    browser().navigateTo('/#/items');
  });

  it('should render items when user navigates to /items', function() {
    expect(element('h1:first').text()).toMatch(/Items/);
  });

  it('should have three items', function () {
  	expect(repeater('tr[ng-repeat="i in items"]').count()).toEqual(3);
  });

  it('should show filled edit form', function () {

    expect(element(FORM).css("display")).toEqual("none");
    
    using('tbody tr:nth-child(2)').element(EDIT_BTN).click();
    expect(element(FORM).css("display")).toEqual("block");
    expect(input('modal.d.name').val()).toEqual("Tea");

    using('tbody tr:nth-child(3)').element(EDIT_BTN).click();
    expect(element(FORM).css("display")).toEqual("block");
    expect(input('modal.d.name').val()).toEqual("Juice");

    using('tbody tr:nth-child(4)').element(EDIT_BTN).click();
		expect(element(FORM).css("display")).toEqual("block");
    expect(input('modal.d.name').val()).toEqual("Beer");
    
  });

  it('should submit data', function () {
    
    using('tbody tr:nth-child(2)').element('button[ng-click="edit()"]').click();
    using(FORM).input('modal.d.code').enter("For submit code");
    using(FORM).input('modal.d.name').enter("For submit name");
    using(FORM).input('modal.d.brand').enter("For submit brand");
    using(FORM).element('input[type="submit"]').click();
    expect(element(FORM).css("display")).toEqual("none");
    expect(repeater(ITEMS).row(0)).toEqual(["For submit code", "For submit name", "For submit brand"]);

    using('tbody tr:nth-child(3)').element('button[ng-click="edit()"]').click();
    using(FORM).input('modal.d.code').enter("For submit code");
    using(FORM).input('modal.d.name').enter("For submit name");
    using(FORM).input('modal.d.brand').enter("For submit brand");
    using(FORM).element('input[type="submit"]').click();
    expect(element(FORM).css("display")).toEqual("none");
    expect(repeater(ITEMS).row(1)).toEqual(["For submit code", "For submit name", "For submit brand"]);

    using('tbody tr:nth-child(4)').element('button[ng-click="edit()"]').click();
    using(FORM).input('modal.d.code').enter("For submit code");
    using(FORM).input('modal.d.name').enter("For submit name");
    using(FORM).input('modal.d.brand').enter("For submit brand");
    using(FORM).element('input[type="submit"]').click();
    expect(element(FORM).css("display")).toEqual("none");
    expect(repeater(ITEMS).row(2)).toEqual(["For submit code", "For submit name", "For submit brand"]);

  });

});
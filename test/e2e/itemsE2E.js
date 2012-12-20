'use strict'

describe('items', function() {

  var NEW_BTN = "button:contains('New')",
    EDIT_BTN = "button:contains('Edit')",
    SUBMIT_BTN = "input[type='submit']",
    FORM = "div[modal='modal.shown']",
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

  it('should submit edited data', function () {

    using('tbody tr:nth-child(2)').element(EDIT_BTN).click();
    using(FORM).input('modal.d.code').enter("For submit code");
    using(FORM).input('modal.d.name').enter("For submit name");
    using(FORM).input('modal.d.brand').enter("For submit brand");
    using(FORM).element(SUBMIT_BTN).click();
    expect(element(FORM).css("display")).toEqual("none");
    expect(repeater(ITEMS).row(0)).toEqual(["For submit code", "For submit name", "For submit brand"]);

    using('tbody tr:nth-child(3)').element(EDIT_BTN).click();
    using(FORM).input('modal.d.code').enter("For submit code");
    using(FORM).input('modal.d.name').enter("For submit name");
    using(FORM).input('modal.d.brand').enter("For submit brand");
    using(FORM).element(SUBMIT_BTN).click();
    expect(element(FORM).css("display")).toEqual("none");
    expect(repeater(ITEMS).row(1)).toEqual(["For submit code", "For submit name", "For submit brand"]);

    using('tbody tr:nth-child(4)').element(EDIT_BTN).click();
    using(FORM).input('modal.d.code').enter("For submit code");
    using(FORM).input('modal.d.name').enter("For submit name");
    using(FORM).input('modal.d.brand').enter("For submit brand");
    using(FORM).element(SUBMIT_BTN).click();
    expect(element(FORM).css("display")).toEqual("none");
    expect(repeater(ITEMS).row(2)).toEqual(["For submit code", "For submit name", "For submit brand"]);

  });

  it('should show empty new form', function () {

    input('modal.d.code').enter("Foo");
    element(NEW_BTN).click();
    expect(element(FORM).css("display")).toEqual("block");
    expect(input('modal.d.code').val()).toEqual("");

  });

  it('should submit new data', function () {

    element(NEW_BTN).click();
    using(FORM).input('modal.d.code').enter("For submit code");
    using(FORM).input('modal.d.name').enter("For submit name");
    using(FORM).input('modal.d.brand').enter("For submit brand");
    using(FORM).element(SUBMIT_BTN).click();
    expect(element(FORM).css("display")).toEqual("none");
    expect(repeater(ITEMS).row(0)).toEqual(["For submit code", "For submit name", "For submit brand"]);
  
  });

  it('should edit submited data', function () {

    element(NEW_BTN).click();
    using(FORM).input('modal.d.name').enter("For submit name");
    using(FORM).element(SUBMIT_BTN).click();
    using('tbody tr:nth-child(2)').element(EDIT_BTN).click();
    expect(using(FORM).input('modal.d.name').val()).toEqual("For submit name");
  
  });

});
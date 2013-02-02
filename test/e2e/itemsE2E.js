'use strict'

describe('items', function() {

  var NEW_BTN = "button:contains('New')",
    EDIT_BTN = "button:contains('Edit')",
    SUBMIT_BTN = "input[type='submit']",
    FORM = "div.modal",
    DEL_FORM = 'div.modal',
    ITEMS = 'tr[ng-repeat="i in items"]',
    ROW = 'tbody tr:nth-child(?)',
    DEL_BTN = 'button:contains("Delete")',
    CANCEL_BTN = 'button:contains("Cancel")',
    YES_BTN = 'button:contains("Yes")';

  beforeEach(function() {
    browser().navigateTo('/#/items');
  });

  it('should render items when user navigates to /items', function() {
    expect(element('h1:first').text()).toMatch(/Items/);
  });

  it('should have three items', function () {
  	expect(repeater(ITEMS).count()).toEqual(3);
  });

  it('should show filled edit form', function () {
    
    using(ROW.replace('?', 2)).element(EDIT_BTN).click();
    expect(element(FORM).css("display")).toEqual("block");
    expect(input('i.name').val()).toEqual("Tea");
    using(FORM).element(CANCEL_BTN).click();

    using(ROW.replace('?', 3)).element(EDIT_BTN).click();
    expect(element(FORM).css("display")).toEqual("block");
    expect(input('i.name').val()).toEqual("Juice");
    using(FORM).element(CANCEL_BTN).click();

    using(ROW.replace('?', 4)).element(EDIT_BTN).click();
    expect(element(FORM).css("display")).toEqual("block");
    expect(input('i.name').val()).toEqual("Beer");
    using(FORM).element(CANCEL_BTN).click();
    
  });

  it('should submit edited data', function () {
    for (var i=0; i<=2; i++) {
      using(ROW.replace('?', i+2)).element(EDIT_BTN).click();
      using(FORM).input('i.code').enter("For submit code");
      using(FORM).input('i.name').enter("For submit name");
      using(FORM).input('i.brand').enter("For submit brand");
      using(FORM).element(SUBMIT_BTN).click();
      expect(repeater(ITEMS).row(i)).toEqual(["For submit code", "For submit name", "For submit brand"]);
    }
  });

  it('should show empty new form', function () {
    element(NEW_BTN).click();
    input('i.code').enter("Foo");
    using(FORM).element(SUBMIT_BTN).click();
    element(NEW_BTN).click();
    expect(input('i.code').val()).toEqual("");
  });

  it('should submit new data', function () {
    element(NEW_BTN).click();
    using(FORM).input('i.code').enter("For submit code");
    using(FORM).input('i.name').enter("For submit name");
    using(FORM).input('i.brand').enter("For submit brand");
    using(FORM).element(SUBMIT_BTN).click();
    expect(repeater(ITEMS).row(0)).toEqual(["For submit code", "For submit name", "For submit brand"]);
  });

  it('should edit submitted data', function () {
    element(NEW_BTN).click();
    using(FORM).input('i.name').enter("For submit name");
    using(FORM).element(SUBMIT_BTN).click();
    using(ROW.replace('?', 2)).element(EDIT_BTN).click();
    expect(using(FORM).input('i.name').val()).toEqual("For submit name");  
  });

  it('should show delete form', function () {
    using(ROW.replace('?', 2)).element(DEL_BTN).click();
    expect(element(DEL_FORM).css("display")).toEqual("block");
  });

  it('should delete', function () {    
    using(ROW.replace('?', 3)).element(DEL_BTN).click();
    using(DEL_FORM).element(YES_BTN).click();
    expect(repeater(ITEMS).count()).toEqual(2);
    expect(repeater(ITEMS).row(0)).toEqual(["", "Tea", ""]);
    expect(repeater(ITEMS).row(1)).toEqual(["02700", "Beer", ""]);
  });

  it('should show errors edit form', function () {
    function test() {      
      input('i.name').enter('eRRoR_832232');
      element(SUBMIT_BTN).click();
      expect(element(FORM).css("display")).toEqual("block");
      var s = ['error test 1', 'error test 2'].join('; ');
      expect(using(FORM).element('span:contains("?")'.replace('?', s)).text()).toEqual(s);
      s = 'error test 3';
      expect(using(FORM).element('span:contains("?")'.replace('?', s)).text()).toEqual(s);
      s = 'error test 4';
      expect(using(FORM).element('span:contains("?")'.replace('?', s)).text()).toEqual(s);
      s = 'error test 5';
      expect(using(FORM).element('span:contains("?")'.replace('?', s)).text()).toEqual(s);
    }
    element(NEW_BTN).click();
    test();
    
    using(ROW.replace('?', 2)).element(EDIT_BTN).click();
    test();
  });

  it('should show error for del form', function () {
    using(ROW.replace('?', 4)).element(DEL_BTN).click();
    using(DEL_FORM).element(YES_BTN).click();
    expect(element(DEL_FORM).css('display')).toEqual('block');
    var s = ['error test 1', 'error test 2'].join('; ');
    expect(using(DEL_FORM).element('span:contains("?")'.replace('?', s)).text()).toEqual(s);
  });

});
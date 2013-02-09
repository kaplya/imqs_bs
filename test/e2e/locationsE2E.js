'use strict'

describe('locations', function () {
	var ITEMS = 'tr[ng-repeat="l in locations"]',
		FORM = 'tr[part="NewOrEdit"]',
		ROW = 'tbody tr:nth-child(?)',
    EDIT_BTN = 'button:contains("Edit")',
		CANCEL_BTN = 'button:contains("Cancel")',
		SUBMIT_BTN = 'button[type="submit"]',
		NEW_BTN = 'button:contains("Add new line")',
		DEL_BTN = 'button:contains("Delete")',
		YES_BTN = 'button:contains("Yes")',
		DEL_FORM = 'tr[part="Del"]',
		ERROR = 'span:contains("?")';
	
	beforeEach(function () {
		browser().navigateTo('/#/locations');
	});

	it('should render items when user navigates to /items', function () {
		expect(element('h1:first').text()).toMatch(/Locations/);
	});

	it('should have two locations', function () {
		expect(repeater(ITEMS).count()).toEqual(2);
	});
  
  it('should show filled edit form', function () {
    
    using(ROW.replace('?', 3)).element(EDIT_BTN).click();
    expect(input('l.name').val()).toEqual('Europe Store');
    expect(input('l.city').val()).toEqual('Paris');
    using(ROW.replace('?', 4)).element(CANCEL_BTN).click();

    using(ROW.replace('?', 4)).element(EDIT_BTN).click();
    expect(input('l.name').val()).toEqual('West Store');
    expect(input('l.city').val()).toEqual('Tokyo');
  });

  it('should submit edited data', function () {
    for (var i=0; i<=1; i++) {
      using(ROW.replace('?', i+3)).element(EDIT_BTN).click();
      using(FORM).input('l.name').enter('TEST name');
      using(FORM).input('l.city').enter('TEST city');
      using(FORM).element(SUBMIT_BTN).click();
      expect(repeater(ITEMS).row(i)).toEqual(['TEST name', 'TEST city']);
  	}
  });

  it('should show empty new form', function () {
    element(NEW_BTN).click();
    input('l.name').enter('Bar');
    element(CANCEL_BTN).click();
    element(NEW_BTN).click();
  	expect(input('l.name').val()).toEqual('');
  });

  it('should submit new data', function () {
  	element(NEW_BTN).click();
  	using(FORM).input('l.name').enter('New name');
  	using(FORM).input('l.city').enter('New city');
  	using(FORM).element(SUBMIT_BTN).click();
  	expect(repeater(ITEMS).row(0)).toEqual(['New name', 'New city']);
  });

  it('should show submitted data for editing', function () {
  	element(NEW_BTN).click();
  	using(FORM).input('l.name').enter('name');
  	using(FORM).element(SUBMIT_BTN).click();
  	using(ROW.replace('?', 3)).element(EDIT_BTN).click();
  	expect(using(FORM).input('l.name').val()).toEqual('name');
  });

  it('should show delete form', function () {
  	using(ROW.replace('?', 3)).element(DEL_BTN).click();
  	expect(element(DEL_FORM).css('display')).toEqual('table-row');
  });

  it('should delete', function () {
  	using(ROW.replace('?', 3)).element(DEL_BTN).click();
  	using(DEL_FORM).element(YES_BTN).click();
  	expect(repeater(ITEMS).row(0)).toEqual(['West Store', 'Tokyo']);
  });

  it('should show errors in edit form wnen create', function () {
  	element(NEW_BTN).click();
  	using(FORM).input('l.name').enter('eRRoR');
  	using(FORM).element(SUBMIT_BTN).click();
  	var s = ['error test 1', 'error test 2'].join('; ');
  	expect(using(FORM).element(ERROR.replace('?', s)).count()).toBe(1);

  	s = ['error test 3'].join('; ');
  	expect(using(FORM).element(ERROR.replace('?', s)).count()).toBe(1);

  	s = ['error test 4'].join('; ');
  	expect(using(FORM).element(ERROR.replace('?', s)).count()).toBe(1);
  });

  it('should show errors in edit from when update', function () {
    using(ROW.replace('?', 3)).element(EDIT_BTN).click();
    using(FORM).input('l.name').enter('eRRoR');
    using(FORM).element(SUBMIT_BTN).click();
    expect(using(FORM).element(ERROR.replace('?','error test')).count()).toEqual(1);
  });

  it('should show error for del form', function () {
    using(ROW.replace('?', 4)).element(DEL_BTN).click();
    using(DEL_FORM).element(YES_BTN).click();
    expect(element(DEL_FORM).css('display')).toEqual('table-row');
    var s = ['error test 1', 'error test 2'].join('; ');
    expect(using(DEL_FORM).element(ERROR.replace('?', s)).count()).toBe(1);
  });

});
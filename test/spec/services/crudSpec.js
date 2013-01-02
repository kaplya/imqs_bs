'use strict';

describe('Service: Crud', function () {

  // load the service's module
  beforeEach(module('imqsBsApp'));

  // instantiate service
  var crud, $httpBackend, scope, resource;
  beforeEach(inject(function(_Crud_, _$httpBackend_, $rootScope, $resource) {
    resource = $resource('/items/:id/:action');
    crud = _Crud_;
    scope = $rootScope;
    $httpBackend = _$httpBackend_;
    
    $httpBackend.expect('GET', '/items').respond([{foo: 'Bar'}]);
    crud.init(scope, resource);
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should query data', function () {
      expect(scope.itemsList).toBeUndefined();
      $httpBackend.flush();
      expect(scope.itemsList.length).toBe(1);
  });

  it('should manage loading items spin', function () {
    expect(scope.spin).toBeTruthy();
    $httpBackend.flush();
    expect(scope.spin).toBeFalsy();
  });

  describe('edit item', function () {

    it('should get data and show form when open edit modal form', function () {
      expect(scope.modalEdit.shown).toBeFalsy();
      $httpBackend.expect('GET', '/items/1').respond({ id: 1 });
      
      scope.edit.call({ i: { id: 1 } });
      expect(scope.modalEdit.data).toEqual({});    

      $httpBackend.flush();
      expect(scope.modalEdit.shown).toBeTruthy();
      expect(scope.modalEdit.data.id).toBe(1);
    });

    it('should manage spin when open form', function () {
      $httpBackend.expect('GET', '/items/1').respond({ id: 1 });
      scope.edit.call({ i: { id: 1 } });
      expect(scope.modalEdit.spin).toBeTruthy();
      $httpBackend.flush();
      expect(scope.modalEdit.spin).toBeFalsy();
    });
  
    it('should submit edited data and close form', function () {

      expect(scope.modalEdit.shown).toBeFalsy();

      $httpBackend.expect('PUT', '/items/1').respond({ id: 1, foo: 'Bar' });
      scope.modalEdit.data = { id: 1, error: 'test' };
      scope.modalEdit.listData = {};
      scope.createOrUpdate();
      expect(scope.modalEdit.data.error).toBeUndefined();
      $httpBackend.flush();
      expect(scope.modalEdit.shown).toBeFalsy();
      expect(scope.modalEdit.listData.foo).toEqual('Bar');
    });

    it('should manage spin while submitting', function () {
      $httpBackend.expect('PUT', '/items/1').respond({ id: 1, foo: 'Bar' });
      scope.modalEdit.data = { id: 1, error: 'test' };
      scope.createOrUpdate();
      expect(scope.modalEdit.spin).toBeTruthy();
      $httpBackend.flush();
      expect(scope.modalEdit.spin).toBeFalsy();
    });

    it('should fill errors', function () {
      $httpBackend.when('PUT', '/items/1').respond(400, { foo: 'Bar' });
      scope.modalEdit.data = { id: 1 };
      scope.createOrUpdate();
      $httpBackend.flush();
      expect(scope.modalEdit.data.error.foo).toEqual('Bar');
    });

    it('in case of errors should stop spinning and keep form opend', function () {
      $httpBackend.when('PUT', '/items/1').respond(400, { foo: 'Bar' });
      scope.modalEdit.shown = true;
      scope.modalEdit.data = { id: 1 };
      scope.createOrUpdate();
      expect(scope.modalEdit.spin).toBeTruthy();
      $httpBackend.flush();
      expect(scope.modalEdit.spin).toBeFalsy();
      expect(scope.modalEdit.shown).toBeTruthy();
    });

  });

  describe('new item', function () {

    it('should clear data and show new form', function () {
      $httpBackend.flush();
      scope.modalEdit.data = { foo: 'Bar' };
      scope.new();
      expect(scope.modalEdit.data).toEqual({});
      expect(scope.modalEdit.shown).toBeTruthy();
    });

    it('should submit new data and hide form', function () {
      $httpBackend.expect('POST', '/items').respond();
      scope.modalEdit.data = { foo: 'Bar' };
      scope.itemsList = [];
      scope.createOrUpdate();
      $httpBackend.flush();
      expect(scope.itemsList[1].foo).toBe('Bar');
    });

    it('should manage spin while submitting new data', function () {
      $httpBackend.expect('POST', '/items').respond();
      scope.modalEdit.data = { foo: 'Bar' };
      scope.itemsList = [];
      scope.createOrUpdate();
      expect(scope.modalEdit.spin).toBeTruthy();
      $httpBackend.flush();
      expect(scope.modalEdit.spin).toBeFalsy();
    });

    it('should show error', function () {
      $httpBackend.when('POST', '/items').respond(400, { foo: 'Bar' });
      scope.modalEdit.data = {};
      scope.createOrUpdate();
      $httpBackend.flush();
      expect(scope.modalEdit.data.error.foo).toEqual('Bar');
    });

    it('should keep form opend and stop spinning if errors occur', function () {
      $httpBackend.when('POST', '/items').respond(400, { foo: 'Bar' });
      scope.modalEdit.shown = true;
      scope.modalEdit.data = {};
      scope.createOrUpdate();
      expect(scope.modalEdit.spin).toBeTruthy();
      $httpBackend.flush();
      expect(scope.modalEdit.spin).toBeFalsy();
      expect(scope.modalEdit.shown).toBeTruthy();
    });

  });

  describe('delete item', function () {

    it('should clear errors and show del form', function () {
      $httpBackend.flush();
      scope.modalDel = { error: {foo: 'Bar'} };
      expect(scope.modalDel.shown).toBeFalsy();
      scope.delete.call( { i: { id: 1 } } );
      expect(scope.modalDel.listData.id).toBe(1);
      expect(scope.modalDel.error).toBeUndefined();
      expect(scope.modalDel.shown).toBeTruthy();
    });

    it('should delete item and hide form', function () {
      $httpBackend.flush();
      scope.modalDel.listData = { id: 1 };
      expect(scope.itemsList.length).toBe(1);
      
      $httpBackend.expect('DELETE', '/items/1').respond();
      scope.modalDel.shown = true;
      scope.destroy();
      $httpBackend.flush();
      expect(scope.modalDel.shown).toBeFalsy();
      expect(scope.itemsList.length).toBe(0);
    });
    
    it('should manage errors', function () {
      $httpBackend.when('DELETE', '/items/1').respond(400, { foo: 'Bar' });
      scope.modalDel.listData = { id: 1 };
      scope.destroy();
      $httpBackend.flush();
      expect(scope.modalDel.error.foo).toEqual('Bar');
    });

    it('should keep form opened and stop spinning if errors occur', function () {
      $httpBackend.when('DELETE', '/items/1').respond(400, { foo: 'Bar' });
      scope.modalDel.shown = true;
      scope.modalDel.listData = { id: 1 };
      scope.destroy();
      expect(scope.modalDel.spin).toBeTruthy();
      $httpBackend.flush();
      expect(scope.modalDel.spin).toBeFalsy();
      expect(scope.modalDel.shown).toBeTruthy();
    });
  });

});
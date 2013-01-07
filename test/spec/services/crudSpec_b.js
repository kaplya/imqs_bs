'use strict';

describe('Service: Crud B', function () {

  beforeEach(module('imqsBsApp'));

  var crud, $httpBackend, scope, resource, callbacks;
  beforeEach(inject(function(_CrudB_,  _$httpBackend_, $rootScope, $resource) {
    resource = $resource('/items/:id/:action');
    crud = _CrudB_;
    scope = $rootScope;
    $httpBackend = _$httpBackend_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    // $httpBackend.verifyNoOutstandingRequest();
  });

  describe('init list', function () {
    
    beforeEach(function () {
      $httpBackend.expect('GET', '/items').respond([{ id: 1 }]);
      crud(scope, resource);
    });

    it('should load list', function () {
      expect(scope.modelsList).toBeUndefined();
      $httpBackend.flush();
      expect(scope.modelsList[0].id).toEqual(1);
    });

    it('should manage isBusy attr', function () {
      expect(scope.isBusy).toBeTruthy();
      $httpBackend.flush();
      expect(scope.isBusy).toBeFalsy();
    });

  });

  describe('init item', function () {
    
    beforeEach(function () {
      $httpBackend.expect('GET', '/items/1').respond({ id: 1 });
      crud(scope, resource, {
        initRequest: 'item',
        initRequestParams: { id: 1 }
      });
    });

    it('should load item', function () {
      expect(scope.model).toBeUndefined();
      $httpBackend.flush();
      expect(scope.model.id).toBe(1);
    });

    it('should manage isBusy attr', function () {
      expect(scope.isBusy).toBeTruthy();
      $httpBackend.flush();
      expect(scope.isBusy).toBeFalsy();
    });    

  });

  describe('new', function () {
    
    var fScope;
    beforeEach(function () {
      $httpBackend.when('GET', '/items').respond([{ id: 1 }]);
      crud(scope, resource);
      fScope = scope.$new();
      scope.FormCtrl(fScope);
    });

    it('should open form', function () {
      expect(fScope.isShown).toBeFalsy();
      scope.new();
      expect(fScope.isShown).toBeTruthy();      
    });

    it('should init model', function () {
      fScope.model = { foo: 'Bar' };
      scope.new();
      expect(fScope.model).toEqual({});
    });

    it('should empty errors', function () {
      fScope.errors = { foo: 'Bar' };
      scope.new();
      expect(fScope.errors).toBeUndefined();
    });

  });

  describe('create', function () {
    
    var fScope, callbacks;
    beforeEach(function () {
      $httpBackend.when('GET', '/items').respond([{ id: 1 }]);
      callbacks = crud(scope, resource);
      fScope = scope.$new();
      scope.FormCtrl(fScope);
      fScope.isShown = true;
      fScope.model = { foo: 'Bar' };
    });

    it('should clean errors', function () {
      $httpBackend.when('POST', '/items').respond();
      fScope.errors = {};
      fScope.createOrUpdate();
      expect(fScope.errors).toBeUndefined();
    });

    it('should manage isBusy', function () {
      $httpBackend.when('POST', '/items').respond();
      fScope.createOrUpdate();
      expect(fScope.isBusy).toBeTruthy();
      $httpBackend.flush();
      expect(fScope.isBusy).toBeFalsy();
    });

    it('should post data', function () {
      $httpBackend.expect('POST', '/items', fScope.model).respond();
      fScope.createOrUpdate();
    });

    it('should unshift data to modelsList', function () {
      var v = { id: 2 };
      $httpBackend.when('POST', '/items').respond(200, v);
      fScope.createOrUpdate();
      $httpBackend.flush();
      expect(scope.modelsList[0].id).toBe(2);
    });

    it('should close form', function () {
      $httpBackend.when('POST', '/items').respond();
      fScope.createOrUpdate();
      $httpBackend.flush();
      expect(fScope.isShown).toBeFalsy();
    });

    it('should fill errors', function () {
      var e = { foo: 'Bar' };
      $httpBackend.when('POST', '/items').respond(400, e);
      fScope.createOrUpdate();
      $httpBackend.flush();
      expect(fScope.errors).toBe(e);
    });

    it('should manage isBusy if errors', function () {
      $httpBackend.when('POST', '/items').respond(400);
      fScope.createOrUpdate();
      expect(fScope.isBusy).toBeTruthy();
      $httpBackend.flush();
      expect(fScope.isBusy).toBeFalsy();
    });

    it('should not close form if error', function () {
      $httpBackend.when('POST', '/items').respond(400);
      fScope.createOrUpdate();
      $httpBackend.flush();
      expect(fScope.isShown).toBeTruthy();
    });

    it('should call afterCreate callback', function () {
      $httpBackend.when('POST', '/items').respond();
      var r = false;
      callbacks.afterCreate = function () {
        r = true;
      };
      fScope.createOrUpdate();
      $httpBackend.flush();
      expect(r).toBeTruthy();
    });

    it('should call afterCreate with created model', function () {
      var m = { foo: 'Bar' };
      $httpBackend.when('POST', '/items').respond(200, m);
      var mm;
      callbacks.afterCreate = function (d) {
        mm = d;
      };
      fScope.createOrUpdate();
      $httpBackend.flush();
      expect(m.foo).toBe(mm.foo);
    });

  });

  describe('edit', function () {
    
    var fScope, callbacks;
    beforeEach(function () {
      $httpBackend.when('GET', '/items').respond([{ id: 1 }]);
      $httpBackend.when('GET', '/items/1').respond({ id: 1 });
      callbacks = crud(scope, resource);
      fScope = scope.$new();
      scope.FormCtrl(fScope);
    });

    it('should open form', function () {
      expect(fScope.isShown).toBeFalsy();
      scope.edit.call( { model: {id: 1} } );
      expect(fScope.isShown).toBeTruthy();
    });

    it('should empty errors', function () {
      fScope.errors = { foo: 'Bar' };
      scope.edit.call( { model: {id: 1} } );
      expect(fScope.errors).toBeUndefined();
    });

    it('should put reference into model from modelList', function () {
      var l = [{ id: 1 }];
      scope.modelList = l;
      scope.edit.call({ model: l[0] });
      expect(scope.model).toBe(l[0]);
    });

    it('should load data', function () {
      $httpBackend.expect('GET', '/items/2').respond({ id: 2, foo: 'Bar 2' });
      
      scope.edit.call({ model: { id: 2, foo: 'Bar 1' } });
      expect(fScope.model.foo).toEqual('Bar 1');
      
      $httpBackend.flush();
      expect(fScope.model.foo).toEqual('Bar 2');
    });

    it('should manage isBusy attr', function () {
      expect(fScope.isBusy).toBeFalsy();
      scope.edit.call({ model: { id: 1 } });
      expect(fScope.isBusy).toBeTruthy();
      $httpBackend.flush();
      expect(fScope.isBusy).toBeFalsy();
    });

    it('should call beforeEdit callback', function () {
      var t = false;
      var s = { model: { id: 1 } };
      callbacks.beforeEdit = function () {
        t = true;
      };
      scope.edit.call(s);
      expect(t).toBeTruthy();
    });

    it('should call beforeEdit with local scope', function () {
      var s = { model: { id: 1 } },
        ls;
      callbacks.beforeEdit = function (s) {
        ls = s;
      };
      scope.edit.call(s);
      expect(ls).toBe(s);
    });

    it('should do nothing is beforeEdit return false', function () {
      var s = { model: { id: 3 } };
      callbacks.beforeEdit = function () {
        return false;
      };
      scope.edit.call(s);
      expect(fScope.isBusy).toBeFalsy();
      expect(fScope.isShown).toBeFalsy();
    });

  });

  describe('update', function () {
    var fScope;

    beforeEach(function () {
      $httpBackend.when('GET','/items').respond([{ id: 1 }]);
      crud(scope, resource);
      fScope = scope.$new();
      scope.FormCtrl(fScope);
      fScope.isShown = true;
      scope.model = { id: 1, foo: 'Bar' };
      fScope.model = { id: 1, foo: 'Bar' };
    });

    it('should clean errors', function () {
      $httpBackend.when('PUT', '/items/1').respond();
      fScope.errors = {};
      fScope.createOrUpdate();
      expect(fScope.errors).toBeUndefined();
    });

    it('should manage isBusy', function () {
      $httpBackend.when('PUT', '/items/1').respond();
      fScope.createOrUpdate();
      expect(fScope.isBusy).toBeTruthy();
      $httpBackend.flush();
      expect(fScope.isBusy).toBeFalsy();
    });

    it('should put data', function () {
      $httpBackend.expect('PUT', '/items/1', fScope.model).respond();
      fScope.createOrUpdate();
    });

    it('should update initial data', function () {
      var r = { id: 1, foo: 'Bar 2'};
      $httpBackend.when('PUT', '/items/1').respond(200, r);
      fScope.createOrUpdate();
      $httpBackend.flush();
      expect(scope.model.foo).toBe('Bar 2');
    });

    it('should close form', function () {
      $httpBackend.when('PUT', '/items/1').respond();
      fScope.createOrUpdate();
      $httpBackend.flush();
      expect(fScope.isShown).toBeFalsy();
    });

    it('should fill errors', function () {
      var e = { foo: 'Bar' };
      $httpBackend.when('PUT', '/items/1').respond(400, e);
      fScope.createOrUpdate();
      $httpBackend.flush();
      expect(fScope.errors).toBe(e);
    });

    it('should manage isBusy if errors', function () {
      $httpBackend.when('PUT', '/items/1').respond(400);
      fScope.createOrUpdate();
      expect(fScope.isBusy).toBeTruthy();
      $httpBackend.flush();
      expect(fScope.isBusy).toBeFalsy();
    });

    it('should not close form if error', function () {
      $httpBackend.when('PUT', '/items/1').respond(400);
      fScope.createOrUpdate();
      expect(fScope.isShown).toBeTruthy();
      $httpBackend.flush();
      expect(fScope.isShown).toBeTruthy();
    });
 
  });

  describe('delete', function () {
    
    var fScope;
    beforeEach(function () {
      $httpBackend.when('GET', '/items').respond([{ id: 1 }]);
      crud(scope, resource);
      fScope = scope.$new();
      scope.DelFormCtrl(fScope);
    });

    it('should open form', function () {
      fScope.isShown = false;
      scope.delete();
      expect(fScope.isShown).toBeTruthy();
    });

    it('should empty errors', function () {
      fScope.errors = { foo: 'Bar' };
      scope.delete();
      expect(fScope.errors).toBeUndefined();
    });

    it('should put reference of deleting item into form scope', function () {
      var i = { model: { foo: 'Bar' } };
      scope.delete.call(i);
      expect(fScope.model).toBe(i.model);
    });

  });

  describe('destroy', function () {
    var fScope,
      callbacks;
    beforeEach(function () {
      $httpBackend.when('GET', '/items').respond([{ id: 1}, { id: 2}]);
      callbacks = crud(scope, resource);
      $httpBackend.flush();
      fScope = scope.$new();
      scope.FormCtrl(fScope);
      fScope.isShown = true;
      fScope.model = scope.modelsList[0];
      // scope.model = scope.modelsList[0];
    });

    it('should empty errors', function () {
      fScope.errors = 'test';
      $httpBackend.when('DELETE').respond();
      fScope.destroy();
      expect(fScope.errors).toBeUndefined();
    });

    it('should manage isBusy', function () {
      $httpBackend.when('DELETE').respond();
      fScope.destroy();
      expect(fScope.isBusy).toBeTruthy();
      $httpBackend.flush();
      expect(fScope.isBusy).toBeFalsy();
    });

    it('should destroy data', function () {
      fScope.model = { id: 5 };
      $httpBackend.expect('DELETE', '/items/5').respond();
      fScope.destroy();      
    });

    it('should close form', function () {
      $httpBackend.when('DELETE').respond();
      fScope.destroy();
      $httpBackend.flush();
      expect(fScope.isShown).toBeFalsy();      
    });

    it('should remove model from the list', function () {
      $httpBackend.when('DELETE').respond();
      fScope.destroy();
      $httpBackend.flush();
      expect(scope.modelsList[0].id).toBe(2);
    });

    it('should fill errors', function () {
      var e = { foo: 'Bar' };
      $httpBackend.when('DELETE').respond(400, e);
      fScope.destroy();
      $httpBackend.flush();
      expect(fScope.errors).toBe(e);
    });

    it('should manage isBusy if errors', function () {
      $httpBackend.when('DELETE').respond(400);
      fScope.destroy();
      $httpBackend.flush();
      expect(fScope.isBusy).toBeFalsy();
    });

    it('should not close the form if errors', function () {
      $httpBackend.when('DELETE').respond(400);
      fScope.destroy();
      $httpBackend.flush();
      expect(fScope.isShown).toBeTruthy();
    });

    it('should call afterDestroy callback', function () {
      $httpBackend.when('DELETE').respond(200);
      var t = false;
      callbacks.afterDestroy = function () {
        t = true;
      };
      fScope.destroy();
      $httpBackend.flush();
      expect(t).toBeTruthy();
    });

  });

});
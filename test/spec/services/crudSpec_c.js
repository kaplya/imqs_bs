'use strict';

describe('Service: Crud', function () {

  beforeEach(module('imqsBsApp'));

  var crud, $httpBackend, $controller, scope, resource;
  beforeEach(inject(function(_CrudC_,  _$httpBackend_, $rootScope, $resource, _$controller_) {
    resource = $resource('/items/:id/:action');
    crud = _CrudC_;
    scope = $rootScope;
    $httpBackend = _$httpBackend_;
    $controller = _$controller_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    // $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('init list', function () {
    
    beforeEach(function () {
      $httpBackend.expect('GET', '/items').respond([{ id: 1 }]);
      crud(scope, resource);
      $controller('InitCtrl', { $scope: scope });
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

    it('should open new form', function () {
      scope.new();
      expect(scope.mode).toBe('NewOrEdit');
    });

  });

  describe('init item', function () {
    
    beforeEach(function () {
      $httpBackend.expect('GET', '/items/1').respond({ id: 1 });
      crud(scope, resource, {
        initRequest: 'item',
        initRequestParams: { id: 1 }
      });
      $controller('InitCtrl', { $scope: scope });
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
  
  describe('NewEditFormCtrl', function () {

    var fScope;
    beforeEach(function () {
      $httpBackend.when('GET', '/items').respond([{ id: 1 }]);
      $httpBackend.when('GET', '/items/1').respond({ id: 1 });
      crud(scope, resource);
      scope.model = { id: 1 };
      fScope = scope.$new();
    });
    
    it('should not load data if model is not present', function () {
      scope.model = undefined;
      $controller('NewOrEditFormCtrl', { $scope: fScope });
    });

    it('should init model if null or undefined', function () {
      scope.model = null;
      $controller('NewOrEditFormCtrl', { $scope: fScope });
      expect(fScope.model).toEqual({});
    });

    it('should empty errors', function () {
      fScope.errors = { foo: 'Bar' };
      $controller('NewOrEditFormCtrl', { $scope: fScope });
      expect(fScope.errors).toBeUndefined();
    });
    
    it('should load data', function () {
      $httpBackend.expect('GET', '/items/2').respond({ id: 2, foo: 'Bar 2' });
      scope.model = { id: 2, foo: 'Bar 1'};
      $controller('NewOrEditFormCtrl', { $scope: fScope });
      expect(fScope.model.foo).toEqual('Bar 1');
      
      $httpBackend.flush();
      expect(fScope.model.foo).toEqual('Bar 2');
    });

    it('should manage isBusy attr', function () {
      $controller('NewOrEditFormCtrl', { $scope: fScope });
      expect(fScope.isBusy).toBeTruthy();
      $httpBackend.flush();
      expect(fScope.isBusy).toBeFalsy();
    });

    it('should close the form', function () {
      $controller('NewOrEditFormCtrl', { $scope: fScope });
      fScope.cancel();
      expect(fScope.$parent.mode).toBeNull();
    });

    describe('create', function () {
      
      var fScope;
      beforeEach(function () {
        $httpBackend.when('GET', '/items').respond([{ id: 1 }]);
        crud(scope, resource);
        fScope = scope.$new();
        $controller('InitCtrl', { $scope: scope });
        $controller('NewOrEditFormCtrl', { $scope: fScope });
        scope.new();
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
        expect(fScope.$parent.mode).toBeNull();
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
        expect(scope.mode).not.toBeNull();
      });

      it('should call afterCreate event', function () {
        $httpBackend.when('POST', '/items').respond({ id: 100 });
        var r = false,
          id;
        scope.$on('afterSuccessCreation', function (e, args) {
          r = true;
          id = args.id;
        });
        fScope.createOrUpdate();
        $httpBackend.flush();
        expect(r).toBeTruthy();
        expect(id).toBe(100);
      });

    });

    describe('update', function () {
      var fScope;

      beforeEach(function () {
        $httpBackend.when('GET','/items').respond([{ id: 1 }]);
        crud(scope, resource);
        fScope = scope.$new();
        $controller('NewOrEditFormCtrl', { $scope: fScope });
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
        var r = { id: 1, foo: 'Bar New'};
        $httpBackend.when('PUT', '/items/1').respond(200, r);
        fScope.createOrUpdate();
        $httpBackend.flush();
        expect(scope.model.foo).toBe('Bar New');
      });

      it('should close form', function () {
        $httpBackend.when('PUT', '/items/1').respond();
        fScope.createOrUpdate();
        $httpBackend.flush();
      });

      it('should set mode to empty', function () {
        scope.mode = 'Foo';
        $httpBackend.when('PUT', '/items/1').respond();
        fScope.createOrUpdate();
        $httpBackend.flush();
        expect(scope.mode).toBeNull();
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
        expect(scope.mode).not.toBeNull();
        $httpBackend.flush();
        expect(scope.mode).not.toBeNull();
      });
   
    });

  });

  describe('ShowFormCtrl', function () {
    
    var fScope;
    beforeEach(function () {
      $httpBackend.when('GET', '/items').respond([{ id: 1 }]);
      crud(scope, resource);
      fScope = scope.$new();
      $controller('ShowFormCtrl', { $scope: fScope });
    });

    it('should set mode to NewOrEdit on edit()', function () {
      fScope.edit();
      expect(fScope.mode).toBe('NewOrEdit');
    });

    it('should set mode to Del on delete()', function () {
      fScope.delete();
      expect(fScope.mode).toBe('Del');
    });

    it('should empty errors', function () {
      fScope.errors = { foo: 'Bar' };
      fScope.delete();
      expect(fScope.errors).toBeUndefined();
    });

    it('should call beforeEdit event', function () {
      var t = false;
      scope.$on('beforeEdit', function () {
        t = true;
      });
      fScope.edit();
      expect(t).toBeTruthy();
    });

  });

  describe('DelFormCtrl', function () {
    var fScope;
    beforeEach(function () {
      $httpBackend.when('GET', '/items').respond([{ id: 1 }]);
      crud(scope, resource);
      fScope = scope.$new();
      $controller('DelFormCtrl', { $scope: fScope });
    });

    it('should set mode null if cancel', function () {
      fScope.cancel();
      expect(scope.mode).toBeNull();
    });

    describe('destroy', function () {
    
      var fScope;
    
      beforeEach(function () {
        crud(scope, resource);
        scope.model = { id: 1 };
        fScope = scope.$new();
        $controller('DelFormCtrl', { $scope: fScope });
      });

      it('should empty errors', function () {
        fScope.errors = 'test';
        $httpBackend.when('DELETE').respond();
        fScope.destroy();
        expect(fScope.errors).toBeUndefined();
      });

      xit('should manage isBusy', function () {
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

      xit('should change mode to null', function () {
        $httpBackend.when('DELETE').respond();
        fScope.destroy();
        $httpBackend.flush();
        expect(scope.mode).toBeNull();      
      });

      xit('should remove model from the list', function () {
        $httpBackend.when('DELETE').respond();
        fScope.destroy();
        $httpBackend.flush();
        expect(scope.modelsList[0].id).toBe(2);
      });

      xit('should fill errors', function () {
        var e = { foo: 'Bar' };
        $httpBackend.when('DELETE').respond(400, e);
        fScope.destroy();
        $httpBackend.flush();
        expect(fScope.errors).toBe(e);
      });

      xit('should manage isBusy if errors', function () {
        $httpBackend.when('DELETE').respond(400);
        fScope.destroy();
        $httpBackend.flush();
        expect(fScope.isBusy).toBeFalsy();
      });

      xit('should not close the form if errors', function () {
        $httpBackend.when('DELETE').respond(400);
        fScope.destroy();
        $httpBackend.flush();
        // expect(fScope.isShown).toBeTruthy();
      });

      it('should call afterDestroy event', function () {
        $httpBackend.when('DELETE').respond(200);
        var t = false;
        scope.$on('afterSuccessDestroy', function () {
          t = true;
        });
        fScope.destroy();
        $httpBackend.flush();
        expect(t).toBeTruthy();
      });

    });

  });

});
/// <reference path="../Test.ts" />

module Coveo {
  describe('SearchAlerts', function () {
    let test: Mock.IBasicComponentSetup<SearchAlerts>;

    beforeEach(() => {
      test = Mock.basicComponentSetup<SearchAlerts>(SearchAlerts);
    });
    
    afterEach(()=>{
      test = null;
    })

    it('should be able to send message if the option is set', () => {
      expect(test.cmp.message).toBeDefined();
    });
    
    it('should not be able to send message if the option is not set', ()=>{
      test = Mock.advancedComponentSetup<SearchAlerts>(SearchAlerts, new Mock.AdvancedComponentSetupOptions(null, {enableMessage: false}));
      expect(test.cmp.message).toBeUndefined();
    })
    
    it('should add the manage alert option in the settings menu', ()=>{
      let data: ISettingsPopulateMenuArgs = {
        settings: Mock.basicComponentSetup<Settings>(Settings).cmp,
        menuData: []
      }
      
      $$(test.env.root).trigger(SettingsEvents.settingsPopulateMenu, data);
      
      expect(data.menuData).toContain(jasmine.objectContaining({className: "coveo-subscriptions-panel"}))
    })
    
    it('should not add the manage alert option in the settings menu if the option is false', ()=>{
      let data: ISettingsPopulateMenuArgs = {
        settings: Mock.basicComponentSetup<Settings>(Settings).cmp,
        menuData: []
      }
      test = Mock.advancedComponentSetup<SearchAlerts>(SearchAlerts, new Mock.AdvancedComponentSetupOptions(null, {enableManagePanel: false}));
      $$(test.env.root).trigger(SettingsEvents.settingsPopulateMenu, data);
      
      expect(data.menuData).not.toContain(jasmine.objectContaining({className: "coveo-subscriptions-panel"}))
    })
    
    it('should add the follow query option in the settings menu after the first query success', (done)=>{
      let data: ISettingsPopulateMenuArgs = {
        settings: Mock.basicComponentSetup<Settings>(Settings).cmp,
        menuData: []
      }
      
      let promise = Promise.resolve();
      spyOn(test.env.queryController, 'getEndpoint').and.returnValue({listSubscriptions: ()=>{return promise}});
      
      Simulate.query(test.env);
      
      Promise.resolve().then(()=>{
        $$(test.env.root).trigger(SettingsEvents.settingsPopulateMenu, data);
        expect(data.menuData).toContain(jasmine.objectContaining({className: "coveo-follow-query"}))
        done();
      })
    })
    
    it('should not add the follow query option in the settings menu after the first query success if the option is false', (done)=>{
      let data: ISettingsPopulateMenuArgs = {
        settings: Mock.basicComponentSetup<Settings>(Settings).cmp,
        menuData: []
      }
      test = Mock.advancedComponentSetup<SearchAlerts>(SearchAlerts, new Mock.AdvancedComponentSetupOptions(null, {enableFollowQuery: false}));
      let promise = Promise.resolve();
      spyOn(test.env.queryController, 'getEndpoint').and.returnValue({listSubscriptions: ()=>{return promise}});
      
      Simulate.query(test.env);
      
      Promise.resolve().then(()=>{
        $$(test.env.root).trigger(SettingsEvents.settingsPopulateMenu, data);
        expect(data.menuData).not.toContain(jasmine.objectContaining({className: "coveo-follow-query"}))
        done();
      })
    })
    
    describe('open panel', ()=>{
      
      let listSubscriptionsMock: jasmine.Spy;
      
      beforeEach(()=>{
        listSubscriptionsMock = jasmine.createSpy('listSubscriptions')
        listSubscriptionsMock.and.returnValue(Promise.resolve([]));
        spyOn(test.cmp.queryController, 'getEndpoint').and.returnValue({listSubscriptions: listSubscriptionsMock});
        
        Coveo.ModalBox = jasmine.createSpyObj('ModalBox', ['open']);
      })
      
      afterEach(()=>{
        listSubscriptionsMock = null;
      })
      
      it('should open a modal box', (done)=>{
        test.cmp.openPanel().then(()=>{
          expect(Coveo.ModalBox.open).toHaveBeenCalledWith(jasmine.anything(), jasmine.objectContaining({className: 'coveo-subscriptions-panel'}));
          done();
        });
      });
      
      it('should show an error message if there was an error', (done)=>{
        listSubscriptionsMock.and.returnValue(Promise.reject({}));
        test.cmp.openPanel().then(()=>{
          expect($$((<jasmine.Spy>Coveo.ModalBox.open).calls.argsFor(0)[0]).find('.coveo-subscriptions-panel-content')).toBeNull();
          expect($$((<jasmine.Spy>Coveo.ModalBox.open).calls.argsFor(0)[0]).find('.coveo-subscriptions-panel-fail')).toBeDefined();
          done();
        });
      })
      
      it('should list the subscriptions', (done)=>{
        test.cmp.openPanel().then(()=>{
          expect($$((<jasmine.Spy>Coveo.ModalBox.open).calls.argsFor(0)[0]).find('.coveo-subscriptions-panel-content')).toBeDefined();
          expect($$((<jasmine.Spy>Coveo.ModalBox.open).calls.argsFor(0)[0]).find('.coveo-subscriptions-panel-fail')).toBeNull();
          done();
        });
      })
      
    })
    
    describe('follow query', ()=>{
      
      let followMock: jasmine.Spy;
      
      beforeEach(()=>{
        (<jasmine.Spy>test.cmp.queryController.createQueryBuilder).and.returnValue(new QueryBuilder());
        followMock = jasmine.createSpy('follow')
        followMock.and.returnValue(Promise.resolve({}));
        spyOn(test.cmp.queryController, 'getEndpoint').and.returnValue({follow: followMock});
      })
      
      afterEach(()=>{
        followMock = null;
      })
      
      it('should call the endpoint', ()=>{
        test.cmp.followQuery();
        expect(followMock).toHaveBeenCalled();
      })
      
      it('should trigger a search alert created event', (done)=>{
        $$(test.env.root).on(SearchAlertEvents.searchAlertCreated, ()=>{
          expect(true).toBe(true);
          done();
        });
        test.cmp.followQuery();
      })
      
      it('should trigger a search alert failed event if there was a problem', (done)=>{
        followMock.and.returnValue(Promise.resolve());
        $$(test.env.root).on(SearchAlertEvents.SearchAlertsFail, ()=>{
          expect(true).toBe(true);
          done();
        });
        test.cmp.followQuery();
      })
      
      
    })

  });
};
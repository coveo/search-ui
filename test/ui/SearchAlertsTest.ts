import * as Mock from '../MockEnvironment';
import {SearchAlerts} from '../../src/ui/SearchAlerts/SearchAlerts';
import {ISettingsPopulateMenuArgs} from '../../src/ui/Settings/Settings';
import {Settings} from '../../src/ui/Settings/Settings';
import {ISearchAlertsOptions} from '../../src/ui/SearchAlerts/SearchAlerts';
import {$$} from '../../src/utils/Dom';
import {SettingsEvents} from '../../src/events/SettingsEvents';
import {Simulate} from '../Simulate';
import {QueryBuilder} from '../../src/ui/Base/QueryBuilder';
import {SearchAlertsEvents, ISearchAlertsPopulateMessageEventArgs} from '../../src/events/SearchAlertEvents';

export function SearchAlertsTest() {
  describe('SearchAlerts', function () {
    let test: Mock.IBasicComponentSetup<SearchAlerts>;
    let settingsData: ISettingsPopulateMenuArgs;

    beforeEach(() => {
      test = Mock.basicComponentSetup<SearchAlerts>(SearchAlerts);
      settingsData = {
        settings: Mock.basicComponentSetup<Settings>(Settings).cmp,
        menuData: []
      };
    });

    afterEach(() => {
      test = null;
      settingsData = null;
    });

    describe('exposes enableMessage option', () => {
      it('should be able to send message', () => {
        expect(test.cmp.message).toBeDefined();
      });

      it('should not be able to send message if false', () => {
        test = Mock.optionsComponentSetup<SearchAlerts, ISearchAlertsOptions>(SearchAlerts, { enableMessage: false });
        expect(test.cmp.message).toBeUndefined();
      });
    });

    describe('exposes enableManagePanel option', () => {
      it('should add the option in the settings menu', () => {
        $$(test.env.root).trigger(SettingsEvents.settingsPopulateMenu, settingsData);
        expect(settingsData.menuData).toContain(jasmine.objectContaining({ className: 'coveo-subscriptions-panel' }));
      });

      it('should not add option in the settings menu if false', () => {
        test = Mock.optionsComponentSetup<SearchAlerts, ISearchAlertsOptions>(SearchAlerts, { enableManagePanel: false });
        $$(test.env.root).trigger(SettingsEvents.settingsPopulateMenu, settingsData);
        expect(settingsData.menuData).not.toContain(jasmine.objectContaining({ className: 'coveo-subscriptions-panel' }));
      });
    });

    describe('exposes enableFollowQuery options', () => {
      it('should add the option in the settings menu after the first query success', (done) => {
        let promise = Promise.resolve();
        spyOn(test.env.queryController, 'getEndpoint').and.returnValue({ listSubscriptions: () => { return promise; } });

        Simulate.query(test.env);

        Promise.resolve().then(() => {
          $$(test.env.root).trigger(SettingsEvents.settingsPopulateMenu, settingsData);
          expect(settingsData.menuData).toContain(jasmine.objectContaining({ className: 'coveo-follow-query' }));
          done();
        });
      });

      it('should not add the option in the settings menu after the first query success if false', (done) => {
        test = Mock.optionsComponentSetup<SearchAlerts, ISearchAlertsOptions>(SearchAlerts, { enableFollowQuery: false });
        let promise = Promise.resolve();
        spyOn(test.env.queryController, 'getEndpoint').and.returnValue({ listSubscriptions: () => { return promise; } });

        Simulate.query(test.env);

        Promise.resolve().then(() => {
          $$(test.env.root).trigger(SettingsEvents.settingsPopulateMenu, settingsData);
          expect(settingsData.menuData).not.toContain(jasmine.objectContaining({ className: 'coveo-follow-query' }));
          done();
        });
      });
    });


    /*describe('open panel', () => {

      let listSubscriptionsMock: jasmine.Spy;

      beforeEach(() => {
        listSubscriptionsMock = jasmine.createSpy('listSubscriptions')
        listSubscriptionsMock.and.returnValue(Promise.resolve([]));
        spyOn(test.cmp.queryController, 'getEndpoint').and.returnValue({listSubscriptions: listSubscriptionsMock});

        //Coveo.ModalBox = jasmine.createSpyObj('ModalBox', ['open']);
      })

      afterEach(() => {
        listSubscriptionsMock = null;
      })

      it('should open a modal box', (done) => {
        test.cmp.openPanel().then(() => {
          expect(ModalBox.open).toHaveBeenCalledWith(jasmine.anything(), jasmine.objectContaining({className: 'coveo-subscriptions-panel'}));
          done();
        });
      });

      it('should show an error message if there was an error', (done) => {
        listSubscriptionsMock.and.returnValue(Promise.reject({}));
        test.cmp.openPanel().then(() => {
          expect($$((<jasmine.Spy>ModalBox.open).calls.argsFor(0)[0]).find('.coveo-subscriptions-panel-content')).toBeNull();
          expect($$((<jasmine.Spy>ModalBox.open).calls.argsFor(0)[0]).find('.coveo-subscriptions-panel-fail')).not.toBeNull();
          done();
        });
      })

      it('should list the subscriptions', (done) => {
        test.cmp.openPanel().then(() => {
          expect($$((<jasmine.Spy>ModalBox.open).calls.argsFor(0)[0]).find('.coveo-subscriptions-panel-content')).not.toBeNull();
          expect($$((<jasmine.Spy>ModalBox.open).calls.argsFor(0)[0]).find('.coveo-subscriptions-panel-fail')).toBeNull();
          done();
        });
      })

    })*/

    describe('follow query', () => {

      let followMock: jasmine.Spy;

      beforeEach(() => {
        (<jasmine.Spy>test.cmp.queryController.createQueryBuilder).and.returnValue(new QueryBuilder());
        followMock = jasmine.createSpy('follow');
        followMock.and.returnValue(Promise.resolve({}));
        spyOn(test.cmp.queryController, 'getEndpoint').and.returnValue({ follow: followMock });
      });

      afterEach(() => {
        followMock = null;
      });

      it('should call the endpoint', () => {
        test.cmp.followQuery();
        expect(followMock).toHaveBeenCalled();
      });

      it('should trigger a search alert created event', (done) => {
        $$(test.env.root).on(SearchAlertsEvents.searchAlertsCreated, () => {
          expect(true).toBe(true);
          done();
        });
        test.cmp.followQuery();
      });

      it('should send the query property on follow query', () => {
        let builder = new QueryBuilder();
        builder.expression.add('yololo');
        (<jasmine.Spy>test.cmp.queryController.createQueryBuilder).and.returnValue(builder);
        test.cmp.followQuery();
        expect(followMock).toHaveBeenCalledWith(
          jasmine.objectContaining({
            typeConfig: jasmine.objectContaining({
              query: jasmine.objectContaining({
                q: jasmine.stringMatching('yololo')
              })
            })
          }));
      });

      it('should send the name property on follow query', () => {
        let builder = new QueryBuilder();
        builder.expression.add('yololo');
        (<jasmine.Spy>test.cmp.queryController.createQueryBuilder).and.returnValue(builder);

        $$(test.env.root).on(SearchAlertsEvents.searchAlertsPopulateMessage, (e, args: ISearchAlertsPopulateMessageEventArgs) => {
          args.text.push('Something');
          args.text.push('Another thing');
        });

        test.cmp.followQuery();
        expect(followMock).toHaveBeenCalledWith(
          jasmine.objectContaining({
            name: 'yololo (Something) (Another thing)'
          }));
      });

      it('should trigger a search alert failed event if there was a problem', (done) => {
        followMock.and.returnValue(Promise.resolve());
        $$(test.env.root).on(SearchAlertsEvents.searchAlertsFail, () => {
          expect(true).toBe(true);
          done();
        });
        test.cmp.followQuery();
      });
    });
  });
}

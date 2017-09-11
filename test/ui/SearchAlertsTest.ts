import * as Mock from '../MockEnvironment';
import { SearchAlerts } from '../../src/ui/SearchAlerts/SearchAlerts';
import { ISettingsPopulateMenuArgs } from '../../src/ui/Settings/Settings';
import { Settings } from '../../src/ui/Settings/Settings';
import { ISearchAlertsOptions } from '../../src/ui/SearchAlerts/SearchAlerts';
import { $$ } from '../../src/utils/Dom';
import { SettingsEvents } from '../../src/events/SettingsEvents';
import { Simulate } from '../Simulate';
import { QueryBuilder } from '../../src/ui/Base/QueryBuilder';
import { SearchAlertsEvents, ISearchAlertsPopulateMessageEventArgs } from '../../src/events/SearchAlertEvents';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { AdvancedComponentSetupOptions } from '../MockEnvironment';
import { SUBSCRIPTION_TYPE, ISubscriptionQueryRequest, ISubscriptionItemRequest } from '../../src/rest/Subscription';
import * as _ from 'underscore';

export function SearchAlertsTest() {
  describe('SearchAlerts', function() {
    let test: Mock.IBasicComponentSetupWithModalBox<SearchAlerts>;
    let settingsData: ISettingsPopulateMenuArgs;
    let listSubscription: jasmine.Spy;
    let updateSubscription: jasmine.Spy;
    let deleteSubscription: jasmine.Spy;
    let followSubscription: jasmine.Spy;

    const getRootElementOpenedInModalBox = test => {
      return <HTMLElement>test.modalBox.open.calls.argsFor(0)[0];
    };

    beforeEach(() => {
      listSubscription = jasmine.createSpy('listSub');
      listSubscription.and.returnValue(new Promise((resolve, reject) => {}));
      updateSubscription = jasmine.createSpy('update');
      updateSubscription.and.returnValue(new Promise((resolve, reject) => {}));
      deleteSubscription = jasmine.createSpy('delete');
      deleteSubscription.and.returnValue(new Promise((resolve, reject) => {}));
      followSubscription = jasmine.createSpy('follow');
      followSubscription.and.returnValue(followSubscription);

      test = Mock.basicComponentSetupWithModalBox<SearchAlerts>(SearchAlerts);
      settingsData = {
        settings: Mock.basicComponentSetup<Settings>(Settings).cmp,
        menuData: []
      };
      test.env.searchEndpoint.listSubscriptions = listSubscription;
      test.env.searchEndpoint.updateSubscription = updateSubscription;
      test.env.searchEndpoint.deleteSubscription = deleteSubscription;
      test.env.searchEndpoint.follow = followSubscription;
      test.env.searchEndpoint.options.isGuestUser = false;
    });

    afterEach(() => {
      test = null;
      settingsData = null;
      listSubscription = null;
      updateSubscription = null;
      deleteSubscription = null;
      followSubscription = null;
    });

    describe('exposes enableMessage option', () => {
      it('should be able to send message', () => {
        expect(test.cmp.message).toBeDefined();
      });

      it('should not be able to send message if false', () => {
        test = Mock.optionsComponentSetupWithModalBox<SearchAlerts, ISearchAlertsOptions>(SearchAlerts, { enableMessage: false });
        expect(test.cmp.message).toBeUndefined();
      });
    });

    describe('exposes enableManagePanel option', () => {
      it('should add the option in the settings menu if the user is not anonymous', () => {
        test = Mock.advancedComponentSetupWithModalBox<SearchAlerts>(
          SearchAlerts,
          new AdvancedComponentSetupOptions(
            null,
            {
              enableManagePanel: true
            },
            env => {
              env.searchEndpoint.options.isGuestUser = false;
              return env;
            }
          )
        );
        $$(test.env.root).trigger(SettingsEvents.settingsPopulateMenu, settingsData);
        expect(settingsData.menuData).toContain(jasmine.objectContaining({ className: 'coveo-subscriptions-panel' }));
      });

      it('should not add the option in the setting menu if the user is anonymous', () => {
        test = Mock.advancedComponentSetupWithModalBox<SearchAlerts>(
          SearchAlerts,
          new AdvancedComponentSetupOptions(
            null,
            {
              enableManagePanel: true
            },
            env => {
              env.searchEndpoint.options.isGuestUser = true;
              return env;
            }
          )
        );
        $$(test.env.root).trigger(SettingsEvents.settingsPopulateMenu, settingsData);
        expect(settingsData.menuData).not.toContain(jasmine.objectContaining({ className: 'coveo-subscriptions-panel' }));
      });

      it('should not add option in the settings menu if false', () => {
        test = Mock.optionsComponentSetupWithModalBox<SearchAlerts, ISearchAlertsOptions>(SearchAlerts, {
          enableManagePanel: false
        });
        $$(test.env.root).trigger(SettingsEvents.settingsPopulateMenu, settingsData);
        expect(settingsData.menuData).not.toContain(jasmine.objectContaining({ className: 'coveo-subscriptions-panel' }));
      });
    });

    describe('exposes enableFollowQuery options', () => {
      it('should add the option in the settings menu after the first query success', done => {
        let promise = Promise.resolve();
        listSubscription.and.returnValue(promise);
        Simulate.query(test.env);
        promise.then(() => {
          $$(test.env.root).trigger(SettingsEvents.settingsPopulateMenu, settingsData);
          expect(settingsData.menuData).toContain(jasmine.objectContaining({ className: 'coveo-follow-query' }));
          done();
        });
      });

      it('should not add the option in the settings menu after the first query success if the service is disabled', done => {
        let promise = Promise.reject('oh noes');
        listSubscription.and.returnValue(promise);
        Simulate.query(test.env);
        promise.catch(() => {
          $$(test.env.root).trigger(SettingsEvents.settingsPopulateMenu, settingsData);
          expect(settingsData.menuData).not.toContain(jasmine.objectContaining({ className: 'coveo-follow-query' }));
          done();
        });
      });
    });

    describe('open panel', () => {
      it('should open a modal box', done => {
        listSubscription.and.returnValue(Promise.resolve());
        test.cmp.openPanel().then(() => {
          expect(test.modalBox.open).toHaveBeenCalledWith(
            jasmine.anything(),
            jasmine.objectContaining({ className: 'coveo-subscriptions-panel' })
          );
          done();
        });
      });

      it('should show an error message if there was an error', done => {
        listSubscription.and.returnValue(Promise.reject({}));
        test.cmp.openPanel().then(() => {
          const elementOpened = getRootElementOpenedInModalBox(test);

          expect($$(elementOpened).find('.coveo-subscriptions-panel-content')).toBeNull();
          expect($$(elementOpened).find('.coveo-subscriptions-panel-fail')).not.toBeNull();
          done();
        });
      });

      describe('with a query being followed', () => {
        let request;

        beforeEach(() => {
          const queryBuilder = new QueryBuilder();
          queryBuilder.expression.add('my query');
          request = {
            id: 'qwerty',
            frequency: 'daily',
            name: 'my subscription',
            type: SUBSCRIPTION_TYPE.followQuery,
            typeConfig: <ISubscriptionQueryRequest>{
              modifiedDateField: '@date',
              query: queryBuilder.build()
            }
          };
        });

        afterEach(() => {
          request = null;
        });

        it('should display subscription with a name', done => {
          const promise = Promise.resolve([request]);
          listSubscription.and.returnValue(promise);

          test.cmp.openPanel().then(() => {
            const elementOpened = getRootElementOpenedInModalBox(test);
            expect($$(elementOpened).find('tr.coveo-subscriptions-panel-subscription')).not.toBeNull();
            expect($$(elementOpened).find('td.coveo-subscriptions-panel-context')).not.toBeNull();
            expect($$($$(elementOpened).find('td.coveo-subscriptions-panel-context')).text()).toBe('my subscription');
            done();
          });
        });

        it('should display subscription query if there is no name', done => {
          request.name = null;
          const promise = Promise.resolve([request]);
          listSubscription.and.returnValue(promise);

          test.cmp.openPanel().then(() => {
            const elementOpened = getRootElementOpenedInModalBox(test);
            expect($$(elementOpened).find('tr.coveo-subscriptions-panel-subscription')).not.toBeNull();
            expect($$(elementOpened).find('td.coveo-subscriptions-panel-context')).not.toBeNull();
            expect($$($$(elementOpened).find('td.coveo-subscriptions-panel-context')).text()).toBe('my query');
            done();
          });
        });

        it('should display and escape subscription query if there is no name', done => {
          request.name = null;
          const queryBuilder = new QueryBuilder();
          queryBuilder.expression.add('<script>1+1</script>');
          request.typeConfig.query = queryBuilder.build();

          const promise = Promise.resolve([request]);

          listSubscription.and.returnValue(promise);

          test.cmp.openPanel().then(() => {
            const elementOpened = getRootElementOpenedInModalBox(test);
            expect($$(elementOpened).find('tr.coveo-subscriptions-panel-subscription')).not.toBeNull();
            expect($$(elementOpened).find('td.coveo-subscriptions-panel-context')).not.toBeNull();
            expect($$(elementOpened).find('td.coveo-subscriptions-panel-context').innerHTML).toEqual(_.escape('<script>1+1</script>'));
            done();
          });
        });
      });

      describe('with a follow item', () => {
        let request;

        beforeEach(() => {
          request = {
            id: 'qwerty',
            frequency: 'daily',
            name: null,
            type: SUBSCRIPTION_TYPE.followDocument,
            typeConfig: <ISubscriptionItemRequest>{
              modifiedDateField: '@date',
              title: 'my title'
            }
          };
        });

        afterEach(() => {
          request = null;
        });

        it('should use the type config title', done => {
          const promise = Promise.resolve([request]);

          listSubscription.and.returnValue(promise);

          test.cmp.openPanel().then(() => {
            const elementOpened = getRootElementOpenedInModalBox(test);
            expect($$(elementOpened).find('tr.coveo-subscriptions-panel-subscription')).not.toBeNull();
            expect($$(elementOpened).find('td.coveo-subscriptions-panel-context')).not.toBeNull();
            expect($$($$(elementOpened).find('td.coveo-subscriptions-panel-context')).text()).toEqual('my title');
            done();
          });
        });

        it('should set the correct frequency in the dropdown', done => {
          request.frequency = 'sunday';
          const promise = Promise.resolve([request]);
          listSubscription.and.returnValue(promise);
          test.cmp.openPanel().then(() => {
            const elementOpened = getRootElementOpenedInModalBox(test);
            expect(($$(elementOpened).find('.coveo-dropdown') as HTMLSelectElement).value).toBe('sunday');
            done();
          });
        });

        it('should call usage analytics when the dropdown for frequency is changed', done => {
          request.frequency = 'sunday';
          request.typeConfig.title = 'my title';
          const promise = Promise.resolve([request]);

          listSubscription.and.returnValue(promise);

          test.cmp.openPanel().then(() => {
            const elementOpened = getRootElementOpenedInModalBox(test);
            const dropdown = $$(elementOpened).find('.coveo-dropdown') as HTMLSelectElement;
            $$(dropdown).trigger('change');
            expect(test.env.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
              analyticsActionCauseList.searchAlertsUpdateSubscription,
              jasmine.objectContaining({
                subscription: 'my title',
                frequency: 'sunday'
              }),
              test.cmp.element
            );
            done();
          });
        });

        it('should call the search alert service when the dropdown for frequency is changed', done => {
          request.frequency = 'monday';
          request.typeConfig.title = 'some nice title';
          const promise = Promise.resolve([request]);

          listSubscription.and.returnValue(promise);

          test.cmp.openPanel().then(() => {
            const elementOpened = getRootElementOpenedInModalBox(test);
            const dropdown = $$(elementOpened).find('.coveo-dropdown') as HTMLSelectElement;
            $$(dropdown).trigger('change');
            expect(updateSubscription).toHaveBeenCalledWith(
              jasmine.objectContaining({
                frequency: 'monday',
                typeConfig: jasmine.objectContaining({
                  title: 'some nice title'
                })
              })
            );
            done();
          });
        });

        it('should call the search alert service when an item is unfollowed', done => {
          request.frequency = 'friday';
          request.typeConfig.title = "it's friday friday, gotta get down on friday";
          const promise = Promise.resolve([request]);
          listSubscription.and.returnValue(promise);

          test.cmp.openPanel().then(() => {
            const elementOpened = getRootElementOpenedInModalBox(test);
            const unfollow = $$(elementOpened).find('.coveo-subscriptions-panel-action-unfollow');
            $$(unfollow).trigger('click');
            expect(deleteSubscription).toHaveBeenCalledWith(
              jasmine.objectContaining({
                frequency: 'friday',
                typeConfig: jasmine.objectContaining({
                  title: "it's friday friday, gotta get down on friday"
                })
              })
            );
            done();
          });
        });

        it('should call the analytics service when an item is unfollowed', done => {
          request.name = 'my sub';
          const promise = Promise.resolve([request]);
          listSubscription.and.returnValue(promise);

          test.cmp.openPanel().then(() => {
            let deletePromise = Promise.resolve();
            deleteSubscription.and.returnValue(deletePromise);

            const elementOpened = getRootElementOpenedInModalBox(test);
            const unfollow = $$(elementOpened).find('.coveo-subscriptions-panel-action-unfollow');
            $$(unfollow).trigger('click');

            deletePromise.finally(() => {
              expect(test.env.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
                analyticsActionCauseList.searchAlertsUnfollowDocument,
                jasmine.objectContaining({
                  subscription: 'my sub'
                }),
                test.cmp.element
              );
              done();
            });
          });
        });

        it('should call the search alert service when an item is followed', done => {
          const promise = Promise.resolve([request]);
          listSubscription.and.returnValue(promise);

          test.cmp.openPanel().then(() => {
            let followPromise = Promise.resolve();
            followSubscription.and.returnValue(followPromise);

            const elementOpened = getRootElementOpenedInModalBox(test);
            const follow = $$(elementOpened).find('.coveo-subscriptions-panel-action-follow');
            $$(follow).trigger('click');

            followPromise.finally(() => {
              expect(followSubscription).toHaveBeenCalledWith(
                jasmine.objectContaining({
                  frequency: 'daily',
                  typeConfig: jasmine.objectContaining({
                    title: 'my title'
                  })
                })
              );
              done();
            });
          });
        });

        it('should call the analytics service when an item is followed', done => {
          request.name = 'my document';
          const promise = Promise.resolve([request]);
          listSubscription.and.returnValue(promise);

          test.cmp.openPanel().then(() => {
            let followPromise = Promise.resolve();
            followSubscription.and.returnValue(followPromise);

            const elementOpened = getRootElementOpenedInModalBox(test);
            const follow = $$(elementOpened).find('.coveo-subscriptions-panel-action-follow');
            $$(follow).trigger('click');

            followPromise.finally(() => {
              expect(test.env.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
                analyticsActionCauseList.searchAlertsFollowDocument,
                jasmine.objectContaining({
                  subscription: 'my document'
                }),
                test.cmp.element
              );
              done();
            });
          });
        });
      });
    });

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

      it('should log an analytics event', () => {
        test.cmp.followQuery();
        expect(test.cmp.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.searchAlertsFollowQuery,
          {
            subscription: '<empty>'
          },
          test.cmp.element
        );
      });

      it('should trigger a search alert created event', done => {
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
          })
        );
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
          })
        );
      });

      it('should trigger a search alert failed event if there was a problem', done => {
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

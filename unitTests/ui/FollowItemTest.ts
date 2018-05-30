import { FollowItem } from '../../src/ui/FollowItem/FollowItem';
import * as Mock from '../MockEnvironment';
import { SearchEndpoint } from '../../src/rest/SearchEndpoint';
import { IQueryResult } from '../../src/rest/QueryResult';
import { FakeResults } from '../Fake';
import { $$ } from '../../src/utils/Dom';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { QueryUtils } from '../../src/utils/QueryUtils';
import { Simulate } from '../Simulate';
import { KEYBOARD } from '../../src/utils/KeyboardUtils';
import { SearchAlertsEvents } from '../../src/events/SearchAlertEvents';

export function FollowItemTest() {
  describe('FollowItem', function() {
    let test: Mock.IBasicComponentSetup<FollowItem>;
    let endpointMock: SearchEndpoint;
    let result: IQueryResult;

    beforeEach(() => {
      result = FakeResults.createFakeResult();

      endpointMock = Mock.mockSearchEndpoint();
      (<jasmine.Spy>endpointMock.listSubscriptions).and.returnValue(Promise.resolve([]));

      test = Mock.advancedResultComponentSetup<FollowItem>(
        FollowItem,
        result,
        new Mock.AdvancedComponentSetupOptions(null, null, env => {
          return env.withEndpoint(endpointMock);
        })
      );
    });

    afterEach(() => {
      test = null;
      endpointMock = null;
      result = null;
    });

    it('should set the item as followed if it is followed', done => {
      (<jasmine.Spy>endpointMock.listSubscriptions).and.returnValue(Promise.resolve([{ typeConfig: { id: result.raw.urihash } }]));
      test = Mock.advancedResultComponentSetup<FollowItem>(
        FollowItem,
        result,
        new Mock.AdvancedComponentSetupOptions(null, null, env => {
          return env.withEndpoint(endpointMock);
        })
      );

      Promise.resolve().then(() => {
        expect($$(test.cmp.element).hasClass('coveo-follow-item-followed')).toBe(true);
        done();
      });
    });

    it('should set the item as not followed if it is not followed', done => {
      Promise.resolve().then(() => {
        expect($$(test.cmp.element).hasClass('coveo-follow-item-followed')).toBe(false);
        done();
      });
    });

    it('should remove the component if the search alerts service is unavailable', done => {
      (<jasmine.Spy>endpointMock.listSubscriptions).and.returnValue(Promise.resolve('Error'));
      let root = $$('div').el;
      spyOn(root, 'removeChild');
      test = Mock.advancedResultComponentSetup<FollowItem>(
        FollowItem,
        result,
        new Mock.AdvancedComponentSetupOptions(null, null, env => {
          return env.withEndpoint(endpointMock).withRoot(root);
        })
      );

      Promise.resolve({}).then(() => {
        expect(root.removeChild).toHaveBeenCalled();
        done();
      });
    });

    describe('toggleFollow', () => {
      it('should delete the subscription if the document is followed', done => {
        (<jasmine.Spy>endpointMock.listSubscriptions).and.returnValue(
          Promise.resolve([{ id: '123', typeConfig: { id: result.raw.urihash } }])
        );
        (<jasmine.Spy>endpointMock.deleteSubscription).and.returnValue(Promise.resolve());
        test = Mock.advancedResultComponentSetup<FollowItem>(
          FollowItem,
          result,
          new Mock.AdvancedComponentSetupOptions(null, null, env => {
            return env.withEndpoint(endpointMock);
          })
        );

        Promise.resolve().then(() => {
          test.cmp.toggleFollow();
          expect(endpointMock.deleteSubscription).toHaveBeenCalled();
          done();
        });
      });

      it('should create a subscription if the document is not followed', done => {
        (<jasmine.Spy>endpointMock.follow).and.returnValue(Promise.resolve());
        test = Mock.advancedResultComponentSetup<FollowItem>(
          FollowItem,
          result,
          new Mock.AdvancedComponentSetupOptions(null, null, env => {
            return env.withEndpoint(endpointMock);
          })
        );

        Promise.resolve().then(() => {
          test.cmp.toggleFollow();
          expect(endpointMock.follow).toHaveBeenCalled();
          done();
        });
      });

      it('should follow the document on click', done => {
        (<jasmine.Spy>endpointMock.follow).and.returnValue(Promise.resolve());
        test = Mock.advancedResultComponentSetup<FollowItem>(
          FollowItem,
          result,
          new Mock.AdvancedComponentSetupOptions(null, null, env => {
            return env.withEndpoint(endpointMock);
          })
        );

        Promise.resolve().then(() => {
          $$(test.cmp.element).trigger('click');
          expect(endpointMock.follow).toHaveBeenCalled();
          done();
        });
      });

      it('should follow the document when pressing enter', done => {
        if (Simulate.isPhantomJs()) {
          // Keypress simulation doesn't work well in phantom js
          expect(true).toBe(true);
          done();
        } else {
          (<jasmine.Spy>endpointMock.follow).and.returnValue(Promise.resolve());
          test = Mock.advancedResultComponentSetup<FollowItem>(
            FollowItem,
            result,
            new Mock.AdvancedComponentSetupOptions(null, null, env => {
              return env.withEndpoint(endpointMock);
            })
          );

          Promise.resolve().then(() => {
            Simulate.keyUp(test.cmp.element, KEYBOARD.ENTER);
            expect(endpointMock.follow).toHaveBeenCalled();
            done();
          });
        }
      });

      it('should log an analytics event if the document is followed', done => {
        let fake = FakeResults.createFakeResult();

        (<jasmine.Spy>endpointMock.follow).and.returnValue(Promise.resolve());
        test = Mock.advancedResultComponentSetup<FollowItem>(
          FollowItem,
          result,
          new Mock.AdvancedComponentSetupOptions(null, null, env => {
            return env.withEndpoint(endpointMock);
          })
        );

        Promise.resolve().then(() => {
          test.cmp.toggleFollow();
          expect(test.cmp.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
            analyticsActionCauseList.searchAlertsFollowDocument,
            jasmine.objectContaining({
              author: QueryUtils.getAuthor(fake),
              documentLanguage: QueryUtils.getLanguage(fake),
              documentSource: QueryUtils.getSource(fake),
              documentTitle: fake.title,
              contentIDKey: QueryUtils.getPermanentId(fake).fieldUsed,
              contentIDValue: jasmine.any(String)
            }),
            test.cmp.element
          );
          done();
        });
      });

      it('should log an analytics event if the document is unfollowed', done => {
        let fake = FakeResults.createFakeResult();

        (<jasmine.Spy>endpointMock.listSubscriptions).and.returnValue(
          Promise.resolve([{ id: '123', typeConfig: { id: result.raw.urihash } }])
        );
        (<jasmine.Spy>endpointMock.deleteSubscription).and.returnValue(Promise.resolve());
        test = Mock.advancedResultComponentSetup<FollowItem>(
          FollowItem,
          result,
          new Mock.AdvancedComponentSetupOptions(null, null, env => {
            return env.withEndpoint(endpointMock);
          })
        );

        Promise.resolve().then(() => {
          test.cmp.toggleFollow();
          expect(test.cmp.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
            analyticsActionCauseList.searchAlertsUnfollowDocument,
            jasmine.objectContaining({
              author: QueryUtils.getAuthor(fake),
              documentLanguage: QueryUtils.getLanguage(fake),
              documentSource: QueryUtils.getSource(fake),
              documentTitle: fake.title
            }),
            test.cmp.element
          );
          done();
        });
      });

      it('should not throw if delete subscription fails from the endpoint', done => {
        (<jasmine.Spy>endpointMock.listSubscriptions).and.returnValue(
          Promise.resolve([
            {
              id: '123',
              typeConfig: { id: result.raw.urihash }
            }
          ])
        );
        (<jasmine.Spy>endpointMock.deleteSubscription).and.returnValue(Promise.reject('oh no it fails'));
        test = Mock.advancedResultComponentSetup<FollowItem>(
          FollowItem,
          result,
          new Mock.AdvancedComponentSetupOptions(null, null, env => {
            return env.withEndpoint(endpointMock);
          })
        );

        Promise.resolve().then(() => {
          expect(() => {
            test.cmp.toggleFollow();
          }).not.toThrow();
          done();
        });
      });

      it('should not throw if follow subscription fails from the endpoint', done => {
        (<jasmine.Spy>endpointMock.follow).and.returnValue(Promise.reject('oh no it fails'));
        test = Mock.advancedResultComponentSetup<FollowItem>(
          FollowItem,
          result,
          new Mock.AdvancedComponentSetupOptions(null, null, env => {
            return env.withEndpoint(endpointMock);
          })
        );

        Promise.resolve().then(() => {
          expect(() => {
            test.cmp.toggleFollow();
          }).not.toThrow();
          done();
        });
      });
    });

    it('should handle subscription delete and follow from an event', () => {
      let subscription = {
        subscription: {
          id: 'an id',
          user: 'an user',
          type: 'followDocument',
          typeConfig: { id: result.raw['urihash'] }
        }
      };
      $$(test.env.root).trigger(SearchAlertsEvents.searchAlertsCreated, subscription);
      expect($$(test.cmp.element).hasClass('coveo-follow-item-followed')).toBe(true);
      $$(test.env.root).trigger(SearchAlertsEvents.searchAlertsDeleted, subscription);
      expect($$(test.cmp.element).hasClass('coveo-follow-item-followed')).not.toBe(true);
    });
  });
}

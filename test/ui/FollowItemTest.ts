import {FollowItem} from '../../src/ui/SearchAlerts/FollowItem';
import * as Mock from '../MockEnvironment';
import {SearchEndpoint} from '../../src/rest/SearchEndpoint';
import {IQueryResult} from '../../src/rest/QueryResult';
import {FakeResults} from '../Fake';
import {$$} from '../../src/utils/Dom';

export function FollowItemTest() {
  describe('FollowItem', function () {
    let test: Mock.IBasicComponentSetup<FollowItem>;
    let endpointMock: SearchEndpoint;
    let result: IQueryResult;

    beforeEach(() => {
      result = FakeResults.createFakeResult();

      endpointMock = Mock.mockSearchEndpoint();
      (<jasmine.Spy>endpointMock.listSubscriptions).and.returnValue(Promise.resolve([]));

      test = Mock.advancedResultComponentSetup<FollowItem>(FollowItem, result, new Mock.AdvancedComponentSetupOptions(null, null, (env) => {
        return env.withEndpoint(endpointMock);
      }));
    });

    afterEach(() => {
      test = null;
      endpointMock = null;
      result = null;
    })

    it('should set the item as followed if it is followed', (done) => {
      (<jasmine.Spy>endpointMock.listSubscriptions).and.returnValue(Promise.resolve([{ typeConfig: { id: result.raw.urihash } }]));
      test = Mock.advancedResultComponentSetup<FollowItem>(FollowItem, result, new Mock.AdvancedComponentSetupOptions(null, null, (env) => {
        return env.withEndpoint(endpointMock);
      }));

      Promise.resolve().then(() => {
        expect($$(test.cmp.element).hasClass('coveo-follow-item-followed')).toBe(true);
        done();
      })
    });

    it('should set the item as not followed if it is not followed', (done) => {
      Promise.resolve().then(() => {
        expect($$(test.cmp.element).hasClass('coveo-follow-item-followed')).toBe(false);
        done();
      })
    });

    it('should remove the component if the search alerts service is unavailable', (done) => {
      (<jasmine.Spy>endpointMock.listSubscriptions).and.returnValue(Promise.resolve('Error'));
      let root = $$('div').el;
      spyOn(root, 'removeChild');
      test = Mock.advancedResultComponentSetup<FollowItem>(FollowItem, result, new Mock.AdvancedComponentSetupOptions(null, null, (env) => {
        return env.withEndpoint(endpointMock).withRoot(root);
      }));

      Promise.resolve({}).then(() => {
        expect(root.removeChild).toHaveBeenCalled();
        done();
      })
    })

    describe('toggleFollow', () => {

      it('should delete the subscription if the document is followed', (done) => {
        (<jasmine.Spy>endpointMock.listSubscriptions).and.returnValue(Promise.resolve([{ id: '123', typeConfig: { id: result.raw.urihash } }]));
        (<jasmine.Spy>endpointMock.deleteSubscription).and.returnValue(Promise.resolve());
        test = Mock.advancedResultComponentSetup<FollowItem>(FollowItem, result, new Mock.AdvancedComponentSetupOptions(null, null, (env) => {
          return env.withEndpoint(endpointMock);
        }));

        Promise.resolve().then(() => {
          test.cmp.toggleFollow();
          expect(endpointMock.deleteSubscription).toHaveBeenCalled();
          done();
        })
      })

      it('should create a subscription if the document is not followed', (done) => {
        (<jasmine.Spy>endpointMock.follow).and.returnValue(Promise.resolve());
        test = Mock.advancedResultComponentSetup<FollowItem>(FollowItem, result, new Mock.AdvancedComponentSetupOptions(null, null, (env) => {
          return env.withEndpoint(endpointMock);
        }));

        Promise.resolve().then(() => {
          test.cmp.toggleFollow();
          expect(endpointMock.follow).toHaveBeenCalled();
          done();
        })
      })
    })
  });
}

import * as Mock from '../MockEnvironment';
import {FakeResults} from '../Fake';
import {IQueryResult} from '../../src/rest/QueryResult';
import {Backdrop, IBackdropOptions} from '../../src/ui/Backdrop/Backdrop';

export function BackdropTest() {
  describe('Backdrop', function () {
    let test: Mock.IBasicComponentSetup<Backdrop>;
    let fakeResult: IQueryResult;

    beforeEach(function () {
      fakeResult = FakeResults.createFakeResult();
      fakeResult.raw.thumbnailurl = 'http://lorempixel.com/200/200';
      test = Mock.optionsResultComponentSetup<Backdrop, IBackdropOptions>(Backdrop, {
        imageField: 'thumbnailurl'
      }, fakeResult);
    });

    afterEach(function () {
      test = null;
      fakeResult = null;
    });

    describe('exposes options', function () {
      it('imageField sets the background image url accordingly', function () {
        let fakeResult = FakeResults.createFakeResult();
        fakeResult.raw.clubpenguinthumbnailurl = 'https://clubpenguin.com/thumb/af3#3!wewqd$13';

        test = Mock.optionsResultComponentSetup<Backdrop, IBackdropOptions>(Backdrop, {
          imageField: 'clubpenguinthumbnailurl'
        }, fakeResult);

        expect(test.cmp.element.style.background)
          .toBe(`url("${fakeResult.raw.clubpenguinthumbnailurl}")`);
      });

      it('overlayColor should add an overlay color before image', function () {
        test = Mock.optionsResultComponentSetup<Backdrop, IBackdropOptions>(Backdrop, {
          imageField: 'thumbnailurl',
          overlayColor: 'rgba(1, 2, 3, 0.6)'
        }, fakeResult);
        expect(test.cmp.element.style.background)
          .toContain('rgba(1, 2, 3, 0.6)');
      });

      it('overlayGradient sets the second value of the gradient to rgba(0,0,0,0)', function () {
        test = Mock.optionsResultComponentSetup<Backdrop, IBackdropOptions>(Backdrop, {
          imageField: 'thumbnailurl',
          overlayColor: 'rgba(1, 2, 3, 0.8)',
          overlayGradient: true
        }, FakeResults.createFakeResult());

        expect(test.cmp.element.style.background)
          .toContain('linear-gradient(rgba(1, 2, 3, 0.8), rgba(0, 0, 0, 0))');
      });
    });
  });
}

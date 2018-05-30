import * as Mock from '../MockEnvironment';
import { FakeResults } from '../Fake';
import { IQueryResult } from '../../src/rest/QueryResult';
import { Backdrop, IBackdropOptions } from '../../src/ui/Backdrop/Backdrop';
import { $$ } from '../../src/utils/Dom';
import { Simulate } from '../Simulate';

export function BackdropTest() {
  describe('Backdrop', function() {
    let test: Mock.IBasicComponentSetup<Backdrop>;
    let fakeResult: IQueryResult;

    beforeEach(function() {
      fakeResult = FakeResults.createFakeResult();
      fakeResult.raw.thumbnailurl = 'http://lorempixel.com/200/200';
      test = Mock.optionsResultComponentSetup<Backdrop, IBackdropOptions>(
        Backdrop,
        {
          imageField: 'thumbnailurl'
        },
        fakeResult
      );
    });

    afterEach(function() {
      test = null;
      fakeResult = null;
    });

    describe('exposes options', function() {
      it('imageField sets the background image url accordingly', function() {
        let fakeResult = FakeResults.createFakeResult();
        fakeResult.raw.clubpenguinthumbnailurl = 'https://epicurl/';

        test = Mock.optionsResultComponentSetup<Backdrop, IBackdropOptions>(
          Backdrop,
          {
            imageField: 'clubpenguinthumbnailurl'
          },
          fakeResult
        );

        expect(test.cmp.element.style.background).toMatch(new RegExp(`url\\(("|')?${fakeResult.raw.clubpenguinthumbnailurl}("|')?\\)`));
      });

      it('imageUrl sets the background image url accordingly', function() {
        test = Mock.optionsResultComponentSetup<Backdrop, IBackdropOptions>(
          Backdrop,
          {
            imageUrl: 'https://foo.com/bar.png'
          },
          fakeResult
        );

        expect(test.cmp.element.style.background).toMatch(new RegExp(`url\\(("|')?https://foo.com/bar.png("|')?\\)`));
      });

      it('imageUrl overrides imageField', function() {
        let fakeResult = FakeResults.createFakeResult();
        fakeResult.raw.clubpenguinthumbnailurl = 'https://epicurl/';

        test = Mock.optionsResultComponentSetup<Backdrop, IBackdropOptions>(
          Backdrop,
          {
            imageField: 'clubpenguinthumbnailurl',
            imageUrl: 'https://foo.com/baz.png'
          },
          fakeResult
        );

        expect(test.cmp.element.style.background).toMatch(new RegExp(`url\\(("|')?https://foo.com/baz.png("|')?\\)`));
      });

      it('overlayColor should add an overlay color before image', function() {
        test = Mock.optionsResultComponentSetup<Backdrop, IBackdropOptions>(
          Backdrop,
          {
            imageField: 'thumbnailurl',
            overlayColor: 'rgba(1, 2, 3, 0.6)'
          },
          fakeResult
        );
        expect(test.cmp.element.style.background).toContain('rgba(1, 2, 3, 0.6)');
      });

      it('overlayGradient sets the second value of the gradient to rgba(0,0,0,0)', function() {
        test = Mock.optionsResultComponentSetup<Backdrop, IBackdropOptions>(
          Backdrop,
          {
            imageField: 'thumbnailurl',
            overlayColor: 'rgba(1, 2, 3, 0.8)',
            overlayGradient: true
          },
          FakeResults.createFakeResult()
        );

        expect(test.cmp.element.style.background).toContain('linear-gradient(rgba(1, 2, 3, 0.8), rgba(0, 0, 0, 0))');
      });
    });

    describe('for a youtube result', () => {
      it('should open the youtubethumbnail in a modalbox', () => {
        fakeResult.raw['ytthumbnailurl'] = 'someurl';
        let fakeModalBox = Simulate.modalBoxModule();
        test.cmp = new Backdrop(test.env.root, { imageField: 'thumbnailurl' }, test.cmp.getBindings(), fakeResult, null, fakeModalBox);

        $$(test.cmp.element).trigger('click');
        expect(fakeModalBox.open).toHaveBeenCalled();
      });
    });
  });
}

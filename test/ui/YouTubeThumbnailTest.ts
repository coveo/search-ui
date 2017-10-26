import * as Mock from '../MockEnvironment';
import { YouTubeThumbnail, IYouTubeThumbnailOptions } from '../../src/ui/YouTube/YouTubeThumbnail';
import { $$ } from '../../src/utils/Dom';
import { get } from '../../src/ui/Base/RegisteredNamedMethods';
import { ResultLink } from '../../src/ui/ResultLink/ResultLink';
import { IQueryResult } from '../../src/rest/QueryResult';
import { FakeResults } from '../Fake';
import { IResultsComponentBindings } from '../../src/ui/Base/ResultsComponentBindings';
import { Simulate } from '../Simulate';

export function YouTubeThumbnailTest() {
  describe('YouTubeThumbnail', () => {
    let test: Mock.IBasicComponentSetup<YouTubeThumbnail>;
    let result: IQueryResult;

    beforeEach(() => {
      result = FakeResults.createFakeResult();
      result.raw['ytthumbnailurl'] = 'someurl';
      test = Mock.optionsResultComponentSetup<YouTubeThumbnail, IYouTubeThumbnailOptions>(
        YouTubeThumbnail,
        <IYouTubeThumbnailOptions>{},
        result
      );
    });

    afterEach(() => {
      test = null;
      result = null;
    });

    it('should create a result link inside that can be opened', () => {
      const linkElement = $$(test.cmp.element).find('.CoveoResultLink');
      expect(linkElement).not.toBe(null);
      expect(get(linkElement) instanceof ResultLink).toBe(true);
    });

    it('should create an image inside', () => {
      const img = $$(test.cmp.element).find('img');
      expect(img).not.toBe(null);
      expect(img.getAttribute('src')).toBe('someurl');
    });

    it('should replace the image on a fail load', done => {
      const img = $$(test.cmp.element).find('img');
      const defaultErroHandler = img.onerror;
      img.onerror = () => {
        defaultErroHandler.apply(test.cmp);
        const svg = $$(test.cmp.element).find('svg');
        expect(svg).toBeDefined();
        expect(svg.style.width).toEqual(test.cmp.options.width);
        done();
      };
    });

    describe('exposes options', () => {
      it('width should allow to specify the width on the image', () => {
        test = Mock.optionsResultComponentSetup<YouTubeThumbnail, IYouTubeThumbnailOptions>(
          YouTubeThumbnail,
          <IYouTubeThumbnailOptions>{ width: '123px' },
          result
        );
        const img = $$(test.cmp.element).find('img');
        expect($$(img).css('width')).toBe('123px');
      });

      it('height should allow to specify the height on the image', () => {
        test = Mock.optionsResultComponentSetup<YouTubeThumbnail, IYouTubeThumbnailOptions>(
          YouTubeThumbnail,
          <IYouTubeThumbnailOptions>{ height: '123px' },
          result
        );
        const img = $$(test.cmp.element).find('img');
        expect($$(img).css('height')).toBe('123px');
      });
    });

    describe('with a fake modal box module', () => {
      let modalBox;

      beforeEach(() => {
        modalBox = Simulate.modalBoxModule();
      });

      afterEach(() => {
        modalBox = null;
      });

      it('should not open the modal box if embed is set to false', () => {
        test = Mock.optionsResultComponentSetup<YouTubeThumbnail, IYouTubeThumbnailOptions>(
          YouTubeThumbnail,
          <IYouTubeThumbnailOptions>{ embed: false },
          result
        );
        test.cmp.ModalBox = modalBox;
        test.cmp.openResultLink();
        expect(modalBox.open).not.toHaveBeenCalled();
      });

      it('should open the modal box if embed is set to true', () => {
        test = Mock.optionsResultComponentSetup<YouTubeThumbnail, IYouTubeThumbnailOptions>(
          YouTubeThumbnail,
          <IYouTubeThumbnailOptions>{ embed: true },
          result
        );
        test.cmp.ModalBox = modalBox;
        test.cmp.openResultLink();
        expect(modalBox.open).toHaveBeenCalled();
      });
    });

    it('should call whatever method is associated on the result link when we try to open it', done => {
      let fakeResultLink = new ResultLink(
        $$('div').el,
        {
          onClick: () => {
            expect(true).toBe(true);
            done();
          }
        },
        <IResultsComponentBindings>test.cmp.getBindings(),
        result
      );
      test.cmp.resultLink = $$(fakeResultLink.element);
      test.cmp.openResultLink();
    });
  });
}

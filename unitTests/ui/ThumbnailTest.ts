import * as Mock from '../MockEnvironment';
import { Thumbnail } from '../../src/ui/Thumbnail/Thumbnail';
import { SearchEndpoint } from '../../src/rest/SearchEndpoint';
import { IThumbnailOptions } from '../../src/ui/Thumbnail/Thumbnail';
import { $$ } from '../../src/utils/Dom';
import { FieldTable } from '../../src/ui/FieldTable/FieldTable';
import { get } from '../../src/ui/Base/RegisteredNamedMethods';
import { ResultLink } from '../../src/ui/ResultLink/ResultLink';
import { Component } from '../../src/ui/Base/Component';
import { MockEnvironmentBuilder } from '../MockEnvironment';
import { Defer } from '../../src/misc/Defer';
import { Icon } from '../../src/ui/Icon/Icon';
import { FakeResults } from '../Fake';

export function ThumbnailTest() {
  describe('Thumbnail', function() {
    let thumbnailEl: HTMLElement;
    let test: Mock.IBasicComponentSetup<Thumbnail>;
    let endpoint: SearchEndpoint;
    let getRawDataStreamPromise: Promise<ArrayBuffer>;

    function buildFieldTable() {
      const result = FakeResults.createFakeResult();
      const element = $$('table', { className: 'CoveoFieldTable' }).el;
      const options = new Mock.AdvancedComponentSetupOptions(element);

      return Mock.advancedResultComponentSetup<FieldTable>(FieldTable, result, options).cmp;
    }

    function buildThumbnailEl() {
      return $$('img').el;
    }

    function initThumbnail() {
      test = Mock.advancedResultComponentSetup<Thumbnail>(Thumbnail, undefined, <Mock.AdvancedComponentSetupOptions>{
        modifyBuilder: (builder: Mock.MockEnvironmentBuilder) =>
          builder
            .withElement(thumbnailEl)
            .withResult()
            .withEndpoint(endpoint)
      });
    }

    beforeEach(() => {
      thumbnailEl = buildThumbnailEl();
      endpoint = Mock.mockSearchEndpoint();
      getRawDataStreamPromise = new Promise<ArrayBuffer>((resolve, reject) => {});
      endpoint.getRawDataStream = () => getRawDataStreamPromise;
      initThumbnail();
    });

    describe('without JSONP', () => {
      beforeEach(function() {
        endpoint.isJsonp = () => false;
        endpoint.getRawDataStream = () => new Promise<ArrayBuffer>(resolve => resolve(new ArrayBuffer(0)));

        initThumbnail();
      });

      it('should use async call by default', async done => {
        await Promise.resolve();
        expect(test.cmp.element.getAttribute('src')).toBe('data:image/png;base64, ');
        done();
      });

      it("should try to resize the FieldTable if it's contained in one", async done => {
        const fieldTable = buildFieldTable();
        const spy = spyOn(fieldTable, 'updateToggleHeight');
        fieldTable.element.appendChild(test.cmp.element);

        await Promise.resolve();
        expect(spy).toHaveBeenCalledTimes(1);
        done();
      });
    });

    describe('with JSONP', () => {
      beforeEach(() => {
        endpoint.isJsonp = () => true;
        initThumbnail();
      });

      it('should use direct url', () => {
        expect(test.cmp.element.getAttribute('src')).toEqual('http://datastream.uri');
      });

      it("should try to resize the FieldTable if it's contained in one", () => {
        const fieldTable = buildFieldTable();
        const spy = spyOn(fieldTable, 'updateToggleHeight');

        thumbnailEl = buildThumbnailEl();
        fieldTable.element.appendChild(thumbnailEl);
        initThumbnail();

        expect(spy).toHaveBeenCalledTimes(1);
      });
    });

    it('should instanciate an icon when no thumnail is available', () => {
      let result = FakeResults.createFakeResult('foobar');
      result.raw.filetype = 'unknown';
      result.flags = '';

      let envBuilder = new MockEnvironmentBuilder().withResult(result);
      new Thumbnail(test.env.element, {}, test.cmp.bindings, envBuilder.result);
      expect(get($$(test.cmp.root).find('.CoveoIcon'), Icon) instanceof Icon).toBe(true);
    });

    describe('exposes options', () => {
      it('noThumbnailClass should set the appropriate CSS class when no thumbnail is available', done => {
        endpoint.getRawDataStream = () => new Promise<ArrayBuffer>((resolve, reject) => reject());

        test = Mock.advancedResultComponentSetup<Thumbnail>(Thumbnail, undefined, <Mock.AdvancedComponentSetupOptions>{
          cmpOptions: <IThumbnailOptions>{ noThumbnailClass: 'coveo-heyo-there-is-no-class' },
          modifyBuilder: (builder: Mock.MockEnvironmentBuilder) => builder.withEndpoint(endpoint)
        });

        Defer.defer(() => {
          expect($$(test.cmp.img).hasClass('coveo-heyo-there-is-no-class')).toBe(true);
          expect($$(test.cmp.img).hasClass('coveo-no-thumbnail')).toBe(false);
          done();
        });
      });

      it('should create a result link if the element is not an image', () => {
        test = Mock.advancedResultComponentSetup<Thumbnail>(
          Thumbnail,
          undefined,
          new Mock.AdvancedComponentSetupOptions(
            $$('div').el,
            {
              clickable: true
            },
            (builder: Mock.MockEnvironmentBuilder) => builder.withResult().withEndpoint(endpoint)
          )
        );
        expect(get(test.cmp.element, ResultLink) instanceof ResultLink).toBe(true);
      });

      it('should create a result link if the element is an image', () => {
        test = Mock.advancedResultComponentSetup<Thumbnail>(
          Thumbnail,
          undefined,
          new Mock.AdvancedComponentSetupOptions(
            $$('img').el,
            {
              clickable: true
            },
            (builder: Mock.MockEnvironmentBuilder) => builder.withResult().withEndpoint(endpoint)
          )
        );
        expect(get(test.cmp.element, ResultLink) instanceof ResultLink).toBe(false);
        expect(get($$(test.env.root).find(`.${Component.computeCssClassName(ResultLink)}`)) instanceof ResultLink).toBe(true);
      });

      it('should accept resultlink option, and pass them correctly', () => {
        test = Mock.advancedResultComponentSetup<Thumbnail>(
          Thumbnail,
          undefined,
          new Mock.AdvancedComponentSetupOptions(
            $$('div').el,
            {
              clickable: true,
              hrefTemplate: 'foo'
            },
            (builder: Mock.MockEnvironmentBuilder) => builder.withResult().withEndpoint(endpoint)
          )
        );
        let resultLink = <ResultLink>get(test.cmp.element, ResultLink);
        expect(resultLink instanceof ResultLink).toBe(true);
        expect(resultLink.options.hrefTemplate).toBe('foo');
      });
    });

    it('should put in an empty image while loading', () => {
      expect(test.cmp.img.getAttribute('src')).toEqual('data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
    });
  });
}

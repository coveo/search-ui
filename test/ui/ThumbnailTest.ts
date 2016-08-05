import * as Mock from '../MockEnvironment';
import {Thumbnail} from '../../src/ui/Thumbnail/Thumbnail';
import {SearchEndpoint} from '../../src/rest/SearchEndpoint';
import {IQueryResult} from '../../src/rest/QueryResult';
import {IThumbnailOptions} from '../../src/ui/Thumbnail/Thumbnail';
import {$$} from '../../src/utils/Dom';

export function ThumbnailTest() {
  describe('Thumbnail', function () {

    var test: Mock.IBasicComponentSetup<Thumbnail>;
    var endpoint: SearchEndpoint;
    var getRawDataStreamPromise: Promise<ArrayBuffer>;

    beforeEach(function () {
      endpoint = Mock.mockSearchEndpoint();
      getRawDataStreamPromise = new Promise<ArrayBuffer>((resolve, reject) => { });
      endpoint.getRawDataStream = () => getRawDataStreamPromise;
      test = Mock.advancedResultComponentSetup<Thumbnail>(Thumbnail, undefined, <Mock.AdvancedComponentSetupOptions>{
        modifyBuilder: (builder: Mock.MockEnvironmentBuilder) => builder.withResult().withEndpoint(endpoint)
      })
    })

    describe('without JSONP', function () {
      beforeEach(function () {
        endpoint.isJsonp = () => false;
        endpoint.getRawDataStream = () => new Promise<ArrayBuffer>((resolve, reject) => resolve(new ArrayBuffer(0)));
        test = Mock.advancedResultComponentSetup<Thumbnail>(Thumbnail, undefined, <Mock.AdvancedComponentSetupOptions>{
          modifyBuilder: (builder: Mock.MockEnvironmentBuilder) => builder.withResult().withEndpoint(endpoint)
        })
      })

      it('should use async call by default', function (done) {
        setTimeout(function () {
          expect(test.cmp.element.getAttribute('src')).toBe('data:image/png;base64, ');
          done();
        }, 0);
      })
    })

    describe('with JSONP', function () {
      beforeEach(function () {
        endpoint.isJsonp = () => true;
        test = Mock.advancedResultComponentSetup<Thumbnail>(Thumbnail, undefined, <Mock.AdvancedComponentSetupOptions>{
          modifyBuilder: (builder: Mock.MockEnvironmentBuilder) => builder.withResult().withEndpoint(endpoint)
        })
      })

      it('should use direct url', function () {
        expect(test.cmp.element.getAttribute('src')).toEqual('http://datastream.uri');
      })
    })

    it('should set a CSS class when no thumbnail is available', function () {
      var result = <IQueryResult>{
        flags: ''
      }
      test = Mock.optionsResultComponentSetup<Thumbnail, IThumbnailOptions>(Thumbnail, undefined, result);
      expect($$(test.cmp.element).hasClass('coveo-no-thumbnail')).toBe(true);
    })

    describe('exposes options', function () {
      it('noThumbnailClass should set the appropriate CSS class when no thumbnail is available', function () {
        test = Mock.optionsResultComponentSetup<Thumbnail, IThumbnailOptions>(Thumbnail, <IThumbnailOptions>{
          noThumbnailClass: 'coveo-heyo-there-is-no-class'
        }, <IQueryResult>{ flags: '' });

        expect($$(test.cmp.element).hasClass('coveo-heyo-there-is-no-class')).toBe(true);
        expect($$(test.cmp.element).hasClass('coveo-no-thumbnail')).toBe(false);
      })
    })


    it('should put in an empty image while loading', function () {
      expect(test.cmp.element.getAttribute('src')).toEqual('data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
    })
  })
}

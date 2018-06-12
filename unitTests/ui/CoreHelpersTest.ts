import { TemplateHelpers } from '../../src/ui/Templates/TemplateHelpers';
import { IHighlight } from '../../src/rest/Highlight';
import { IDateToStringOptions } from '../../src/utils/DateUtils';
import { ITimeSpanUtilsOptions } from '../../src/utils/TimeSpanUtils';
import { FakeResults } from '../Fake';
import { SearchEndpoint } from '../../src/rest/SearchEndpoint';
import { mockSearchEndpoint, MockEnvironmentBuilder } from '../MockEnvironment';
import { IQueryResult } from '../../src/rest/QueryResult';
import { IIconOptions } from '../../src/ui/Icon/Icon';

export function CoreHelperTest() {
  describe('CoreHelpers', () => {
    it('shorten should work correctly', () => {
      expect(TemplateHelpers.getHelper('shorten')('a string that is too long', 20)).toEqual('a string that is...');
    });

    it('shorten should work correctly with higlights', () => {
      let highlights: IHighlight[] = [
        {
          offset: 2,
          length: 6
        }
      ];
      expect(TemplateHelpers.getHelper('shorten')('a string that is too long', 20, highlights)).toEqual(
        'a <span class="highlight">string</span> that is...'
      );
    });

    it('shortenv2 should work correctly', () => {
      expect(
        TemplateHelpers.getHelper('shortenv2')('a string that is too long', {
          length: 20
        })
      ).toEqual('a string that is...');
    });

    it('javascriptencode should work correctly', () => {
      expect(TemplateHelpers.getHelper('javascriptencode')('"yo"')).toEqual('\\"yo\\"');
    });

    it('shortenPath should work correctly', () => {
      expect(TemplateHelpers.getHelper('shortenPath')('/Users/Me/Desktop/MyFiles/MyDocument.txt', 20)).toEqual('/Users/Me/Desktop...');
    });

    it('shortenPath v2 should work correctly', () => {
      expect(
        TemplateHelpers.getHelper('shortenPathv2')('/Users/Me/Desktop/MyFiles/MyDocument.txt', {
          length: 20
        })
      ).toEqual('/Users/Me/Desktop...');
    });

    it('shortenUri should work correctly', () => {
      expect(TemplateHelpers.getHelper('shortenUri')('http://mywebsite.com/mypage/myarticle', 20)).toEqual('http://mywebsite....');
    });

    it('shortenUriv2 should work correctly', () => {
      expect(
        TemplateHelpers.getHelper('shortenUriv2')('http://mywebsite.com/mypage/myarticle', {
          length: 20
        })
      ).toEqual('http://mywebsite....');
    });

    it('highlight should work correctly', () => {
      let highlights: IHighlight[] = [
        {
          offset: 2,
          length: 6
        }
      ];
      expect(TemplateHelpers.getHelper('highlight')('a string that is too long', highlights)).toEqual(
        'a <span class="highlight">string</span> that is too long'
      );
    });

    it('highlightv2 should work correctly', () => {
      let highlights: IHighlight[] = [
        {
          offset: 2,
          length: 6
        }
      ];
      expect(TemplateHelpers.getHelper('highlightv2')('a string that is too long', { highlights })).toEqual(
        'a <span class="highlight">string</span> that is too long'
      );
    });

    it('highlightStreamText should work correctly', () => {
      const toHighlight = 'a b';
      const terms: { [originalTerm: string]: string[] } = { a: [], b: [] };
      expect(TemplateHelpers.getHelper('highlightStreamText')(toHighlight, terms, {})).toEqual(
        '<span class="coveo-highlight" data-highlight-group="1" data-highlight-group-term="a">a</span> <span class="coveo-highlight" data-highlight-group="2" data-highlight-group-term="b">b</span>'
      );
    });

    it('highlightStreamTextv2 should work correctly', () => {
      const toHighlight = 'a b';
      const termsToHighlight: { [originalTerm: string]: string[] } = { a: [], b: [] };

      expect(
        TemplateHelpers.getHelper('highlightStreamTextv2')(toHighlight, {
          termsToHighlight,
          phrasesToHighlight: {}
        })
      ).toEqual(
        '<span class="coveo-highlight" data-highlight-group="1" data-highlight-group-term="a">a</span> <span class="coveo-highlight" data-highlight-group="2" data-highlight-group-term="b">b</span>'
      );
    });

    it('highlightStreamHTML should work correctly', () => {
      const toHighlight = '<div>a b</div>';
      const terms: { [originalTerm: string]: string[] } = { a: [], b: [] };
      expect(TemplateHelpers.getHelper('highlightStreamHTML')(toHighlight, terms, {})).toEqual(
        '<div><span class="coveo-highlight" data-highlight-group="1" data-highlight-group-term="a">a</span> <span class="coveo-highlight" data-highlight-group="2" data-highlight-group-term="b">b</span></div>'
      );
    });

    it('highlightStreamHTMLv2 should work correctly', () => {
      const toHighlight = '<div>a b</div>';
      const termsToHighlight: { [originalTerm: string]: string[] } = { a: [], b: [] };
      expect(
        TemplateHelpers.getHelper('highlightStreamHTMLv2')(toHighlight, {
          termsToHighlight,
          phrasesToHighlight: {}
        })
      ).toEqual(
        '<div><span class="coveo-highlight" data-highlight-group="1" data-highlight-group-term="a">a</span> <span class="coveo-highlight" data-highlight-group="2" data-highlight-group-term="b">b</span></div>'
      );
    });

    it('number should work correctly', () => {
      expect(TemplateHelpers.getHelper('number')(1.3993, 'c1')).toEqual('$1.4');
      expect(TemplateHelpers.getHelper('number')(1.3993, 'n2')).toEqual('1.40');
      expect(TemplateHelpers.getHelper('number')('345')).toEqual('345');
    });

    describe('with date and time related helpers', () => {
      let options: IDateToStringOptions;

      beforeEach(() => {
        options = {
          now: new Date(1980, 2, 11)
        };
      });

      afterEach(() => {
        options = null;
      });

      describe('date', () => {
        it('should work correctly with useTodayYesterdayAndTomorrow', () => {
          options.useTodayYesterdayAndTomorrow = true;
          expect(TemplateHelpers.getHelper('date')(new Date(1980, 2, 11), options)).toEqual('Today');
          expect(TemplateHelpers.getHelper('date')(new Date(1980, 2, 10), options)).toEqual('Yesterday');
          expect(TemplateHelpers.getHelper('date')(new Date(1980, 2, 12), options)).toEqual('Tomorrow');
        });

        it('should work correctly with useWeekdayIfThisWeek', () => {
          options.useWeekdayIfThisWeek = true;
          expect(TemplateHelpers.getHelper('date')(new Date(1980, 2, 9), options)).toEqual('Last Sunday');
          expect(TemplateHelpers.getHelper('date')(new Date(1980, 2, 13), options)).toEqual('Next Thursday');
        });

        it('should work correctly with omitYearIfCurrentOne', () => {
          options.omitYearIfCurrentOne = true;
          expect(TemplateHelpers.getHelper('date')(new Date(1980, 6, 11), options)).toEqual('July 11');
          expect(TemplateHelpers.getHelper('date')(new Date(1981, 3, 11), options)).toEqual('4/11/1981');
        });

        it('should work correctly with useLongDateFormat', () => {
          options.useLongDateFormat = true;
          expect(TemplateHelpers.getHelper('date')(new Date(1981, 3, 11), options)).toEqual('Saturday, April 11, 1981');
        });

        it('should work correctly with correct default options ', () => {
          expect(TemplateHelpers.getHelper('date')(new Date(1981, 3, 11), options)).toEqual('4/11/1981');
        });
      });

      describe('time', () => {
        it('should work with default options', () => {
          expect(TemplateHelpers.getHelper('time')(new Date(1981, 3, 11, 7, 13))).toEqual('7:13 AM');
        });

        it('should return empty string for an undefined value', () => {
          expect(TemplateHelpers.getHelper('time')(undefined, options)).toEqual('');
        });
      });

      describe('dateTime', () => {
        it('should work with includeTimeIfToday', () => {
          options.includeTimeIfToday = true;
          expect(TemplateHelpers.getHelper('dateTime')(new Date(1980, 2, 11, 7, 13), options)).toEqual('Today, 7:13 AM');
        });

        it('should work with includeTimeIfThisWeek', () => {
          options.includeTimeIfThisWeek = true;
          options.useWeekdayIfThisWeek = false;
          expect(TemplateHelpers.getHelper('dateTime')(new Date(1980, 2, 4, 7, 13), options)).toEqual('March 04, 7:13 AM');
          expect(TemplateHelpers.getHelper('dateTime')(new Date(1980, 2, 13, 7, 13), options)).toEqual('March 13, 7:13 AM');
          expect(TemplateHelpers.getHelper('dateTime')(new Date(1980, 2, 3, 7, 13), options)).toEqual('March 03');
        });

        it('should work with alwaysIncludeTime', () => {
          options.alwaysIncludeTime = true;
          expect(TemplateHelpers.getHelper('dateTime')(new Date(1981, 3, 4, 7, 13), options)).toEqual('4/4/1981, 7:13 AM');
        });

        it('should return empty string for an undefined value', () => {
          expect(TemplateHelpers.getHelper('dateTime')(undefined, options)).toEqual('');
        });
      });

      describe('emailDateTime', () => {
        it('should includeTimeIfThisWeek automatically', () => {
          expect(TemplateHelpers.getHelper('emailDateTime')(new Date(1980, 2, 13, 7, 13), options)).toEqual('Next Thursday, 7:13 AM');
        });
      });
    });

    describe('currency', () => {
      it('should work correctly with default options', () => {
        expect(TemplateHelpers.getHelper('currency')(123)).toEqual('$123');
        expect(TemplateHelpers.getHelper('currency')(123.4)).toEqual('$123');
        expect(TemplateHelpers.getHelper('currency')(1234.56)).toEqual('$1,235');
        expect(TemplateHelpers.getHelper('currency')(-123)).toEqual('($123)');
      });

      it('should work correctly with decimal digit options', () => {
        expect(TemplateHelpers.getHelper('currency')(123, { decimals: 0 })).toEqual('$123');
        expect(TemplateHelpers.getHelper('currency')(123, { decimals: 1 })).toEqual('$123.0');
        expect(TemplateHelpers.getHelper('currency')(123, { decimals: 2 })).toEqual('$123.00');
      });

      it('should work correctly with symbol options', () => {
        expect(TemplateHelpers.getHelper('currency')(123, { symbol: 'F' })).toEqual('F123');
      });

      it('should work correctly with an undefined value returning an empty string', () => {
        expect(TemplateHelpers.getHelper('currency')(undefined)).toEqual('');
      });
    });

    describe('timeSpan', () => {
      it('should work with milliseconds', () => {
        expect(TemplateHelpers.getHelper('timeSpan')(1000, <ITimeSpanUtilsOptions>{ isMilliseconds: true })).toEqual('00:01');
        expect(TemplateHelpers.getHelper('timeSpan')(10000, <ITimeSpanUtilsOptions>{ isMilliseconds: true })).toEqual('00:10');
        expect(TemplateHelpers.getHelper('timeSpan')(60000, <ITimeSpanUtilsOptions>{ isMilliseconds: true })).toEqual('01:00');
        expect(TemplateHelpers.getHelper('timeSpan')(600000, <ITimeSpanUtilsOptions>{ isMilliseconds: true })).toEqual('10:00');
      });

      it('should work with seconds', () => {
        expect(TemplateHelpers.getHelper('timeSpan')(1, <ITimeSpanUtilsOptions>{ isMilliseconds: false })).toEqual('00:01');
        expect(TemplateHelpers.getHelper('timeSpan')(10, <ITimeSpanUtilsOptions>{ isMilliseconds: false })).toEqual('00:10');
        expect(TemplateHelpers.getHelper('timeSpan')(60, <ITimeSpanUtilsOptions>{ isMilliseconds: false })).toEqual('01:00');
        expect(TemplateHelpers.getHelper('timeSpan')(600, <ITimeSpanUtilsOptions>{ isMilliseconds: false })).toEqual('10:00');
      });
    });

    describe('email', () => {
      it('should work with name and address', () => {
        expect(TemplateHelpers.getHelper('email')('Foo Bar <foo@bar.com>')).toEqual(
          '<a title="Foo Bar <foo@bar.com>" href="mailto:foo@bar.com">Foo Bar</a>'
        );
      });

      it('should work if the value is an array', () => {
        expect(TemplateHelpers.getHelper('email')(['Foo Bar <foo@bar.com>', 'Foo Baz <foo@baz.com>'])).toEqual(
          '<a title="Foo Bar <foo@bar.com>" href="mailto:foo@bar.com">Foo Bar</a>, <a title="Foo Baz <foo@baz.com>" href="mailto:foo@baz.com">Foo Baz</a>'
        );
      });

      it('should work when we specify a length limit', () => {
        expect(
          TemplateHelpers.getHelper('email')(['Foo Bar <foo@bar.com>', 'Foo Baz <foo@baz.com>'], {
            lengthLimit: 1
          })
        ).toContain('coveo-emails-excess-collapsed');
      });

      it('should work with address only', () => {
        expect(TemplateHelpers.getHelper('email')('foo@bar.com')).toEqual(
          '<a title="foo@bar.com" href="mailto:foo@bar.com">foo@bar.com</a>'
        );
      });

      it('should work with company domain and "me"', () => {
        expect(
          TemplateHelpers.getHelper('email')('Foo Bar <foo@bar.com>', {
            me: 'foo@bar.com',
            companyDomain: 'bar.com'
          })
        ).toEqual('<a title="Foo Bar <foo@bar.com>" href="mailto:foo@bar.com">Me</a>');
      });

      it('should work with list of email address separated by semi-colon', () => {
        expect(TemplateHelpers.getHelper('email')('Foo Bar <foo@bar.com>; spam@stuff.com')).toEqual(
          '<a title="Foo Bar <foo@bar.com>" href="mailto:foo@bar.com">Foo Bar</a>, <a title="spam@stuff.com" href="mailto:spam@stuff.com">spam@stuff.com</a>'
        );
      });
    });

    describe('anchor', () => {
      it('should create a valid anchor', () => {
        expect(TemplateHelpers.getHelper('anchor')('foo bar')).toEqual(`<a href='foo bar' >foo bar</a>`);
      });

      it('should accept target option', () => {
        expect(
          TemplateHelpers.getHelper('anchor')('foo bar', {
            target: '_top'
          })
        ).toEqual(`<a href='foo bar' target="_top">foo bar</a>`);
      });

      it('should accept text option', () => {
        expect(
          TemplateHelpers.getHelper('anchor')('foo bar', {
            text: 'baz'
          })
        ).toEqual(`<a href='foo bar' >baz</a>`);
      });
    });

    describe('image', () => {
      it('should render a valid image', () => {
        expect(TemplateHelpers.getHelper('image')('foo bar')).toEqual("<img src='foo bar' />");
      });

      it('should allow to specify an alt option', () => {
        expect(
          TemplateHelpers.getHelper('image')('foo bar', {
            alt: 'hello'
          })
        ).toEqual('<img src=\'foo bar\' alt="hello"/>');
      });

      it('should allow to specify height', () => {
        expect(
          TemplateHelpers.getHelper('image')('foo bar', {
            height: '100px'
          })
        ).toEqual('<img src=\'foo bar\' height="100px"/>');
      });

      it('should allow to specify width', () => {
        expect(
          TemplateHelpers.getHelper('image')('foo bar', {
            width: '100px'
          })
        ).toEqual('<img src=\'foo bar\' width="100px"/>');
      });
    });

    describe('thumbnail', () => {
      let endpoint: SearchEndpoint;
      let result: IQueryResult;

      beforeEach(() => {
        endpoint = mockSearchEndpoint();
        result = FakeResults.createFakeResult();

        let spy = jasmine.createSpy('getRawDataStream');
        spy.and.returnValue(new Promise((resolve, reject) => {}));
        endpoint.getRawDataStream = spy;
        SearchEndpoint.endpoints['default'] = endpoint;
      });

      afterEach(() => {
        SearchEndpoint.endpoints['default'] = null;
        endpoint = null;
      });

      it('should call the endpoint', () => {
        TemplateHelpers.getHelper('thumbnail')(result);
        expect(endpoint.getRawDataStream).toHaveBeenCalled();
      });

      it('should return a valid img', () => {
        expect(TemplateHelpers.getHelper('thumbnail')(result)).toEqual(`<img data-coveo-uri-hash="${result.raw.urihash}"/>`);
      });
    });

    describe('fromFileTypeToIcon', () => {
      let result: IQueryResult;
      let options: IIconOptions;

      beforeEach(() => {
        result = FakeResults.createFakeResult();
        result.searchInterface.getBindings = () => <any>new MockEnvironmentBuilder().getBindings();
        options = {};
      });

      afterEach(() => {
        result = null;
        options = null;
      });

      it('should return a valid icon image', () => {
        expect(TemplateHelpers.getHelper('fromFileTypeToIcon')(result)).toContain('<div class="coveo-icon filetype');
      });

      it('should be small if specified', () => {
        options.small = true;
        expect(TemplateHelpers.getHelper('fromFileTypeToIcon')(result, options)).toContain('<div class="coveo-small coveo-icon filetype');
      });

      it('should use the specified value', () => {
        options.value = 'coveo-sprites-foo';
        expect(TemplateHelpers.getHelper('fromFileTypeToIcon')(result, options)).toContain('<div class="coveo-icon coveo-sprites-foo');
      });

      it('should use the label if specified', () => {
        options.withLabel = true;
        options.labelValue = 'foo';
        expect(TemplateHelpers.getHelper('fromFileTypeToIcon')(result, options)).toContain('coveo-icon-with-caption-overlay');
        expect(TemplateHelpers.getHelper('fromFileTypeToIcon')(result, options)).toContain(
          '<span class="coveo-icon-caption-overlay">foo</span>'
        );
      });

      it('should not use the label if not specified', () => {
        options.withLabel = false;
        options.labelValue = 'foo';
        expect(TemplateHelpers.getHelper('fromFileTypeToIcon')(result, options)).not.toContain('coveo-icon-with-caption-overlay');
        expect(TemplateHelpers.getHelper('fromFileTypeToIcon')(result, options)).not.toContain(
          '<span class="coveo-icon-caption-overlay">foo</span>'
        );
      });
    });

    describe('size', () => {
      it('should format filesize correctly', () => {
        expect(TemplateHelpers.getHelper('size')(1024)).toEqual('1024 B');
        expect(TemplateHelpers.getHelper('size')(1025)).toEqual('1 KB');
        expect(TemplateHelpers.getHelper('size')(10240)).toEqual('10 KB');
        expect(TemplateHelpers.getHelper('size')(102400)).toEqual('100 KB');
        expect(TemplateHelpers.getHelper('size')(1024000)).toEqual('1000 KB');
      });
    });

    describe('translatedCaption', () => {
      it('should try to get the translated caption for a given filetype', () => {
        expect(TemplateHelpers.getHelper('translatedCaption')('html')).toEqual('HTML File');
        expect(TemplateHelpers.getHelper('translatedCaption')('doc')).toEqual('Document');
      });
    });

    describe('encodeCarriageReturn', () => {
      it('should replace carriage return with a &lt;br /&gt; tag', () => {
        expect(TemplateHelpers.getHelper('encodeCarriageReturn')('this contains a carriage \n return')).toEqual(
          'this contains a carriage <br/> return'
        );
      });
    });

    describe('isMobileDevice', () => {
      it('should return information about the device', () => {
        expect(TemplateHelpers.getHelper('isMobileDevice')()).toBeNull();
      });
    });
  });
}

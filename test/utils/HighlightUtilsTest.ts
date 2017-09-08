import { IHighlight } from '../../src/rest/Highlight';
import { HighlightUtils } from '../../src/utils/HighlightUtils';
import { StringAndHoles } from '../../src/utils/HighlightUtils';

export function HighlightUtilsTest() {
  describe('HighlightUtils', function() {
    const lorem = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut';
    const uri = 'http://onlinehelp.coveo.com/en/CES/7.0/Administrator/Moving_the_Index_to_a_Different_Drive.htm';
    const netPath = '\\\\Programmes\\Ces\\config\\sources\\salesforce';
    const localPath = 'C:\\Programmes\\Ces\\config\\sources\\salesforce';

    describe('highlightString', function() {
      it('should wrap the passed highlights with tags using the specified class name', function() {
        let highlights: IHighlight[] = [
          { offset: 3, length: 5 },
          { offset: 10, length: 4 },
          { offset: 18, length: 15 },
          { offset: 45, length: 10 }
        ];
        let expectedHighlight =
          'Lor<span class="coveo-highlight">em ip</span>su<span class="coveo-highlight">m do</span>lor <span class="coveo-highlight">sit amet, conse</span>ctetur adipi<span class="coveo-highlight">sicing eli</span>t, sed do eiusmod tempor incididunt ut';
        expect(HighlightUtils.highlightString(lorem, highlights, null, 'coveo-highlight')).toBe(expectedHighlight);
      });

      it("should ignore highlights that are out of a shortened string's bounds", function() {
        let shortenedString: StringAndHoles = StringAndHoles.shortenString(lorem, 35, '...');
        let highlights: IHighlight[] = [
          { offset: 3, length: 5 },
          { offset: 10, length: 4 },
          { offset: 18, length: 15 },
          { offset: 45, length: 10 }
        ];
        let expectedHighlight =
          'Lor<span class="coveo-highlight">em ip</span>su<span class="coveo-highlight">m do</span>lor <span class="coveo-highlight">sit amet,</span>...';
        let highlightedString = HighlightUtils.highlightString(shortenedString.value, highlights, shortenedString.holes, 'coveo-highlight');
        expect(highlightedString).toBe(expectedHighlight);
      });

      it("should ignore highlights that are out of a shortened local path's bounds", function() {
        let shortenedString: StringAndHoles = StringAndHoles.shortenPath(localPath, 15);
        let highlights: IHighlight[] = [
          { offset: 3, length: 5 },
          { offset: 10, length: 4 },
          { offset: 18, length: 15 },
          { offset: 45, length: 10 }
        ];
        let expectedHighlight = 'C:\\...<span class="coveo-highlight">ces\\</span>sa...';
        let highlightedString = HighlightUtils.highlightString(shortenedString.value, highlights, shortenedString.holes, 'coveo-highlight');
        expect(highlightedString).toBe(expectedHighlight);

        shortenedString = StringAndHoles.shortenPath(localPath, 30);
        expectedHighlight = 'C:\\...<span class="coveo-highlight">fig\\sources\\</span>salesforce';
        highlightedString = HighlightUtils.highlightString(shortenedString.value, highlights, shortenedString.holes, 'coveo-highlight');
        expect(highlightedString).toBe(expectedHighlight);
      });

      it("should ignore highlights that are out of a shortened network path's bounds", function() {
        let shortenedString: StringAndHoles = StringAndHoles.shortenPath(netPath, 30);
        let highlights: IHighlight[] = [
          { offset: 3, length: 5 },
          { offset: 10, length: 4 },
          { offset: 16, length: 15 },
          { offset: 45, length: 10 }
        ];
        let expectedHighlight = '\\\\...<span class="coveo-highlight">ig\\sources\\</span>salesforce';
        let highlightedString = HighlightUtils.highlightString(shortenedString.value, highlights, shortenedString.holes, 'coveo-highlight');
        expect(highlightedString).toBe(expectedHighlight);
      });

      it("should ignore highlights that are out of a shortened uri's bounds", function() {
        let shortenedString: StringAndHoles = StringAndHoles.shortenUri(uri, 60);
        let highlights: IHighlight[] = [{ offset: 12, length: 4 }, { offset: 18, length: 15 }, { offset: 45, length: 10 }];
        let expectedHighlight =
          'http://onlin<span class="coveo-highlight">ehel</span>p.<span class="coveo-highlight">coveo.com/</span>...<span class="coveo-highlight">/Mo</span>ving_the_Index_to_a_Dif...';
        let highlightedString = HighlightUtils.highlightString(shortenedString.value, highlights, shortenedString.holes, 'coveo-highlight');
        expect(highlightedString).toBe(expectedHighlight);
      });
    });

    describe('shortenString', function() {
      it('should shorten the string to the specified number of characters and append the specified value', function() {
        let shortenedString = StringAndHoles.shortenString(lorem, 60, '...');
        expect(shortenedString).toEqual(
          jasmine.objectContaining({
            value: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit,...',
            holes: [{ begin: 57, size: 36, replacementSize: 3 }]
          })
        );
      });

      it('should not shorten string that is shorter than the specified value', function() {
        let shortenedString = StringAndHoles.shortenString(lorem, 9000, '...');
        expect(shortenedString.value).toBe(lorem);
        expect(shortenedString.holes).toBeUndefined();
      });
    });

    describe('shortenPath', function() {
      it('should shorten local path properly', function() {
        let shortenedPath = StringAndHoles.shortenPath(localPath, 30);
        expect(shortenedPath).toEqual(
          jasmine.objectContaining({
            value: 'C:\\...fig\\sources\\salesforce',
            holes: [{ begin: 3, size: 18, replacementSize: 3 }]
          })
        );
      });

      it('should shorten network path properly', function() {
        let shortenedNetPath = StringAndHoles.shortenPath(netPath, 30);
        expect(shortenedNetPath).toEqual(
          jasmine.objectContaining({
            value: '\\\\...ig\\sources\\salesforce',
            holes: [{ begin: 2, size: 18, replacementSize: 3 }]
          })
        );
      });

      it('should shorten network path to an absurd amount', function() {
        let shortenedNetPath = StringAndHoles.shortenPath(netPath, 15);
        expect(shortenedNetPath).toEqual(
          jasmine.objectContaining({
            value: '\\\\...es\\sale...',
            holes: [{ begin: 2, size: 26, replacementSize: 3 }, { begin: 12, size: 6, replacementSize: 3 }]
          })
        );
      });
    });

    describe('shortenUri', function() {
      it('should shorten an uri properly', function() {
        let shortenedUri = StringAndHoles.shortenUri(uri, 60);
        expect(shortenedUri).toEqual(
          jasmine.objectContaining({
            value: 'http://onlinehelp.coveo.com/.../Moving_the_Index_to_a_Dif...',
            holes: [{ begin: 28, size: 24, replacementSize: 3 }, { begin: 57, size: 16, replacementSize: 3 }]
          })
        );
      });

      it('should shorten an uri to an absurd amount', function() {
        let shortenedUri = StringAndHoles.shortenUri(uri, 15);
        expect(shortenedUri).toEqual(
          jasmine.objectContaining({
            value: 'http://onlin...',
            holes: [{ begin: 28, size: 24, replacementSize: 3 }, { begin: 12, size: 61, replacementSize: 3 }]
          })
        );
      });

      it('should not strip end characters if there is enough room for them', function() {
        let shortenedUri = StringAndHoles.shortenUri(uri, 80);
        expect(shortenedUri).toEqual(
          jasmine.objectContaining({
            value: 'http://onlinehelp.coveo.com/.../Moving_the_Index_to_a_Different_Drive.htm',
            holes: [{ begin: 28, size: 24, replacementSize: 3 }]
          })
        );
      });
    });
  });
}

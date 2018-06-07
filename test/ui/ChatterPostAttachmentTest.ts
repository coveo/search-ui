import * as Mock from '../MockEnvironment';
import { ChatterPostAttachment } from '../../src/ui/ChatterPostAttachment/ChatterPostAttachment';
import { FakeResults } from '../Fake';
import { IChatterPostAttachmentOption } from '../../src/ui/ChatterPostAttachment/ChatterPostAttachment';
import { ChatterUtils } from '../../src/utils/ChatterUtils';
import { $$ } from '../../src/utils/Dom';
import { l } from '../../src/strings/Strings';
import { IQueryResult } from '../../src/rest/QueryResult';

export function ChatterPostAttachmentTest() {
  describe('ChatterPostAttachment', () => {
    let test: Mock.IBasicComponentSetup<ChatterPostAttachment>;
    let result: IQueryResult;
    const generateResult = function(sfcontentfilename: string, sftitle: string, sf_title: string) {
      result = FakeResults.createFakeFeedItemResult('token', 0, 0, true);
      result.raw.sfcontentfilename = sfcontentfilename;
      result.raw.sftitle = sftitle;
      result.raw.sf_title = sf_title;
      test = Mock.optionsResultComponentSetup<ChatterPostAttachment, IChatterPostAttachmentOption>(
        ChatterPostAttachment,
        <IChatterPostAttachmentOption>{},
        result
      );
    };

    it('should behave correctly with no data', () => {
      result = FakeResults.createFakeFeedItemResult('token', 0, 0, true);
      test = Mock.optionsResultComponentSetup<ChatterPostAttachment, IChatterPostAttachmentOption>(
        ChatterPostAttachment,
        <IChatterPostAttachmentOption>{},
        result
      );
      expect($$($$(test.cmp.element).find('a')).text()).toContain(result.raw.sfcontentfilename);
      expect(
        $$(test.cmp.element)
          .find('a')
          .getAttribute('href')
      ).toContain(ChatterUtils.buildURI(result.clickUri, result.raw.sffeeditemid, result.raw.sfcontentversionid));
    });
    it('should use sfcontentfilename if present', () => {
      generateResult('foo', 'bar', 'baz');
      expect($$($$(test.cmp.element).find('a')).text()).toContain(result.raw.sfcontentfilename);
    });
    it('should use sftitle if sfcontentfilename is not present', () => {
      generateResult(undefined, 'bar', 'baz');
      expect($$($$(test.cmp.element).find('a')).text()).toContain(result.raw.sftitle);
    });
    it('should use sf_title if sftitle and sfcontentfilename are not present', () => {
      generateResult(undefined, undefined, 'baz');
      expect($$($$(test.cmp.element).find('a')).text()).toContain(result.raw.sf_title);
    });
    it('should behave correctly with no filename but with a contentversionid', () => {
      generateResult(undefined, undefined, undefined);
      expect($$($$(test.cmp.element).find('a')).text()).toContain(l('ShowAttachment'));
    });
  });
}

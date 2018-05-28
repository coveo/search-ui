import { l } from '../../src/strings/Strings';
import { ChatterPostAttachment, IChatterPostAttachmentOption } from '../../src/ui/ChatterPostAttachment/ChatterPostAttachment';
import { ChatterUtils } from '../../src/utils/ChatterUtils';
import { $$ } from '../../src/utils/Dom';
import { FakeResults, Mock } from '../../testsFramework/TestsFramework';

export function ChatterPostAttachmentTest() {
  describe('ChatterPostAttachment', () => {
    let test: Mock.IBasicComponentSetup<ChatterPostAttachment>;

    it('should behave correctly with no data', () => {
      let result = FakeResults.createFakeFeedItemResult('token', 0, 0, true);
      test = Mock.optionsResultComponentSetup<ChatterPostAttachment, IChatterPostAttachmentOption>(
        ChatterPostAttachment,
        {} as IChatterPostAttachmentOption,
        result
      );
      expect($$($$(test.cmp.element).find('a')).text()).toContain(result.raw.sfcontentfilename);
      expect(
        $$(test.cmp.element)
          .find('a')
          .getAttribute('href')
      ).toContain(ChatterUtils.buildURI(result.clickUri, result.raw.sffeeditemid, result.raw.sfcontentversionid));
    });

    it('should behave correctly with no filename but with a contentversionid', () => {
      let result = FakeResults.createFakeFeedItemResult('token', 0, 0, true);
      result.raw.sfcontentfilename = undefined;
      test = Mock.optionsResultComponentSetup<ChatterPostAttachment, IChatterPostAttachmentOption>(
        ChatterPostAttachment,
        <IChatterPostAttachmentOption>{},
        result
      );
      expect($$($$(test.cmp.element).find('a')).text()).toContain(l('ShowAttachment'));
    });
  });
}

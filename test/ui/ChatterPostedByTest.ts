import * as Mock from '../MockEnvironment';
import { ChatterPostedBy } from '../../src/ui/ChatterPostedBy/ChatterPostedBy';
import { FakeResults } from '../Fake';
import { IChatterPostedByOption } from '../../src/ui/ChatterPostedBy/ChatterPostedBy';
import { l } from '../../src/strings/Strings';
import { ChatterUtils } from '../../src/utils/ChatterUtils';
import { $$ } from '../../src/utils/Dom';

export function ChatterPostedByTest() {
  describe('ChatterPostedBy', () => {
    let test: Mock.IBasicComponentSetup<ChatterPostedBy>;

    it('should behave correctly with no parameters', () => {
      let result = FakeResults.createFakeFeedItemResult('token');
      result.raw.sfparentid = undefined;
      result.raw.sfparentname = undefined;
      test = Mock.optionsResultComponentSetup<ChatterPostedBy, IChatterPostedByOption>(ChatterPostedBy, <IChatterPostedByOption>{}, result);
      expect($$($$(test.cmp.element).find('span')).text()).toContain(`${l('PostedBy')} `);
      expect(
        $$(test.cmp.element)
          .find('a')
          .getAttribute('href')
      ).toContain(ChatterUtils.buildURI(result.clickUri, result.raw.sffeeditemid, result.raw.sfcreatedbyid));
      expect($$($$(test.cmp.element).find('a')).text()).toContain(result.raw.sfcreatedby);
    });

    it('should behave correctly with no parameters but with a parent relationship', () => {
      let result = FakeResults.createFakeFeedItemResult('token');
      test = Mock.optionsResultComponentSetup<ChatterPostedBy, IChatterPostedByOption>(ChatterPostedBy, <IChatterPostedByOption>{}, result);
      expect($$($$(test.cmp.element).findAll('span')[1]).text()).toContain(` ${l('On').toLowerCase()} `);
      expect(
        $$(test.cmp.element)
          .findAll('a')[1]
          .getAttribute('href')
      ).toContain(ChatterUtils.buildURI(result.clickUri, result.raw.sffeeditemid, result.raw.sfparentid));
      expect($$($$(test.cmp.element).findAll('a')[1]).text()).toContain(result.raw.sfparentname);
    });

    it('should behave correctly with the enablePostedOn parameter with parent relationship', () => {
      let result = FakeResults.createFakeFeedItemResult('token');
      test = Mock.optionsResultComponentSetup<ChatterPostedBy, IChatterPostedByOption>(
        ChatterPostedBy,
        <IChatterPostedByOption>{ enablePostedOn: false },
        result
      );

      expect($$(test.cmp.element).findAll('span')[0]).toBeDefined();
      expect($$(test.cmp.element).findAll('a')[1]).toBeUndefined();
    });
  });
}

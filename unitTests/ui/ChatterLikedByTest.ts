import * as Mock from '../MockEnvironment';
import { ChatterLikedBy } from '../../src/ui/ChatterLikedBy/ChatterLikedBy';
import { FakeResults } from '../Fake';
import { IChatterLikedByOptions } from '../../src/ui/ChatterLikedBy/ChatterLikedBy';
import { ChatterUtils } from '../../src/utils/ChatterUtils';
import { $$ } from '../../src/utils/Dom';
import { l } from '../../src/strings/Strings';

export function ChatterLikedByTest() {
  describe('ChatterLikedBy', () => {
    let test: Mock.IBasicComponentSetup<ChatterLikedBy>;

    beforeEach(() => {
      test = null;
    });

    afterEach(() => {
      test = null;
    });

    it('should behave correctly with no data', () => {
      test = Mock.basicResultComponentSetup<ChatterLikedBy>(ChatterLikedBy);
      expect(test.cmp.element.innerHTML).toBe('');
    });

    it('should behave correctly with a single like', () => {
      let result = FakeResults.createFakeFeedItemResult('token', 1);
      test = Mock.optionsResultComponentSetup<ChatterLikedBy, IChatterLikedByOptions>(ChatterLikedBy, <IChatterLikedByOptions>{}, result);
      expect(
        $$(test.cmp.element)
          .find('a')
          .getAttribute('href')
      ).toEqual(ChatterUtils.buildURI(result.clickUri, result.raw.sffeeditemid, result.raw.sflikedbyid));
      expect($$($$(test.cmp.element).find('a')).text()).toEqual(result.raw.sflikedby);
    });

    it('should behave correctly with multiple likes', () => {
      let result = FakeResults.createFakeFeedItemResult('token', 2);
      test = Mock.optionsResultComponentSetup<ChatterLikedBy, IChatterLikedByOptions>(ChatterLikedBy, <IChatterLikedByOptions>{}, result);

      expect(
        $$(test.cmp.element)
          .find('a')
          .getAttribute('href')
      ).toEqual(ChatterUtils.buildURI(result.clickUri, result.raw.sffeeditemid, 'LikeId1'));
      expect($$($$(test.cmp.element).find('a')).text()).toEqual('LikeName1');
      expect($$($$(test.cmp.element).find('span')).text()).toContain(`LikeName1 ${l('And').toLowerCase()} LikeName2`);
      expect(
        $$(test.cmp.element)
          .findAll('a')[1]
          .getAttribute('href')
      ).toEqual(ChatterUtils.buildURI(result.clickUri, result.raw.sffeeditemid, 'LikeId2'));
      expect($$($$(test.cmp.element).findAll('a')[1]).text()).toEqual('LikeName2');
    });

    it('should behave correctly with number of likes greater than max like to show', () => {
      let result = FakeResults.createFakeFeedItemResult('token', 3);
      test = Mock.optionsResultComponentSetup<ChatterLikedBy, IChatterLikedByOptions>(
        ChatterLikedBy,
        <IChatterLikedByOptions>{ nbLikesToRender: 2 },
        result
      );
      expect($$($$(test.cmp.element).findAll('a')[2]).text()).toContain(
        `${l('Others', (result.raw.sflikecount - 2).toString(), result.raw.sflikecount - 2)}`
      );
    });

    it('Test behaviour when nbLikeToRender is set to 0 with multiple likes', () => {
      let result = FakeResults.createFakeFeedItemResult('token', 3);
      test = Mock.optionsResultComponentSetup<ChatterLikedBy, IChatterLikedByOptions>(
        ChatterLikedBy,
        <IChatterLikedByOptions>{ nbLikesToRender: 0 },
        result
      );
      expect(
        $$(test.cmp.element)
          .findAll('a')[0]
          .getAttribute('href')
      ).toEqual(ChatterUtils.buildURI(result.clickUri, result.raw.sffeeditemid, 'LikeId1'));
      expect($$($$(test.cmp.element).findAll('a')[0]).text()).toEqual('LikeName1');
      expect($$($$(test.cmp.element).findAll('span')[1]).text()).toContain(', ');
      expect(
        $$(test.cmp.element)
          .findAll('a')[1]
          .getAttribute('href')
      ).toContain(ChatterUtils.buildURI(result.clickUri, result.raw.sffeeditemid, 'LikeId2'));
      expect($$($$(test.cmp.element).findAll('a')[1]).text()).toContain('LikeName2');
      expect($$($$(test.cmp.element).findAll('span')[2]).text()).toContain(` ${l('And').toLowerCase()} `);
      expect(
        $$(test.cmp.element)
          .findAll('a')[2]
          .getAttribute('href')
      ).toContain(ChatterUtils.buildURI(result.clickUri, result.raw.sffeeditemid, 'LikeId3'));
      expect($$($$(test.cmp.element).findAll('a')[2]).text()).toContain('LikeName3');
    });
  });
}

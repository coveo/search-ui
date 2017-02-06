import * as Mock from '../MockEnvironment';
import {ResultAttachments} from '../../src/ui/ResultAttachments/ResultAttachments';
import {UnderscoreTemplate} from '../../src/ui/Templates/UnderscoreTemplate';
import {IResultAttachmentsOptions} from '../../src/ui/ResultAttachments/ResultAttachments';
import {FakeResults} from '../Fake';
import {$$} from '../../src/utils/Dom';
import {IQueryResult} from '../../src/rest/QueryResult';

export function ResultAttachmentsTest() {
  describe('ResultAttachments', function () {
    let test: Mock.IBasicComponentSetup<ResultAttachments>;

    beforeEach(function () {
      test = Mock.basicResultComponentSetup<ResultAttachments>(ResultAttachments);
    });

    afterEach(function () {
      test = null;
    });

    describe('exposes options', function () {
      it('resultTemplate should render the top-level attachments using the specified template', function () {
        let template = UnderscoreTemplate.fromString('foo', {});
        test = Mock.optionsResultComponentSetup<ResultAttachments, IResultAttachmentsOptions>(ResultAttachments, <IResultAttachmentsOptions>{
          resultTemplate: template
        }, FakeResults.createFakeResultWithAttachments('test', 1));

        expect($$(test.cmp.element).find('.coveo-result-attachments-container').innerHTML).toEqual(template.instantiateToString(<IQueryResult>{}));
      });

      it('subResultTemplate should render the sub-attachments using the specified template', function () {
        let subTemplate = UnderscoreTemplate.fromString('foobar', {});
        test = Mock.optionsResultComponentSetup<ResultAttachments, IResultAttachmentsOptions>(ResultAttachments, <IResultAttachmentsOptions>{
          subResultTemplate: subTemplate
        }, FakeResults.createFakeResultWithAttachments('t', 1, undefined, undefined, undefined, true));

        let subAttachments = $$(test.cmp.element).find('.coveo-result-attachments-container > .CoveoResultAttachments');
        expect(subAttachments.children.length).toBe(3);
        expect((<HTMLElement>subAttachments.firstChild).innerHTML).toEqual(subTemplate.instantiateToString(<IQueryResult>{}));
      });

      it('maximumAttachmentLevel should render sub-attachments up until the specified level', function () {
        let fakeResult = FakeResults.createFakeResultWithAttachments('t', 1, undefined, undefined, undefined, true);
        fakeResult.attachments[0] = FakeResults.createFakeResultWithAttachments('t', 1, undefined, undefined, undefined, true);
        fakeResult.attachments[0].attachments[0] = FakeResults.createFakeResultWithAttachments('t', 1, undefined, undefined, undefined, true);

        test = Mock.optionsResultComponentSetup<ResultAttachments, IResultAttachmentsOptions>(ResultAttachments, <IResultAttachmentsOptions>{
          maximumAttachmentLevel: 1
        }, fakeResult);

        let levelOneSubAttachments = $$(test.cmp.element).find('.CoveoResultAttachments');
        expect(levelOneSubAttachments).not.toBeNull();

        let levelTwoSubAttachments = $$(levelOneSubAttachments).find('.CoveoResultAttachments');
        expect(levelTwoSubAttachments).toBeNull();
      });
    });

    it('should be an empty div when there are no attachments', function () {
      expect(test.cmp.element.children.length).toBe(0);
    });

    it('should not be an empty div when there are attachments', function () {
      test = Mock.advancedResultComponentSetup<ResultAttachments>(
        ResultAttachments,
        FakeResults.createFakeResultWithAttachments('t', 3),
        undefined);
      expect(test.cmp.element.children.length).toBe(3);
    });
  });
}

import * as Mock from '../MockEnvironment';
import { ResultAttachments } from '../../src/ui/ResultAttachments/ResultAttachments';
import { UnderscoreTemplate } from '../../src/ui/Templates/UnderscoreTemplate';
import { IResultAttachmentsOptions } from '../../src/ui/ResultAttachments/ResultAttachments';
import { FakeResults } from '../Fake';
import { $$ } from '../../src/utils/Dom';
import { IQueryResult } from '../../src/rest/QueryResult';
import { Defer } from '../../src/misc/Defer';

export function ResultAttachmentsTest() {
  describe('ResultAttachments', () => {
    let test: Mock.IBasicComponentSetup<ResultAttachments>;

    beforeEach(() => {
      test = Mock.basicResultComponentSetup<ResultAttachments>(ResultAttachments);
    });

    afterEach(() => {
      test = null;
    });

    describe('exposes options', () => {
      it('resultTemplate should render the top-level attachments using the specified template', done => {
        let template = UnderscoreTemplate.fromString('foo', {});
        test = Mock.optionsResultComponentSetup<ResultAttachments, IResultAttachmentsOptions>(
          ResultAttachments,
          <IResultAttachmentsOptions>{
            resultTemplate: template
          },
          FakeResults.createFakeResultWithAttachments('test', 1)
        );
        Defer.defer(() => {
          expect($$(test.cmp.element).find('.coveo-result-attachments-container').innerHTML).toEqual(
            template.instantiateToString(<IQueryResult>{})
          );
          done();
        });
      });

      it('subResultTemplate should render the sub-attachments using the specified template', done => {
        let subTemplate = UnderscoreTemplate.fromString('foobar', {});
        test = Mock.optionsResultComponentSetup<ResultAttachments, IResultAttachmentsOptions>(
          ResultAttachments,
          <IResultAttachmentsOptions>{
            subResultTemplate: subTemplate
          },
          FakeResults.createFakeResultWithAttachments('t', 1, undefined, undefined, undefined, true)
        );

        Defer.defer(() => {
          let subAttachments = $$(test.cmp.element).find('.coveo-result-attachments-container > .CoveoResultAttachments');
          expect(subAttachments.children.length).toBe(3);
          expect((<HTMLElement>subAttachments.firstChild).innerHTML).toEqual(subTemplate.instantiateToString(<IQueryResult>{}));
          done();
        });
      });

      it('maximumAttachmentLevel should render sub-attachments up until the specified level', done => {
        let fakeResult = FakeResults.createFakeResultWithAttachments('t', 1, undefined, undefined, undefined, true);
        fakeResult.attachments[0] = FakeResults.createFakeResultWithAttachments('t', 1, undefined, undefined, undefined, true);
        fakeResult.attachments[0].attachments[0] = FakeResults.createFakeResultWithAttachments(
          't',
          1,
          undefined,
          undefined,
          undefined,
          true
        );

        test = Mock.optionsResultComponentSetup<ResultAttachments, IResultAttachmentsOptions>(
          ResultAttachments,
          <IResultAttachmentsOptions>{
            maximumAttachmentLevel: 1
          },
          fakeResult
        );

        Defer.defer(() => {
          let levelOneSubAttachments = $$(test.cmp.element).find('.CoveoResultAttachments');
          expect(levelOneSubAttachments).not.toBeNull();

          let levelTwoSubAttachments = $$(levelOneSubAttachments).find('.CoveoResultAttachments');
          expect(levelTwoSubAttachments).toBeNull();
          done();
        });
      });
    });

    it('should be an empty div when there are no attachments', done => {
      Defer.defer(() => {
        expect(test.cmp.element.children.length).toBe(0);
        done();
      });
    });

    it('should not be an empty div when there are attachments', done => {
      test = Mock.advancedResultComponentSetup<ResultAttachments>(
        ResultAttachments,
        FakeResults.createFakeResultWithAttachments('t', 3),
        undefined
      );
      Defer.defer(() => {
        expect(test.cmp.element.children.length).toBe(3);
        done();
      });
    });
  });
}

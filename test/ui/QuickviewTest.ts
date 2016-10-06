import * as Mock from '../MockEnvironment';
import {Quickview, IQuickviewOptions} from '../../src/ui/Quickview/Quickview';
import {Dom, $$} from '../../src/utils/Dom';
import {FakeResults} from '../Fake';
import {IQueryResult} from '../../src/rest/QueryResult';
import {Template} from '../../src/ui/Templates/Template';
import {StringUtils} from '../../src/utils/StringUtils';

export function QuickviewTest() {
  describe('Quickview', () => {
    let test: Mock.IBasicComponentSetup<Quickview>;
    let result: IQueryResult;
    let quickviewTemplateElement: HTMLElement;

    beforeEach(() => {
      result = FakeResults.createFakeResult();
      test = Mock.optionsResultComponentSetup<Quickview, IQuickviewOptions>(Quickview, { contentTemplate: buildTemplate() }, result);
      test.cmp.element = mockOwnerDocument();
    });

    it('creates a modal box on open', () => {
      test.cmp.open();
      let modal = $$(test.cmp.root).find('.coveo-quick-view-full-height');
      expect(modal).not.toBe(null);
    });

    it('closes the modal box on close', () => {
      test.cmp.open();
      test.cmp.close();
      let modal = $$(test.cmp.root).find('.coveo-quick-view-full-height');
      expect(modal).toBe(null);
    });

    it('computes the hash id', () => {
      let hash = test.cmp.getHashId();
      expect(hash).toBe(result.queryUid + '.' + result.index + '.' + StringUtils.hashCode(result.uniqueId));
    });

    function buildTemplate() {
      let template = new Template(() => '<div class="coveo-quick-view-full-height"></div>');
      return template;
    }

    function mockOwnerDocument() {
      let tmp: any = {};
      _.extend(tmp, test.cmp.element);
      tmp.ownerDocument = { body: test.cmp.root };
      return tmp;
    }

  });


}

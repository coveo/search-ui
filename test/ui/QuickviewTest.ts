import * as Mock from '../MockEnvironment';
import {Quickview} from '../../src/ui/Quickview/Quickview';
import {$$} from '../../src/utils/Dom';
import {FakeResults} from '../Fake';
import {IQueryResult} from '../../src/rest/QueryResult';
import {Template} from '../../src/ui/Templates/Template';
import {StringUtils} from '../../src/utils/StringUtils';
import {ModalBox} from '../../src/ExternalModulesShim';

export function QuickviewTest() {
  describe('Quickview', () => {
    let result: IQueryResult;
    let quickview: Quickview;
    let open: jasmine.Spy;
    let close: jasmine.Spy;
    let env: Mock.IMockEnvironment;
    let oldOpen = ModalBox.open;
    let oldClose = ModalBox.close;

    beforeEach(() => {
      let mockBuilder = new Mock.MockEnvironmentBuilder();
      env = mockBuilder.build();
      result = FakeResults.createFakeResult();
      open = jasmine.createSpy('open');
      close = jasmine.createSpy('close');
      oldOpen = ModalBox.open;
      oldClose = ModalBox.close;
      ModalBox.open = open.and.returnValue({
        modalBox: $$('div', undefined, $$('div', { className: 'coveo-wrapper' })).el,
        wrapper: $$('div', undefined, $$('div', { className: 'coveo-quickview-close-button' })).el,
        overlay: $$('div').el,
        content: $$('div').el,
        close: close
      });
      quickview = new Quickview(env.element, { contentTemplate: buildTemplate() }, <any>mockBuilder.getBindings(), result, ModalBox);
    });

    afterEach(() => {
      quickview = null;
      env = null;
      open = null;
      close = null;
      ModalBox.open = oldOpen;
    });

    it('creates a modal box on open', () => {
      quickview.open();
      expect(open).toHaveBeenCalled();
    });

    it('closes the modal box on close', () => {
      quickview.open();
      quickview.close();
      expect(close).toHaveBeenCalled();
    });

    it('computes the hash id', () => {
      let hash = quickview.getHashId();
      expect(hash).toBe(result.queryUid + '.' + result.index + '.' + StringUtils.hashCode(result.uniqueId));
    });

    function buildTemplate() {
      let template = new Template(() => '<div class="coveo-quick-view-full-height"></div>');
      return template;
    }
  });


}

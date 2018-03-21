import { RelevanceInspector } from '../../../src/ui/RelevanceInspector/RelevanceInspector';
import { IComponentBindings } from '../../../src/ui/Base/ComponentBindings';
import { MockEnvironmentBuilder } from '../../MockEnvironment';
import { $$, ResultListEvents } from '../../Test';
import { Simulate } from '../../Simulate';
import { FakeResults } from '../../Fake';
import { IQueryResults } from '../../../src/rest/QueryResults';

export function RelevanceInspectorTest() {
  describe('RelevanceInspector', () => {
    let bindings: IComponentBindings;
    let button: HTMLElement;
    let inspector: RelevanceInspector;
    let modalBox;

    beforeEach(() => {
      bindings = new MockEnvironmentBuilder().withLiveQueryStateModel().build();
      const listFields = jasmine.createSpy('listFields');
      listFields.and.returnValue(Promise.resolve([]));
      bindings.queryController.getEndpoint().listFields = listFields;
      button = $$('button').el;
      inspector = new RelevanceInspector(button, bindings);
      modalBox = Simulate.modalBoxModule();
      inspector.modalBox = modalBox;
    });

    it('should set valid text on the container element', () => {
      expect(button.textContent).toBe('Relevance Inspector');
    });

    it('should open the modal box on click', () => {
      $$(button).trigger('click');
      expect(modalBox.open).toHaveBeenCalled();
    });

    it('should be possible to hide the button', () => {
      inspector.hide();
      expect($$(button).hasClass('coveo-hidden')).toBeTruthy();
    });

    it('should be possible to show the button', () => {
      inspector.hide();
      inspector.show();
      expect($$(button).hasClass('coveo-hidden')).toBeFalsy();
    });

    it('should show the button if the state changes to debug=true', () => {
      bindings.queryStateModel.set('debug', false);
      const spy = spyOn(inspector, 'show');
      bindings.queryStateModel.set('debug', true);
      expect(spy).toHaveBeenCalled();
    });

    it('should hide the button if the state changes to debug=false', () => {
      bindings.queryStateModel.set('debug', true);
      const spy = spyOn(inspector, 'hide');
      bindings.queryStateModel.set('debug', false);
      expect(spy).toHaveBeenCalled();
    });

    it('should not be possible to open the modal box two times rapidly', () => {
      inspector.open();
      inspector.open();
      expect(modalBox.open).toHaveBeenCalledTimes(1);
    });

    describe('when there are no results returned from last query', () => {
      let spy: jasmine.Spy;

      beforeEach(() => {
        spy = jasmine.createSpy('spy');
        spy.and.returnValue(FakeResults.createFakeResults(0));
        bindings.queryController.getLastResults = spy;
        inspector = new RelevanceInspector(button, bindings);
        inspector.modalBox = modalBox;
      });
      it('should not open the modal box', async done => {
        await inspector.open();
        expect(spy).toHaveBeenCalled();
        expect(modalBox.close).toHaveBeenCalled();
        done();
      });
    });

    describe('when there are results returned from last query but it contains no ranking info', () => {
      let spy: jasmine.Spy;

      beforeEach(() => {
        spy = jasmine.createSpy('spy');
        const results = FakeResults.createFakeResults(10);
        results.results[0].rankingInfo = null;
        spy.and.returnValue(results);
        bindings.queryController.getLastResults = spy;
        inspector = new RelevanceInspector(button, bindings);
        inspector.modalBox = modalBox;
      });
      it('should not open the modal box', async done => {
        await inspector.open();
        expect(spy).toHaveBeenCalled();
        expect(modalBox.close).toHaveBeenCalled();
        done();
      });
    });

    describe('when there are results returned from the last query with ranking info', () => {
      let spy: jasmine.Spy;
      let results: IQueryResults;

      beforeEach(() => {
        spy = jasmine.createSpy('spy');
        results = FakeResults.createFakeResults(10);
        results.results.forEach(result => {
          result.rankingInfo = FakeResults.createRankingInfoWithKeywords();
        });
        spy.and.returnValue(results);
        bindings.queryController.getLastResults = spy;
        inspector = new RelevanceInspector(button, bindings);
        inspector.modalBox = modalBox;
      });
      it('should open the modal box', async done => {
        await inspector.open();
        expect(spy).toHaveBeenCalled();
        expect(modalBox.open).toHaveBeenCalled();
        done();
      });

      it("should not modify the result element on new result displayed if it's not in debug mode", () => {
        bindings.queryStateModel.set('debug', false);
        const element = $$('div');
        $$(bindings.root).trigger(ResultListEvents.newResultDisplayed, {
          item: element.el
        });
        expect(element.hasClass('coveo-with-inline-ranking-info')).toBeFalsy();
      });

      it("should not modify the result element on new result displayed if it's not in debug mode", () => {
        bindings.queryStateModel.set('debug', false);
        const element = $$('div');
        $$(bindings.root).trigger(ResultListEvents.newResultDisplayed, {
          item: element.el,
          result: results.results[0]
        });
        expect(element.hasClass('coveo-with-inline-ranking-info')).toBeFalsy();
      });

      it("should modify the result element on new result displayed if it's in debug mode", () => {
        bindings.queryStateModel.set('debug', true);
        const element = $$('div');
        $$(bindings.root).trigger(ResultListEvents.newResultDisplayed, {
          item: element.el,
          result: results.results[0]
        });
        expect(element.hasClass('coveo-with-inline-ranking-info')).toBeTruthy();
      });
    });
  });
}

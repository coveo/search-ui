import * as Mock from '../MockEnvironment';
import { PipelineContext } from '../../src/ui/PipelineContext/PipelineContext';
import { $$ } from '../../src/utils/Dom';
import { Simulate } from '../Simulate';
import { Utils } from '../../src/utils/Utils';

export function PipelineContextText() {
  describe('PipelineContext', () => {
    let test: Mock.IBasicComponentSetup<PipelineContext>;


    afterEach(() => {
      test = null;
    });

    describe('when it is a script tag', () => {
      let scriptTag: HTMLElement;

      beforeEach(() => {
        scriptTag = document.createElement('script');
      });

      afterEach(() => {
        scriptTag = null;
      });

      describe('when it contains valid JSON context', () => {
        let context = {
          'qwerty': 'azerty',
          'a key': 'a value'
        };

        beforeEach(() => {
          $$(scriptTag).text(JSON.stringify(context));

          test = Mock.advancedComponentSetup<PipelineContext>(PipelineContext, new Mock.AdvancedComponentSetupOptions(scriptTag));
        });

        it('should add the JSON content in the query', () => {
          let simulation = Simulate.query(test.env);
          expect(simulation.queryBuilder.build().context).toEqual(jasmine.objectContaining({
            'qwerty': 'azerty',
            'a key': 'a value'
          }));
        });

        it('should return the context keys', () => {
          expect(test.cmp.getContextKeys()).toEqual(jasmine.arrayContaining(['qwerty', 'a key']));
        });

        it('should return the context value', () => {
          expect(test.cmp.getContextValue('qwerty')).toBe('azerty');
        });
      });

      it('should add JSON content in the query if it HTML encoded', () => {
        let context = {
          'qwerty': 'azerty'
        };
        let encoded = Utils.encodeHTMLEntities(JSON.stringify(context));
        $$(scriptTag).text(encoded);

        test = Mock.advancedComponentSetup<PipelineContext>(PipelineContext, new Mock.AdvancedComponentSetupOptions(scriptTag));

        let simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().context).toEqual(jasmine.objectContaining({
          'qwerty': 'azerty'
        }));
      });

      it('should not throw an error if the context is malformed', () => {
        $$(scriptTag).text('this is not JSON');

        expect(() => Mock.advancedComponentSetup<PipelineContext>(PipelineContext, new Mock.AdvancedComponentSetupOptions(scriptTag))).not.toThrowError();
      });
    });

    it('should not throw an error if the context is not a script tag', () => {
      expect(() => test = Mock.basicComponentSetup<PipelineContext>(PipelineContext)).not.toThrowError();
    });
  });
}

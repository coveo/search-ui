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
        const context = {
          qwerty: 'azerty',
          'a key': 'a value',
          'another key': ['multiple', 'values', 'in', 'array']
        };

        beforeEach(() => {
          $$(scriptTag).text(JSON.stringify(context));

          test = Mock.advancedComponentSetup<PipelineContext>(PipelineContext, new Mock.AdvancedComponentSetupOptions(scriptTag));
        });

        it('should add the JSON content in the query', () => {
          const simulation = Simulate.query(test.env);
          expect(simulation.queryBuilder.build().context).toEqual(
            jasmine.objectContaining({
              qwerty: 'azerty',
              'a key': 'a value',
              'another key': ['multiple', 'values', 'in', 'array']
            })
          );
        });

        it('should return the context keys', () => {
          expect(test.cmp.getContextKeys()).toEqual(jasmine.arrayContaining(['qwerty', 'a key']));
        });

        it('should return the context value', () => {
          expect(test.cmp.getContextValue('qwerty')).toBe('azerty');
        });

        it('should support setting a new context', () => {
          test.cmp.setContext({ abc: 'def', hij: ['klm', 'nop'] });
          expect(test.cmp.getContextKeys()).toEqual(jasmine.arrayContaining(['abc', 'hij']));
        });

        it('should support setting a single context value', () => {
          test.cmp.setContextValue('popo', 'qwerty');
          expect(test.cmp.getContextValue('popo')).toEqual('qwerty');
        });

        it('should support setting a single context value as an array', () => {
          test.cmp.setContextValue('123', ['456', '789']);

          expect(test.cmp.getContextValue('123')).toEqual(['456', '789']);
        });

        describe('with a global Coveo.context variable', () => {
          beforeEach(() => {
            Coveo['context'] = {};
            Coveo['context']['productName'] = 'ACME 2000 ULTIMATE EDITION';
            Coveo['context']['userRole'] = 'SYS ADMIN';
          });

          afterEach(() => {
            Coveo['context'] = null;
          });

          it('should support transforming context values', () => {
            test.cmp.setContextValue('someKey', '{!productName}');
            expect(test.cmp.getContextValue('someKey')).toEqual('ACME 2000 ULTIMATE EDITION');
          });

          it('should support transforming context values and trim if needed', () => {
            test.cmp.setContextValue('someKey', '{!  productName   }');
            expect(test.cmp.getContextValue('someKey')).toEqual('ACME 2000 ULTIMATE EDITION');
          });

          it("should support transforming context values when it's from an array", () => {
            test.cmp.setContextValue('someKey', ['foo', '{!productName}', '{!userRole}']);
            expect(test.cmp.getContextValue('someKey')).toEqual(['foo', 'ACME 2000 ULTIMATE EDITION', 'SYS ADMIN']);
          });

          it('should transform the whole context when requesting the context as a whole object', () => {
            test.cmp.setContext({
              someKey: '{!productName}',
              anotherKey: ['{!userRole}', 'foo', 'bar']
            });
            expect(test.cmp.getContext()).toEqual(
              jasmine.objectContaining({
                someKey: 'ACME 2000 ULTIMATE EDITION',
                anotherKey: ['SYS ADMIN', 'foo', 'bar']
              })
            );
          });

          it('should support passing a special context syntax without a global variable value, and returns an empty string', () => {
            test.cmp.setContextValue('someKey', '{!doesNothing}');
            expect(test.cmp.getContextValue('someKey')).toEqual('');
          });
        });
      });

      it('should add JSON content in the query if it HTML encoded', () => {
        const context = {
          qwerty: 'azerty'
        };
        const encoded = Utils.encodeHTMLEntities(JSON.stringify(context));
        $$(scriptTag).text(encoded);

        test = Mock.advancedComponentSetup<PipelineContext>(PipelineContext, new Mock.AdvancedComponentSetupOptions(scriptTag));

        const simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().context).toEqual(
          jasmine.objectContaining({
            qwerty: 'azerty'
          })
        );
      });

      it('should not throw an error if the context is malformed', () => {
        $$(scriptTag).text('this is not JSON');

        expect(() =>
          Mock.advancedComponentSetup<PipelineContext>(PipelineContext, new Mock.AdvancedComponentSetupOptions(scriptTag))
        ).not.toThrowError();
      });
    });

    it('should not throw an error if the context is not a script tag', () => {
      expect(() => (test = Mock.basicComponentSetup<PipelineContext>(PipelineContext))).not.toThrowError();
    });
  });
}

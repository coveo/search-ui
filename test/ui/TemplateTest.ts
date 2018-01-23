import { Template, IInstantiateTemplateOptions } from '../../src/ui/Templates/Template';
import { IQueryResult } from '../../src/rest/QueryResult';
import { FakeResults } from '../Fake';
import { ResponsiveComponents } from '../../src/ui/ResponsiveComponents/ResponsiveComponents';
import { $$ } from '../../src/utils/Dom';
export function TemplateTest() {
  describe('Template', () => {
    let result: IQueryResult;
    let tmpl: Template;

    beforeEach(() => {
      result = FakeResults.createFakeResult();
      tmpl = new Template(() => `Hello World`);
    });

    afterEach(() => {
      result = null;
      tmpl = null;
    });

    describe('with minimal configuration', () => {
      it('should instantiate to string', () => {
        expect(tmpl.instantiateToString(result)).toEqual(`Hello World`);
      });
    });

    describe('with extensive configuration', () => {
      it('should not instantiate to string with false condition check', () => {
        tmpl.condition = () => false;
        expect(tmpl.instantiateToString(result)).toBeNull();
      });

      it('should instantiate to string with a true condition check', () => {
        tmpl.condition = () => true;
        expect(tmpl.instantiateToString(result)).toBe(`Hello World`);
      });

      it('should skip condition check if specified', () => {
        tmpl.condition = () => false;
        expect(tmpl.instantiateToString(result, <IInstantiateTemplateOptions>{ checkCondition: false })).toBe(`Hello World`);
      });

      it('should use conditionToParse if possible, and instantiate if true', () => {
        result.raw['foo'] = 'bar';
        tmpl.conditionToParse = 'raw.foo == "bar"';
        expect(tmpl.instantiateToString(result)).toBe(`Hello World`);
      });

      it('should use conditionToParse if possible, and not instantiate if false', () => {
        result.raw['foo'] = 'nomatch';
        tmpl.conditionToParse = 'raw.foo == "bar"';
        expect(tmpl.instantiateToString(result)).toBeNull();
      });

      it('should use fieldsToMatch if possible, and instantiate if true', () => {
        result.raw['foo'] = 'bar';
        tmpl.fieldsToMatch = [{ field: 'foo', values: ['bar'] }];
        expect(tmpl.instantiateToString(result)).toBe(`Hello World`);
      });

      it('should use fieldsToMatch if possible, and not instantiate if false', () => {
        result.raw['foo'] = 'nomatch';
        tmpl.fieldsToMatch = [{ field: 'foo', values: ['bar'] }];
        expect(tmpl.instantiateToString(result)).toBeNull();
      });

      it('should instantiate to element', done => {
        tmpl.instantiateToElement(result).then(created => {
          expect($$(created).text()).toBe(`Hello World`);
          done();
        });
      });

      it('should correctly return the root HTMLElement when not wrapping in a div', done => {
        tmpl = new Template(() => '<div class="my-stuff"></div>');
        tmpl.instantiateToElement(result, { wrapInDiv: false }).then(created => {
          expect($$(created).hasClass('my-stuff')).toBe(true);
          done();
        });
      });

      it('should correctly return the root HTMLElement when not wrapping in a div even if there is a leading whitespace in the content', done => {
        tmpl = new Template(() => '     <div class="my-stuff"></div>');
        tmpl.instantiateToElement(result, { wrapInDiv: false }).then(created => {
          expect($$(created).hasClass('my-stuff')).toBe(true);
          done();
        });
      });

      it('should add the correct layout class', done => {
        tmpl.layout = 'card';
        tmpl.instantiateToElement(result).then(created => {
          expect($$(created).hasClass('coveo-card-layout')).toBe(true);
          done();
        });
      });

      it('should add the correct layout class when specified in instantiateOptions', done => {
        tmpl.instantiateToElement(result, { currentLayout: 'table' }).then(created => {
          expect($$(created).hasClass('coveo-table-layout')).toBe(true);
          done();
        });
      });

      it('should return the correct type', () => {
        expect(tmpl.getType()).toBe('Template');
      });

      describe('when checking for screen size', () => {
        let responsiveComponents: ResponsiveComponents;

        beforeEach(() => {
          responsiveComponents = new ResponsiveComponents();
        });

        afterEach(() => {
          responsiveComponents = null;
        });

        describe('if explicitly set for mobile', () => {
          beforeEach(() => {
            tmpl.mobile = true;
          });

          it("should not accept a template if it's not small screen width", () => {
            responsiveComponents.isSmallScreenWidth = () => false;
            expect(
              tmpl.instantiateToString(result, <IInstantiateTemplateOptions>{ responsiveComponents: responsiveComponents })
            ).toBeNull();
          });

          it("should accept a template if it's small screen width", () => {
            responsiveComponents.isSmallScreenWidth = () => true;
            expect(tmpl.instantiateToString(result, <IInstantiateTemplateOptions>{ responsiveComponents: responsiveComponents })).toBe(
              `Hello World`
            );
          });
        });

        describe('if explicitly set not for mobile', () => {
          beforeEach(() => {
            tmpl.mobile = false;
          });
          it("should accept a template if it's not small screen width", () => {
            responsiveComponents.isSmallScreenWidth = () => false;
            expect(tmpl.instantiateToString(result, <IInstantiateTemplateOptions>{ responsiveComponents: responsiveComponents })).toBe(
              `Hello World`
            );
          });

          it("should not accept a template if it's small screen width", () => {
            responsiveComponents.isSmallScreenWidth = () => true;
            expect(
              tmpl.instantiateToString(result, <IInstantiateTemplateOptions>{ responsiveComponents: responsiveComponents })
            ).toBeNull();
          });
        });

        describe('if explicitly set for tablet', () => {
          beforeEach(() => {
            tmpl.tablet = true;
          });

          it("should not accept a template if it's not medium screen width", () => {
            responsiveComponents.isMediumScreenWidth = () => false;
            expect(
              tmpl.instantiateToString(result, <IInstantiateTemplateOptions>{ responsiveComponents: responsiveComponents })
            ).toBeNull();
          });

          it("should accept a template if it's medium screen width", () => {
            responsiveComponents.isMediumScreenWidth = () => true;
            expect(tmpl.instantiateToString(result, <IInstantiateTemplateOptions>{ responsiveComponents: responsiveComponents })).toBe(
              `Hello World`
            );
          });
        });

        describe('if explicitly set not for tablet', () => {
          beforeEach(() => {
            tmpl.tablet = false;
          });

          it("should accept a template if it's not medium screen width", () => {
            responsiveComponents.isMediumScreenWidth = () => false;
            expect(tmpl.instantiateToString(result, <IInstantiateTemplateOptions>{ responsiveComponents: responsiveComponents })).toBe(
              `Hello World`
            );
          });

          it("should not accept a template if it's medium screen width", () => {
            responsiveComponents.isMediumScreenWidth = () => true;
            expect(
              tmpl.instantiateToString(result, <IInstantiateTemplateOptions>{ responsiveComponents: responsiveComponents })
            ).toBeNull();
          });
        });

        describe('if explicitly set for desktop', () => {
          beforeEach(() => {
            tmpl.desktop = true;
          });

          it("should not accept a template if it's not large screen width", () => {
            responsiveComponents.isLargeScreenWidth = () => false;
            expect(
              tmpl.instantiateToString(result, <IInstantiateTemplateOptions>{ responsiveComponents: responsiveComponents })
            ).toBeNull();
          });

          it("should accept a template if it's large screen width", () => {
            responsiveComponents.isLargeScreenWidth = () => true;
            expect(tmpl.instantiateToString(result, <IInstantiateTemplateOptions>{ responsiveComponents: responsiveComponents })).toBe(
              `Hello World`
            );
          });
        });

        describe('if explicitly set not for desktop', () => {
          beforeEach(() => {
            tmpl.desktop = false;
          });

          it("should accept a template if it's not large screen width", () => {
            responsiveComponents.isLargeScreenWidth = () => false;
            expect(tmpl.instantiateToString(result, <IInstantiateTemplateOptions>{ responsiveComponents: responsiveComponents })).toBe(
              `Hello World`
            );
          });

          it("should not accept a template if it's large screen width", () => {
            responsiveComponents.isLargeScreenWidth = () => true;
            expect(
              tmpl.instantiateToString(result, <IInstantiateTemplateOptions>{ responsiveComponents: responsiveComponents })
            ).toBeNull();
          });
        });
      });

      describe('when checking for layout', () => {
        it('should not check for layout if not set', () => {
          tmpl.layout = null;
          expect(tmpl.instantiateToString(result, <IInstantiateTemplateOptions>{ currentLayout: 'card' })).toBe(`Hello World`);
        });

        it('should check for layout if set', () => {
          tmpl.layout = 'list';
          expect(tmpl.instantiateToString(result, <IInstantiateTemplateOptions>{ currentLayout: 'card' })).toBeNull();
        });

        it('should not check for layout if not set in the instantiate options', () => {
          tmpl.layout = 'list';
          expect(tmpl.instantiateToString(result)).toBe(`Hello World`);
        });
      });
    });
  });
}

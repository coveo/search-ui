import * as Mock from '../MockEnvironment';
import { TimespanFacet, ITimespanFacetOptions } from '../../src/ui/TimespanFacet/TimespanFacet';
import { FacetRange } from '../../src/ui/FacetRange/FacetRange';

export function TimespanFacetTest() {
  describe('TimespanFacet', () => {
    let test: Mock.IBasicComponentSetup<TimespanFacet>;

    beforeEach(() => {
      test = Mock.basicComponentSetup<TimespanFacet>(TimespanFacet);
    });

    it('should output a working FacetRange', () => {
      expect(test.cmp.facet instanceof FacetRange).toBeTruthy();
    });

    it('should contains prebuilt ranges', () => {
      expect(test.cmp.ranges).toEqual(
        jasmine.arrayContaining([
          {
            start: jasmine.any(Date),
            end: jasmine.any(Date),
            label: jasmine.any(String),
            endInclusive: false
          }
        ])
      );
    });

    it('should pass prebuilt ranges to the underlying facet', () => {
      expect(test.cmp.ranges).toEqual(test.cmp.facet.options.ranges);
    });

    it('should allow to change the ranges programmatically, and pass them to the underlying facet', () => {
      const matcher = jasmine.arrayContaining([
        jasmine.objectContaining({
          label: 'foo'
        })
      ]);
      expect(test.cmp.facet.options.ranges).not.toEqual(matcher);

      test.cmp.ranges = [
        {
          label: 'foo',
          start: new Date(),
          end: new Date(),
          endInclusive: false
        }
      ];

      expect(test.cmp.facet.options.ranges).toEqual(matcher);
    });

    describe('exposes options', () => {
      it('title should pass the correct title option to the underlying facet', () => {
        test = Mock.optionsComponentSetup<TimespanFacet, ITimespanFacetOptions>(TimespanFacet, {
          title: 'A new title'
        });

        expect(test.cmp.facet.options.title).toBe('A new title');
      });

      it('field should pass the correct field option to the underlying facet', () => {
        test = Mock.optionsComponentSetup<TimespanFacet, ITimespanFacetOptions>(TimespanFacet, {
          field: '@anotherField'
        });

        expect(test.cmp.facet.options.field).toBe('@anotherField');
      });

      it('id should pass the correct id option to the underlying facet', () => {
        test = Mock.optionsComponentSetup<TimespanFacet, ITimespanFacetOptions>(TimespanFacet, {
          id: 'Anewid'
        });
        expect(test.cmp.facet.options.id).toBe('Anewid');
      });

      it('id with spaces should get properly trimmed by the underlying facet', () => {
        test = Mock.optionsComponentSetup<TimespanFacet, ITimespanFacetOptions>(TimespanFacet, {
          id: 'A new id'
        });
        expect(test.cmp.facet.options.id).toBe('Anewid');
      });

      it('id should default to the field of the facet', () => {
        test = Mock.optionsComponentSetup<TimespanFacet, ITimespanFacetOptions>(TimespanFacet, {
          field: '@afield'
        });

        expect(test.cmp.facet.options.id).toBe('@afield');
      });

      it('should be currentlyDisplayed by default', () => {
        expect(test.cmp.isCurrentlyDisplayed()).toBeTruthy();
      });

      it('should not be currentlyDisplayed if disabled', () => {
        test.cmp.disable();
        expect(test.cmp.isCurrentlyDisplayed()).toBeFalsy();
      });

      it('should not be currentlyDisplayed if the element is set to display:none', () => {
        test.cmp.element.style.display = 'none';
        expect(test.cmp.isCurrentlyDisplayed()).toBeFalsy();
      });

      it('should not be currentlyDisplayed if the element is set to visibility:hidden', () => {
        test.cmp.element.style.visibility = 'hidden';
        expect(test.cmp.isCurrentlyDisplayed()).toBeFalsy();
      });

      it('should not be currentlyDisplayed if the element has a specific css class set by tab(s)', () => {
        test.cmp.element.className = 'coveo-tab-disabled';
        expect(test.cmp.isCurrentlyDisplayed()).toBeFalsy();
      });
    });
  });
}

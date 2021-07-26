import { IDynamicHierarchicalFacet } from '../../src/ui/DynamicHierarchicalFacet/IDynamicHierarchicalFacet';
import { DynamicHierarchicalFacet } from '../../src/ui/DynamicHierarchicalFacet/DynamicHierarchicalFacet';
import { mockComponent, mock } from '../MockEnvironment';
import {
  DynamicHierarchicalFacetSearchValueRenderer,
  DynamicHierarchicalFacetSearchValueRendererClassNames as ClassNames
} from '../../src/ui/DynamicHierarchicalFacetSearch/DynamicHierarchicalFacetSearchValueRenderer';
import { DynamicHierarchicalFacetSearchValue } from '../../src/ui/DynamicHierarchicalFacetSearch/DynamicHierarchicalFacetSearchValue';
import { l } from '../../src/strings/Strings';
import { $$ } from '../../src/utils/Dom';
import { expectChildren } from '../TestUtils';

function setProperties<T>(obj: T, properties: Partial<T>) {
  Object.keys(properties).forEach(key => (obj[key] = properties[key]));
  return obj;
}

export function DynamicHierarchicalFacetSearchValueRendererTest() {
  describe('DynamicHierarchicalFacetSearchValueRenderer', () => {
    let facetValue: DynamicHierarchicalFacetSearchValue;
    let facet: IDynamicHierarchicalFacet;
    let renderer: DynamicHierarchicalFacetSearchValueRenderer;

    function initializeFacet(): IDynamicHierarchicalFacet {
      facet = mockComponent<DynamicHierarchicalFacet>(DynamicHierarchicalFacet);
      facet.options = {
        field: '@title',
        clearLabel: 'begone'
      };
      return facet;
    }

    function initializeFacetValue(parents: string[] = []): DynamicHierarchicalFacetSearchValue {
      return setProperties((facetValue = mock<DynamicHierarchicalFacetSearchValue>(DynamicHierarchicalFacetSearchValue)), {
        displayValue: 'A B C',
        numberOfResults: 1337,
        fullPath: [...parents, 'abc']
      });
    }

    function initializeRenderer(parents: string[] = []) {
      return (renderer = new DynamicHierarchicalFacetSearchValueRenderer(initializeFacetValue(parents), initializeFacet()));
    }

    describe('without any parent', () => {
      beforeEach(() => {
        initializeRenderer();
      });

      describe('when selected', () => {
        beforeEach(() => {
          renderer.selectAction();
        });

        it('calls facet.selectPath with the full path', () => {
          expect(facet.selectPath).toHaveBeenCalledTimes(1);
          expect(facet.selectPath).toHaveBeenCalledWith(facetValue.fullPath);
        });

        it('calls facet.enableFreezeFacetOrderFlag', () => {
          expect(facet.enableFreezeFacetOrderFlag).toHaveBeenCalledTimes(1);
        });

        it('calls facet.enablePreventAutoSelectionFlag', () => {
          expect(facet.enablePreventAutoSelectionFlag).toHaveBeenCalledTimes(1);
        });

        it('calls facet.scrollToTop', () => {
          expect(facet.scrollToTop).toHaveBeenCalledTimes(1);
        });

        it('calls facet.triggerNewQuery with a function that calls facetValue.logSelectActionToAnalytics', () => {
          expect(facet.triggerNewQuery).toHaveBeenCalledTimes(1);
          const [logAnalytics] = <[Function]>(facet.triggerNewQuery as jasmine.Spy).calls.mostRecent().args;
          expect(logAnalytics).toBeTruthy();

          expect(facetValue.logSelectActionToAnalytics).not.toHaveBeenCalled();
          logAnalytics();
          expect(facetValue.logSelectActionToAnalytics).toHaveBeenCalledTimes(1);
        });
      });

      describe('when rendered', () => {
        let render: HTMLElement;

        beforeEach(() => {
          render = renderer.render();
        });

        it('should have an accessible label', () => {
          const expectedLabel = l(
            'HierarchicalFacetValueIndentedUnder',
            l(
              'IncludeValueWithResultCount',
              facetValue.displayValue,
              l('ResultCount', facetValue.numberOfResults, facetValue.numberOfResults)
            ),
            l('AllCategories')
          );
          expect(render.getAttribute('aria-label')).toEqual(expectedLabel);
        });

        it('should render a value containing a header and a path', () => {
          expect(render.classList).toContain(ClassNames.VALUE_CLASSNAME);
          expectChildren(render, [ClassNames.HEADER_CLASSNAME, ClassNames.PATH_CLASSNAME]);
        });

        it('should render a header containing a label and a count', () => {
          const [header] = $$(render).findClass(ClassNames.HEADER_CLASSNAME);
          expect(header.tagName).toEqual('HEADER');
          expect(header.getAttribute('aria-hidden')).toEqual('true');
          expectChildren(header, [ClassNames.LABEL_CLASSNAME, ClassNames.COUNT_CLASSNAME]);
        });

        it('should render the displayValue', () => {
          const [label] = $$(render).findClass(ClassNames.LABEL_CLASSNAME);
          expect(label.innerText).toEqual(facetValue.displayValue);
        });

        it('should render the right count', () => {
          const [count] = $$(render).findClass(ClassNames.COUNT_CLASSNAME);
          expect(count.innerText).toEqual(`(${facetValue.numberOfResults})`);
        });

        it('should render a path containing only the prefix and the clearLabel', () => {
          const [path] = $$(render).findClass(ClassNames.PATH_CLASSNAME);
          expect(path.getAttribute('aria-hidden')).toEqual('true');
          const [, part] = expectChildren(path, [ClassNames.PATH_PREFIX_CLASSNAME, ClassNames.PATH_PART_CLASSNAME]);
          expect(part.innerText).toEqual(l('AllCategories'));
        });
      });
    });

    describe('rendered with one parent', () => {
      let render: HTMLElement;
      const parentValue = 'stuff';

      beforeEach(() => {
        initializeRenderer([parentValue]);
        render = renderer.render();
      });

      it('should show the parent value in the label', () => {
        const expectedLabel = l(
          'HierarchicalFacetValueIndentedUnder',
          l(
            'IncludeValueWithResultCount',
            facetValue.displayValue,
            l('ResultCount', facetValue.numberOfResults, facetValue.numberOfResults)
          ),
          parentValue
        );
        expect(render.getAttribute('aria-label')).toEqual(expectedLabel);
      });

      it('should render a path containing only the prefix and the parent', () => {
        const [path] = $$(render).findClass(ClassNames.PATH_CLASSNAME);
        const [, part] = expectChildren(path, [ClassNames.PATH_PREFIX_CLASSNAME, ClassNames.PATH_PART_CLASSNAME]);
        expect(part.innerText).toEqual(parentValue);
      });
    });

    describe('rendered with three parents', () => {
      let render: HTMLElement;
      const parentValues = ['i', 'like', 'trains'];

      beforeEach(() => {
        initializeRenderer(parentValues);
        render = renderer.render();
      });

      it('should show every parent value in the label', () => {
        const expectedLabel = l(
          'HierarchicalFacetValueIndentedUnder',
          l(
            'IncludeValueWithResultCount',
            facetValue.displayValue,
            l('ResultCount', facetValue.numberOfResults, facetValue.numberOfResults)
          ),
          parentValues.join(', ')
        );
        expect(render.getAttribute('aria-label')).toEqual(expectedLabel);
      });

      it('should render a path containing three parents, two separators and no ellipse', () => {
        const [path] = $$(render).findClass(ClassNames.PATH_CLASSNAME);
        const [, parent0 /* separator */, , parent1 /* separator */, , parent2] = expectChildren(path, [
          ClassNames.PATH_PREFIX_CLASSNAME,
          ClassNames.PATH_PART_CLASSNAME,
          ClassNames.PATH_SEPARATOR_CLASSNAME,
          ClassNames.PATH_PART_CLASSNAME,
          ClassNames.PATH_SEPARATOR_CLASSNAME,
          ClassNames.PATH_PART_CLASSNAME
        ]);

        expect(parent0.innerText).toEqual(parentValues[0]);
        expect(parent1.innerText).toEqual(parentValues[1]);
        expect(parent2.innerText).toEqual(parentValues[2]);
      });

      it('should give separators the separator role', () => {
        const [path] = $$(render).findClass(ClassNames.PATH_CLASSNAME);
        const [, , /* parent */ firstSeparator] = expectChildren(path, [
          ClassNames.PATH_PREFIX_CLASSNAME,
          ClassNames.PATH_PART_CLASSNAME,
          ClassNames.PATH_SEPARATOR_CLASSNAME,
          ClassNames.PATH_PART_CLASSNAME,
          ClassNames.PATH_SEPARATOR_CLASSNAME,
          ClassNames.PATH_PART_CLASSNAME
        ]);
        expect(firstSeparator.getAttribute('role')).toEqual('separator');
      });
    });

    describe('rendered with four parents', () => {
      let render: HTMLElement;
      const parentValues = ['i', "don't", 'like', 'onions'];

      beforeEach(() => {
        initializeRenderer(parentValues);
        render = renderer.render();
      });

      it('should only show the first and last two values in the label', () => {
        const expectedLabel = l(
          'HierarchicalFacetValueIndentedUnder',
          l(
            'IncludeValueWithResultCount',
            facetValue.displayValue,
            l('ResultCount', facetValue.numberOfResults, facetValue.numberOfResults)
          ),
          [parentValues[0], parentValues[2], parentValues[3]].join(', ')
        );
        expect(render.getAttribute('aria-label')).toEqual(expectedLabel);
      });

      it('should render a path containing the first and the last two parents', () => {
        const [path] = $$(render).findClass(ClassNames.PATH_CLASSNAME);
        const [, parent0 /* separator */ /* ellipsis */ /* separator */, , , , parent2 /* separator */, , parent3] = expectChildren(path, [
          ClassNames.PATH_PREFIX_CLASSNAME,
          ClassNames.PATH_PART_CLASSNAME,
          ClassNames.PATH_SEPARATOR_CLASSNAME,
          ClassNames.PATH_ELLIPSIS_CLASSNAME,
          ClassNames.PATH_SEPARATOR_CLASSNAME,
          ClassNames.PATH_PART_CLASSNAME,
          ClassNames.PATH_SEPARATOR_CLASSNAME,
          ClassNames.PATH_PART_CLASSNAME
        ]);

        expect(parent0.innerText).toEqual(parentValues[0]);
        expect(parent2.innerText).toEqual(parentValues[2]);
        expect(parent3.innerText).toEqual(parentValues[3]);
      });
    });
  });
}

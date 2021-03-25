import { FacetSliderQueryController } from '../../src/controllers/FacetSliderQueryController';
import { IGroupByRequest } from '../../src/rest/GroupByRequest';
import { IFieldOption } from '../../src/ui/Base/IComponentOptions';
import { QueryBuilder } from '../../src/ui/Base/QueryBuilder';
import { FacetSlider } from '../../src/ui/FacetSlider/FacetSlider';
import * as Mock from '../MockEnvironment';

export function FacetSliderQueryControllerTest() {
  describe('FacetSliderQueryController', () => {
    let facet: FacetSlider;
    let controller: FacetSliderQueryController;

    beforeEach(() => {
      facet = Mock.mockComponent<FacetSlider>(FacetSlider);
      facet.options = {};
      facet.bind = <any>{};
      facet.bind.onRootElement = jasmine.createSpy('root');
      facet.options.field = <IFieldOption>'@foo';
      facet.options.start = 0;
      facet.options.end = 100;
      controller = new FacetSliderQueryController(facet);
    });

    afterEach(() => {
      facet = null;
      controller = null;
    });

    it('should allow to compute a filter expression', () => {
      let filter = controller.computeOurFilterExpression([5, 99]);
      expect(filter).toEqual('@foo==5..99');
    });

    it('should allow to compute a filter expression when the facet is inactive', () => {
      let filter = controller.computeOurFilterExpression([0, 100]);
      expect(filter).toBeUndefined();
    });

    it('should allow to compute a filter expression with outer bounds excluded at the end of the range', () => {
      facet.options.excludeOuterBounds = true;
      let filter = controller.computeOurFilterExpression([0, 99]);
      expect(filter).toEqual('@foo<=99');
    });

    it('should allow to compute a filter expression with outer bounds excluded at the start of the range', () => {
      facet.options.excludeOuterBounds = true;
      let filter = controller.computeOurFilterExpression([1, 100]);
      expect(filter).toEqual('@foo>=1');
    });

    it('should allow to compute a filter expression with outer bounds excluded, when both end are active', () => {
      facet.options.excludeOuterBounds = true;
      let filter = controller.computeOurFilterExpression([1, 99]);
      expect(filter).toEqual('@foo==1..99');
    });

    it('should allow to compute a filter expression with outher bounds excluded as a date', () => {
      facet.options.dateField = true;
      facet.options.excludeOuterBounds = true;
      let filter = controller.computeOurFilterExpression([1, 100]);
      expect(filter).toContain(`@foo>="1970`);
    });

    describe('when cloning the request to determine the full range in the index', () => {
      let requestForFullRange;
      let builder: QueryBuilder;

      beforeEach(() => {
        builder = new QueryBuilder();
        (controller.facet.getSliderBoundaryForQuery as jasmine.Spy).and.returnValue([25, 50]);
      });

      describe('with an empty query to clone', () => {
        beforeEach(() => {
          controller.putGroupByIntoQueryBuilder(builder);
          requestForFullRange = builder.groupByRequests[controller.lastGroupByRequestForFullRangeIndex];
        });

        it('should use nosort', () => {
          expect(requestForFullRange.sortCriteria).toBe('nosort');
        });

        it('should use the same field', () => {
          expect(requestForFullRange.field).toBe(facet.options.field);
        });

        it('should request only one value', () => {
          expect(requestForFullRange.maximumNumberOfValues).toBe(1);
        });

        it('should not use any query override', () => {
          expect(requestForFullRange.queryOverride).toBeUndefined();
        });

        it('should not use any constant query override', () => {
          expect(requestForFullRange.constantQueryOverride).toBeUndefined();
        });

        it('should use @uri for advanced query override', () => {
          expect(requestForFullRange.advancedQueryOverride).toBe('@uri');
        });
      });

      describe('with a query containing a constant expression', () => {
        beforeEach(() => {
          builder.constantExpression.add('foo');
          controller.putGroupByIntoQueryBuilder(builder);
          requestForFullRange = builder.groupByRequests[controller.lastGroupByRequestForFullRangeIndex];
        });

        it('should have a constant query override copied from the main request', () => {
          expect(requestForFullRange.constantQueryOverride).toBe('foo');
        });

        it('should not use any advanced query override', () => {
          expect(requestForFullRange.advancedQueryOverride).toBeUndefined();
        });
      });

      it('should use the advanced query override passed in as an option on the component', () => {
        controller.facet.options.queryOverride = 'an override';

        controller.putGroupByIntoQueryBuilder(builder);
        requestForFullRange = builder.groupByRequests[controller.lastGroupByRequestForFullRangeIndex];
        expect(requestForFullRange.advancedQueryOverride).toContain('an override');
      });

      it('should add the constant query override from the existing query', () => {
        builder.constantExpression.add('a constant expression');
        controller.putGroupByIntoQueryBuilder(builder);
        requestForFullRange = builder.groupByRequests[controller.lastGroupByRequestForFullRangeIndex];
        expect(requestForFullRange.constantQueryOverride).toContain('a constant expression');
      });

      it('should contain a special expression to filter out invalid document if the field is a date', () => {
        controller.facet.options.dateField = true;
        controller.putGroupByIntoQueryBuilder(builder);
        requestForFullRange = builder.groupByRequests[controller.lastGroupByRequestForFullRangeIndex];
        expect(requestForFullRange.constantQueryOverride).toContain('@foo>1970');
      });

      it('should contain a special expression to filter out invalid document if the field is a date for the graph request', () => {
        controller.facet.options.dateField = true;
        controller.facet.options.graph = { steps: 10 };
        builder.expression.add('something');

        controller.putGroupByIntoQueryBuilder(builder);
        const requestForGraph = builder.groupByRequests[controller.graphGroupByQueriesIndex];
        expect(requestForGraph.constantQueryOverride).toContain('@foo>1970');
        expect(requestForGraph.queryOverride).toContain('something');
      });
    });

    it('should allow to put the group by into a query builder with simple slider config', () => {
      facet.isSimpleSliderConfig = true;
      const builder = new QueryBuilder();
      controller.putGroupByIntoQueryBuilder(builder);
      expect(builder.groupByRequests).toEqual(
        jasmine.arrayContaining([
          jasmine.objectContaining({
            field: '@foo',
            generateAutomaticRanges: false,
            maximumNumberOfValues: 1,
            rangeValues: jasmine.arrayContaining([
              jasmine.objectContaining({
                start: 0,
                end: 100,
                endInclusive: false
              })
            ])
          })
        ])
      );
    });

    it("should add a group by for graph if needed if it's not a simple slider config", () => {
      facet.isSimpleSliderConfig = false;
      facet.options.graph = {};
      facet.options.graph.steps = 10;
      facet.getSliderBoundaryForQuery = () => [5, 99];

      const builder = new QueryBuilder();
      controller.putGroupByIntoQueryBuilder(builder);
      expect(builder.groupByRequests[0]).toEqual(
        jasmine.objectContaining({
          field: '@foo',
          generateAutomaticRanges: true,
          maximumNumberOfValues: 10,
          advancedQueryOverride: '@uri',
          sortCriteria: 'nosort'
        })
      );
    });

    it('should add a group by for graph using the query override if specified', () => {
      facet.isSimpleSliderConfig = false;
      facet.options.graph = {};
      facet.options.graph.steps = 10;
      facet.options.queryOverride = 'my query override';
      facet.getSliderBoundaryForQuery = () => [5, 99];

      const builder = new QueryBuilder();
      controller.putGroupByIntoQueryBuilder(builder);
      expect(builder.groupByRequests[0]).toEqual(
        jasmine.objectContaining({
          field: '@foo',
          generateAutomaticRanges: true,
          maximumNumberOfValues: 10,
          advancedQueryOverride: 'my query override',
          sortCriteria: 'nosort'
        })
      );
    });

    it('should add a range request if needed for graph', () => {
      facet.isSimpleSliderConfig = true;
      facet.options.graph = {};
      facet.options.graph.steps = 10;
      facet.options.start = 0;
      facet.options.end = 100;
      facet.getSliderBoundaryForQuery = () => [5, 99];

      const builder = new QueryBuilder();
      controller.putGroupByIntoQueryBuilder(builder);
      expect(builder.groupByRequests[0]).toEqual(
        jasmine.objectContaining({
          rangeValues: jasmine.arrayContaining([
            jasmine.objectContaining({
              start: 0,
              end: 10,
              endInclusive: true
            }),
            jasmine.objectContaining({
              start: 10,
              end: 20,
              endInclusive: true
            })
          ])
        })
      );
    });

    describe('when requesting a graph for a date', () => {
      let groupByRequest: IGroupByRequest;

      beforeEach(() => {
        facet.isSimpleSliderConfig = true;
        facet.options.graph = {};
        facet.options.graph.steps = 10;
        facet.options.start = 1;
        facet.options.end = 100;
        facet.getSliderBoundaryForQuery = () => [5, 99];
        facet.options.dateField = true;
        const builder = new QueryBuilder();
        controller.putGroupByIntoQueryBuilder(builder);
        groupByRequest = builder.groupByRequests[0];
      });

      it('should contain the basic group by data', () => {
        expect(groupByRequest).toEqual(
          jasmine.objectContaining({
            field: '@foo',
            maximumNumberOfValues: 10,
            sortCriteria: 'nosort',
            generateAutomaticRanges: false,
            rangeValues: jasmine.arrayContaining([
              jasmine.objectContaining({
                start: jasmine.stringMatching('1970'),
                end: jasmine.stringMatching('1970'),
                endInclusive: true
              })
            ])
          } as any)
        );
      });

      it('should contain a filter for invalid document dates', () => {
        expect(groupByRequest.constantQueryOverride).toContain('@foo>1970');
      });
    });
  });
}

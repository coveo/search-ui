import { FacetSliderQueryController } from '../../src/controllers/FacetSliderQueryController';
import * as Mock from '../MockEnvironment';
import { FacetSlider } from '../../src/ui/FacetSlider/FacetSlider';
import { IFieldOption } from '../../src/ui/Base/ComponentOptions';
import { QueryBuilder } from '../../src/ui/Base/QueryBuilder';

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

    it('should allow to put the group by into a query builder with simple slider config', () => {
      facet.isSimpleSliderConfig = () => true;
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
      facet.isSimpleSliderConfig = () => false;
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
          queryOverride: '@uri',
          sortCriteria: 'nosort'
        })
      );
    });

    it('should add a group by for graph using the query override if specified', () => {
      facet.isSimpleSliderConfig = () => false;
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
          queryOverride: 'my query override',
          sortCriteria: 'nosort'
        })
      );
    });

    it('should add a range request if needed for graph', () => {
      facet.isSimpleSliderConfig = () => true;
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

    it("should add a group by for graph if it's a date", () => {
      facet.isSimpleSliderConfig = () => true;
      facet.options.graph = {};
      facet.options.graph.steps = 10;
      facet.options.start = 1;
      facet.options.end = 100;
      facet.getSliderBoundaryForQuery = () => [5, 99];
      facet.options.dateField = true;

      const builder = new QueryBuilder();
      controller.putGroupByIntoQueryBuilder(builder);
      expect(builder.groupByRequests[0]).toEqual(
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
        })
      );
    });
  });
}

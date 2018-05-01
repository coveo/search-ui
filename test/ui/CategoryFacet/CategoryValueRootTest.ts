import * as Mock from '../../MockEnvironment';
import { CategoryFacet } from '../../../src/ui/CategoryFacet/CategoryFacet';
import { FakeResults } from '../../Fake';
import { CategoryValueRoot } from '../../../src/ui/CategoryFacet/CategoryValueRoot';
import { CategoryFacetTemplates } from '../../../src/ui/CategoryFacet/CategoryFacetTemplates';
import { $$ } from '../../../src/Core';
import { Simulate } from '../../Simulate';
import { NoopComponent } from '../../../src/ui/NoopComponent/NoopComponent';
import { CategoryFacetQueryController } from '../../../src/controllers/CategoryFacetQueryController';

export function CategoryValueRootTest() {
  describe('CategoryValueRoot', () => {
    let categoryFacetMock: CategoryFacet;
    let noopComponentMock: Mock.IBasicComponentSetup<NoopComponent>;

    beforeEach(() => {
      categoryFacetMock = Mock.mock<CategoryFacet>(CategoryFacet, 'categoryFacetMock');
      categoryFacetMock.categoryFacetQueryController = Mock.mock<CategoryFacetQueryController>(CategoryFacetQueryController);
      categoryFacetMock.categoryFacetQueryController = jasmine.createSpyObj<CategoryFacetQueryController>('categoryFacetQueryController', [
        'putCategoryFacetInQueryBuilder'
      ]);
      categoryFacetMock.categoryFacetQueryController.putCategoryFacetInQueryBuilder = () => 0;
      noopComponentMock = Mock.basicComponentSetup<NoopComponent>(NoopComponent);
      categoryFacetMock.bind = noopComponentMock.cmp.bind;
      new CategoryValueRoot($$(noopComponentMock.env.element), new CategoryFacetTemplates(), categoryFacetMock);
    });

    it('does not hide the component when there is no results and a path is selected', () => {
      const queryResults = FakeResults.createFakeResults();
      queryResults.categoryFacets = [FakeResults.createFakeCategoryFacetResult('@field', ['parentA', 'parentB'], [])];

      Simulate.query(noopComponentMock.env, { results: queryResults });
      expect(categoryFacetMock.hide).not.toHaveBeenCalled();
    });
  });
}

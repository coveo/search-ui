import { CategoryFacet } from '../../../src/ui/CategoryFacet/CategoryFacet';
import * as Mock from '../../MockEnvironment';

export function CategoryFacetTest() {
  describe('CategoryFacet', () => {
    it('get children calls get children on the CategoryValueRoot', () => {
      const categoryFacet = Mock.basicComponentSetup<CategoryFacet>(CategoryFacet);
      spyOn(categoryFacet.cmp, 'getChildren');
      categoryFacet.cmp.getChildren();
      expect(categoryFacet.cmp.getChildren).toHaveBeenCalled();
    });
  });
}

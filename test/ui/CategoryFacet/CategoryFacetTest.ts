import { CategoryFacet } from '../../../src/ui/CategoryFacet/CategoryFacet';
import * as Mock from '../../MockEnvironment';
import { $$ } from '../../Test';

export function CategoryFacetTest() {
  describe('CategoryFacet', () => {
    let categoryFacet;

    beforeEach(() => {
      categoryFacet = Mock.basicComponentSetup<CategoryFacet>(CategoryFacet);
    });
    it('calling hide adds the coveo hidden class', () => {
      categoryFacet.cmp.hide();
      expect($$(categoryFacet.cmp.element).hasClass('coveo-hidden')).toBeTruthy();
    });
  });
}

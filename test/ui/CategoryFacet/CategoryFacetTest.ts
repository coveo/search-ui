import { CategoryFacet } from '../../../src/ui/CategoryFacet/CategoryFacet';
import * as Mock from '../../MockEnvironment';
import { $$ } from '../../Test';

export function CategoryFacetTest() {
  describe('CategoryFacet', () => {
    let categoryFacet: CategoryFacet;

    beforeEach(() => {
      categoryFacet = Mock.basicComponentSetup<CategoryFacet>(CategoryFacet).cmp;
    });
    it('calling hide adds the coveo hidden class', () => {
      categoryFacet.hide();
      expect($$(categoryFacet.element).hasClass('coveo-hidden')).toBeTruthy();
    });

    describe('calling changeActivePath', () => {
      let newPath: string[];
      let queryPromise: Promise<void>;
      beforeEach(() => {
        newPath = ['new', 'path'];
        queryPromise = categoryFacet.changeActivePath(newPath);
      });

      it('sets the new path', () => {
        expect(categoryFacet.activePath).toEqual(['new', 'path']);
      });

      it('triggers a new query', () => {
        expect(categoryFacet.queryController.executeQuery).toHaveBeenCalled();
      });

      it('sets the path in the query state', () => {
        expect(categoryFacet.queryStateModel.set).toHaveBeenCalledWith(categoryFacet.queryStateAttribute, newPath);
      });

      it('shows a wait animation', () => {
        queryPromise.then(() => {
          const waitIcon = $$(categoryFacet.element).find('.' + CategoryFacet.WAIT_ELEMENT_CLASS);
          expect(waitIcon).not.toBeNull();
          expect(waitIcon.style.visibility).toEqual('visible');
        });
      });
    });

    it('calling reload calls changeActivePath');
  });
}

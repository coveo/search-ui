import * as axe from 'axe-core';
import { $$, Component, ResultList } from 'coveo-search-ui';
import { afterQuerySuccess, getResultsColumn, getRoot, addFieldEqualFilter } from './Testing';

export const AccessibilityResultList = () => {
  describe('ResultList', () => {
    const getResultListStandardElement = () => {
      return $$('div', {
        className: Component.computeCssClassName(ResultList)
      });
    };

    const getResultListCardElement = () => {
      return $$('div', {
        className: Component.computeCssClassName(ResultList),
        'data-layout': 'card'
      });
    };
    it('should be accessible', async done => {
      const resultListElement = getResultListStandardElement();
      getResultsColumn().appendChild(resultListElement.el);

      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });

    describe('with youtube files', () => {
      beforeEach(() => {
        addFieldEqualFilter('@filetype', 'youtubevideo');
      });

      it('should be accessible with default card template', async done => {
        const resultListElement = getResultListCardElement();
        getResultsColumn().appendChild(resultListElement.el);
        await afterQuerySuccess();
        const axeResults = await axe.run(getRoot());
        expect(axeResults).toBeAccessible();
        done();
      });

      it('should be accessible with default list template', async done => {
        const resultListElement = getResultListStandardElement();
        getResultsColumn().appendChild(resultListElement.el);
        await afterQuerySuccess();
        const axeResults = await axe.run(getRoot());
        expect(axeResults).toBeAccessible();
        done();
      });
    });
  });
};

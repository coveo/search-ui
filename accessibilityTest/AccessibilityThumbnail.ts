import * as axe from 'axe-core';
import { $$, Component, Thumbnail } from 'coveo-search-ui';
import { afterQuerySuccess, testResultElement } from './Testing';

export const AccessibilityThumbnail = () => {
  describe('Thumbnail', () => {
    const testThumbnailClass = 'some-unique-class-name';

    function getFirstThumbnailElement() {
      return document.querySelector(`.${testThumbnailClass}`);
    }

    beforeEach(() => {
      testResultElement(
        $$('div', {
          className: [Component.computeCssClassName(Thumbnail), testThumbnailClass].join(' '),
          dataField: '@gdfilethumbnaillink'
        }).el
      );
    });

    it('should be accessible', async done => {
      await afterQuerySuccess();
      const axeResults = await axe.run(getFirstThumbnailElement());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};

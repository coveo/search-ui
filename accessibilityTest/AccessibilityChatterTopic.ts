import * as axe from 'axe-core';
import { $$, Component, ChatterTopic } from 'coveo-search-ui';
import { addFieldEqualFilter, afterQuerySuccess, getRoot, testResultElement, addQueryFilter } from './Testing';

export const AccessibilityChatterTopic = () => {
  describe('ChatterTopic', () => {
    beforeEach(() => {
      addFieldEqualFilter('@objecttype', ['FeedItem', 'FeedComment']);
      addQueryFilter('@coveochatterfeedtopics<>""');
    });

    it('should be accessible', async done => {
      const chatterTopic = $$('div', {
        className: Component.computeCssClassName(ChatterTopic)
      });

      testResultElement(chatterTopic.el);

      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};

import { PromotedResultsBadge, IPromotedResultsBadgeOptions } from '../../src/ui/PromotedResultsBadge/PromotedResultsBadge';
import { FakeResults } from '../Fake';
import { IQueryResult } from '../../src/rest/QueryResult';
import { $$, Dom } from '../../src/utils/Dom';
import * as Mock from '../MockEnvironment';
import { ResultListEvents, l } from '../../src/Core';
import { IDisplayedNewResultEventArgs } from '../../src/events/ResultListEvents';

export function PromotedResultsBadgeTest() {
  describe('PromotedResultsBadge', () => {
    let result: IQueryResult;
    let item: HTMLElement;

    const getPromotedBadge = (): Dom => {
      let badge = $$(item).find('.coveo-promoted-result-badge');
      if (!badge) {
        badge = item.parentElement ? $$(item.parentElement).find('.coveo-promoted-result-badge') : null;
      }
      return badge ? $$(badge) : null;
    };

    beforeEach(() => {
      item = $$('div').el;
    });

    it('should not do anything with a "standard" result', () => {
      result = FakeResults.createFakeResult();
      result.isTopResult = false;
      result.isRecommendation = false;

      const test = Mock.basicComponentSetup<PromotedResultsBadge>(PromotedResultsBadge);
      $$(test.env.root).trigger(ResultListEvents.newResultDisplayed, {
        result,
        item
      } as IDisplayedNewResultEventArgs);

      expect(getPromotedBadge()).toBeNull();
    });

    describe('with a featured result', () => {
      beforeEach(() => {
        result = FakeResults.createFakeResult();
        result.isTopResult = true;
      });

      it('should output a badge by default', () => {
        const test = Mock.basicComponentSetup<PromotedResultsBadge>(PromotedResultsBadge);
        $$(test.env.root).trigger(ResultListEvents.newResultDisplayed, {
          result,
          item
        } as IDisplayedNewResultEventArgs);

        expect(getPromotedBadge()).toBeDefined();
      });

      it('should not output a badge if the option is not activated', () => {
        const test = Mock.optionsComponentSetup<PromotedResultsBadge, IPromotedResultsBadgeOptions>(PromotedResultsBadge, {
          showBadgeForFeaturedResults: false
        } as IPromotedResultsBadgeOptions);

        $$(test.env.root).trigger(ResultListEvents.newResultDisplayed, {
          result,
          item
        } as IDisplayedNewResultEventArgs);

        expect(getPromotedBadge()).toBeNull();
      });

      it('should use the specified caption', () => {
        const test = Mock.optionsComponentSetup<PromotedResultsBadge, IPromotedResultsBadgeOptions>(PromotedResultsBadge, {
          captionForFeatured: 'foo'
        } as IPromotedResultsBadgeOptions);

        $$(test.env.root).trigger(ResultListEvents.newResultDisplayed, {
          result,
          item
        } as IDisplayedNewResultEventArgs);

        expect(getPromotedBadge().text()).toBe(l('foo'));
      });

      it('should use the specified color', () => {
        const test = Mock.optionsComponentSetup<PromotedResultsBadge, IPromotedResultsBadgeOptions>(PromotedResultsBadge, {
          colorForFeaturedResults: 'yellow'
        } as IPromotedResultsBadgeOptions);

        $$(test.env.root).trigger(ResultListEvents.newResultDisplayed, {
          result,
          item
        } as IDisplayedNewResultEventArgs);

        expect(getPromotedBadge().el.style.backgroundColor).toBe('yellow');
      });

      it('should not have an inline background color if not specified (should be controlled by CSS)', () => {
        const test = Mock.basicComponentSetup<PromotedResultsBadge>(PromotedResultsBadge);

        $$(test.env.root).trigger(ResultListEvents.newResultDisplayed, {
          result,
          item
        } as IDisplayedNewResultEventArgs);

        expect(getPromotedBadge().el.style.backgroundColor).toBe('');
      });

      it('should not display for table layout', () => {
        $$(item).addClass('coveo-table-layout');
        const test = Mock.basicComponentSetup<PromotedResultsBadge>(PromotedResultsBadge);

        $$(test.env.root).trigger(ResultListEvents.newResultDisplayed, {
          result,
          item
        } as IDisplayedNewResultEventArgs);

        expect(getPromotedBadge()).toBeNull();
      });

      describe('with a card layout', () => {
        beforeEach(() => {
          $$(item).addClass('coveo-card-layout');
        });

        it('should add a container for the badge', () => {
          const test = Mock.basicComponentSetup<PromotedResultsBadge>(PromotedResultsBadge);

          $$(test.env.root).trigger(ResultListEvents.newResultDisplayed, {
            result,
            item
          } as IDisplayedNewResultEventArgs);

          const badge = getPromotedBadge();
          expect($$(badge.el.parentElement).hasClass('coveo-promoted-result-badge-container-card-layout')).toBeTruthy();
        });
      });
    });

    describe('with a recommended result', () => {
      beforeEach(() => {
        result = FakeResults.createFakeResult();
        result.isRecommendation = true;
      });

      it('should not output a badge by default', () => {
        const test = Mock.basicComponentSetup<PromotedResultsBadge>(PromotedResultsBadge);
        $$(test.env.root).trigger(ResultListEvents.newResultDisplayed, {
          result,
          item
        } as IDisplayedNewResultEventArgs);

        expect(getPromotedBadge()).toBeNull();
      });

      it('should output a badge if the option is activated', () => {
        const test = Mock.optionsComponentSetup<PromotedResultsBadge, IPromotedResultsBadgeOptions>(PromotedResultsBadge, {
          showBadgeForRecommendedResults: true
        } as IPromotedResultsBadgeOptions);

        $$(test.env.root).trigger(ResultListEvents.newResultDisplayed, {
          result,
          item
        } as IDisplayedNewResultEventArgs);

        expect(getPromotedBadge()).toBeDefined();
      });

      it('should not consider the result a recommended result if it is also a featured result', () => {
        result.isTopResult = true;
        const test = Mock.optionsComponentSetup<PromotedResultsBadge, IPromotedResultsBadgeOptions>(PromotedResultsBadge, {
          showBadgeForRecommendedResults: true
        } as IPromotedResultsBadgeOptions);

        $$(test.env.root).trigger(ResultListEvents.newResultDisplayed, {
          result,
          item
        } as IDisplayedNewResultEventArgs);

        expect(getPromotedBadge().text()).toBeDefined(l('Featured'));
      });

      it('should use the specified caption', () => {
        const test = Mock.optionsComponentSetup<PromotedResultsBadge, IPromotedResultsBadgeOptions>(PromotedResultsBadge, {
          captionForRecommended: 'foo',
          showBadgeForRecommendedResults: true
        } as IPromotedResultsBadgeOptions);

        $$(test.env.root).trigger(ResultListEvents.newResultDisplayed, {
          result,
          item
        } as IDisplayedNewResultEventArgs);

        expect(getPromotedBadge().text()).toBe(l('foo'));
      });

      it('should use the specified color', () => {
        const test = Mock.optionsComponentSetup<PromotedResultsBadge, IPromotedResultsBadgeOptions>(PromotedResultsBadge, {
          colorForRecommendedResults: 'pink',
          showBadgeForRecommendedResults: true
        } as IPromotedResultsBadgeOptions);

        $$(test.env.root).trigger(ResultListEvents.newResultDisplayed, {
          result,
          item
        } as IDisplayedNewResultEventArgs);

        expect(getPromotedBadge().el.style.backgroundColor).toBe('pink');
      });

      it('should not have an inline background color if not specified (should be controlled by CSS)', () => {
        const test = Mock.optionsComponentSetup<PromotedResultsBadge, IPromotedResultsBadgeOptions>(PromotedResultsBadge, {
          showBadgeForRecommendedResults: true
        } as IPromotedResultsBadgeOptions);

        $$(test.env.root).trigger(ResultListEvents.newResultDisplayed, {
          result,
          item
        } as IDisplayedNewResultEventArgs);

        expect(getPromotedBadge().el.style.backgroundColor).toBe('');
      });
    });
  });
}

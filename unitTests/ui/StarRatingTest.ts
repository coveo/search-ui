import { l } from '../../src/Core';
import { FakeResults } from '../Fake';
import { $$ } from '../../src/utils/Dom';
import * as Mock from '../MockEnvironment';
import { IQueryResult } from '../../src/rest/QueryResult';
import { StarRating, IStarRatingOptions } from '../../src/ui/StarRating/StarRating';

const CONTAINER_CSS_CLASS = 'CoveoStarRating';
const STAR_CSS_CLASS = 'coveo-star-rating-star';
const ACTIVE_STAR_CSS_CLASS = 'coveo-star-rating-star-active';
const STAR_LABEL_CSS_CLASS = 'coveo-star-rating-label';

const getActiveStars = (starRatingElement: HTMLElement) => {
  return {
    numStars: starRatingElement.querySelectorAll(`.${STAR_CSS_CLASS}`).length,
    numActiveStars: starRatingElement.querySelectorAll(`.${ACTIVE_STAR_CSS_CLASS}`).length
  };
};

export function StarRatingTest() {
  let test: Mock.IBasicComponentSetup<StarRating>;

  function initStarRatingComponent(ratingValue: String, numRatingsValue?: String, ratingScale?: number) {
    const options: IStarRatingOptions = { ratingField: '@rating', numberOfRatingsField: '@numberOfRatings', ratingScale: ratingScale };
    const result: IQueryResult = FakeResults.createFakeResult();

    result.raw.rating = ratingValue;
    result.raw.numberOfRatings = numRatingsValue;

    test = Mock.advancedResultComponentSetup<StarRating>(StarRating, result, <Mock.AdvancedComponentSetupOptions>{
      element: $$('div').el,
      cmpOptions: options,
      modifyBuilder: (builder: Mock.MockEnvironmentBuilder) => {
        return builder;
      }
    });
  }

  describe('StarRating', () => {
    it('should have correct class type', () => {
      initStarRatingComponent('0', '0');
      expect(test.cmp.element.classList.contains(CONTAINER_CSS_CLASS)).toBe(true);
    });

    it('should have a tabindex of 0', () => {
      initStarRatingComponent('0', '0');
      expect(test.cmp.element.tabIndex).toEqual(0);
    });

    describe('The star elements', () => {
      it('should display five stars with a number of active stars equal to rating given', () => {
        for (let i = 0; i <= 5; i++) {
          initStarRatingComponent(i.toString());

          let starData = getActiveStars(test.cmp.element);
          expect(starData.numStars).toBe(5);
          expect(starData.numActiveStars).toBe(i);
        }
      });

      it('should display no active stars when the rating provided is negative', () => {
        const testRating = -Number.MAX_VALUE;
        initStarRatingComponent(testRating.toString());

        const starData = getActiveStars(test.cmp.element);
        expect(starData.numStars).toBe(5);
        expect(starData.numActiveStars).toBe(0);
      });

      it('should be safe and render a 0 star rating if the rating field contains JS or HTML', () => {
        const xss = '<svg/onload=alert(document.domain)>';
        initStarRatingComponent(xss);

        const starData = getActiveStars(test.cmp.element);
        expect(starData.numStars).toBe(5);
        expect(starData.numActiveStars).toBe(0);
      });
    });

    describe('The label showing number of ratings', () => {
      it('should not display when no value is provided for number of ratings', () => {
        initStarRatingComponent((0).toString());
        const children = $$(test.cmp.element).findAll(`.${STAR_LABEL_CSS_CLASS}`);
        expect(children.length).toBe(0);
      });

      it('should display a label with "No Ratings" shown when zero given', () => {
        const testNumRatings = 0;
        initStarRatingComponent((0).toString(), testNumRatings.toString());

        const testLabel = $$(test.cmp.element).find(`.${STAR_LABEL_CSS_CLASS}`);
        expect(testLabel).toBeDefined();
        expect(testLabel.textContent).toEqual(l('NoRatings'));
      });

      it('should display a label with "No Ratings" shown when a negative number is given', () => {
        const testNumRatings = -Number.MAX_VALUE;
        initStarRatingComponent((0).toString(), testNumRatings.toString());

        const testLabel = $$(test.cmp.element).find(`.${STAR_LABEL_CSS_CLASS}`);
        expect(testLabel).toBeDefined();
        expect(testLabel.textContent).toEqual(l('NoRatings'));
      });

      it('should display the number when they are provided', () => {
        const testNumRatings = Number.MAX_VALUE;
        initStarRatingComponent((0).toString(), testNumRatings.toString());

        const testLabel = $$(test.cmp.element).find(`.${STAR_LABEL_CSS_CLASS}`);
        expect(testLabel).toBeDefined();
        expect(testLabel.textContent).toEqual(`(${testNumRatings})`);
      });

      it('should be safe and render a "No Ratings" label if the number of rating field contains JS or HTML', () => {
        const xss = '<svg/onload=alert(document.domain)>';
        initStarRatingComponent('0', xss);

        const testLabel = $$(test.cmp.element).find(`.${STAR_LABEL_CSS_CLASS}`);
        expect(testLabel).toBeDefined();
        expect(testLabel.textContent).toEqual(l('NoRatings'));
      });
    });

    describe('the accessibility label', () => {
      const rating = 3;
      const scale = 5;

      function getLabel() {
        return test.cmp.element.getAttribute('aria-label');
      }

      describe('without a number of ratings', () => {
        beforeEach(() => {
          initStarRatingComponent(rating.toString(), undefined, scale);
        });

        it('should have a label', () => {
          expect(getLabel()).toBeTruthy();
        });

        it('should describe the rating and rating scale', () => {
          expect(getLabel()).toContain(rating.toString());
          expect(getLabel()).toContain(scale.toString());
        });
      });

      describe('with a number of ratings', () => {
        describe('above 0', () => {
          const numberOfRatings = 9;

          beforeEach(() => {
            initStarRatingComponent(rating.toString(), numberOfRatings.toString(), scale);
          });

          it('should have a label', () => {
            expect(getLabel()).toBeTruthy();
          });

          it('should describe the rating, rating scale and number of ratings', () => {
            expect(getLabel()).toContain(rating.toString());
            expect(getLabel()).toContain(scale.toString());
            expect(getLabel()).toContain(numberOfRatings.toString());
          });
        });

        describe('equal to 0', () => {
          beforeEach(() => {
            initStarRatingComponent(rating.toString(), '0', scale);
          });

          it('should have a label', () => {
            expect(getLabel()).toBeTruthy();
          });

          it('should describe that there are no ratings', () => {
            expect(getLabel()).not.toContain(rating.toString());
            expect(getLabel()).not.toContain(scale.toString());
          });
        });
      });
    });

    describe('When a different scale is provided', () => {
      it('should display five stars with a number of active stars equal to new proportions', () => {
        const newScale = 10;
        for (let i = 0; i <= newScale; i++) {
          initStarRatingComponent(i.toString(), undefined, newScale);

          const starData = getActiveStars(test.cmp.element);
          expect(starData.numStars).toBe(5);
          expect(starData.numActiveStars).toBe(Math.round(i / 2));
        }
      });

      it('should not display the component if the scale is smaller than the rating', () => {
        const newScale = 7;
        const rating = '10';
        initStarRatingComponent(rating, undefined, newScale);

        expect(test.cmp.element.children.length).toBe(0);
      });

      it('should not display the component if the scale is equal to zero', () => {
        const newScale = 0;
        const rating = '4';
        initStarRatingComponent(rating, undefined, newScale);

        expect(test.cmp.element.children.length).toBe(0);
      });

      it('should not display the component if the scale is smaller than zero', () => {
        const newScale = -Number.MAX_VALUE;
        const rating = '4';
        initStarRatingComponent(rating, undefined, newScale);

        expect(test.cmp.element.children.length).toBe(0);
      });
    });
  });
}

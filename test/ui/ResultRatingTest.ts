import * as Mock from '../MockEnvironment';
import {ResultRating} from '../../src/ui/ResultRating/ResultRating';
import {IQueryResult} from '../../src/rest/QueryResult';
import {FakeResults} from '../Fake';
import {RatingValues} from '../../src/ui/ResultRating/ResultRating';
import {$$} from '../../src/utils/Dom';
import {IRatingRequest} from '../../src/rest/RatingRequest';

export function ResultRatingTest() {
  describe('ResultRating', function () {
    let test: Mock.IBasicComponentSetup<ResultRating>;
    let averageFakeResult: IQueryResult;
    let fakeResultWithNoStars: IQueryResult;

    beforeEach(() => {
      window['Coveo']['$'] = null;
      averageFakeResult = FakeResults.createFakeResult();
      averageFakeResult.rating = RatingValues.Average;

      fakeResultWithNoStars = FakeResults.createFakeResult();
      fakeResultWithNoStars.rating = RatingValues.Undefined;

      test = Mock.advancedResultComponentSetup<ResultRating>(ResultRating, averageFakeResult, undefined);
    });

    let numberOActivatedStarsIs = (n: number) => {
      let resultRatings = $$(test.env.element).findAll('a');
      let numberOfActivatedStars = 0;

      for (let i = 0; i < resultRatings.length; i++) {
        if ($$(resultRatings[i]).hasClass('coveo-sprites-star_active')) {
          numberOfActivatedStars++;
        } else {
          break;
        }
      }

      return numberOfActivatedStars == n;
    };

    it('should have empty result rating element when there\'s no rating ', () => {
      let fakeResultWithNoResultRating: IQueryResult = FakeResults.createFakeResult();
      fakeResultWithNoResultRating.rating = undefined;

      test = Mock.advancedResultComponentSetup<ResultRating>(ResultRating, fakeResultWithNoResultRating, undefined);

      expect($$(test.env.element).isEmpty()).toBe(true);
    });

    it('should load new active stars when using new design', () => {
      test = Mock.basicResultComponentSetup<ResultRating>(ResultRating);

      let star = $$(test.env.element).find('a');
      expect($$(star).hasClass('coveo-sprites-star_active')).toBe(true);
    });

    it('should load old active stars when using old design', () => {
      test = Mock.advancedResultComponentSetup<ResultRating>(ResultRating, FakeResults.createFakeResult(),
        new Mock.AdvancedComponentSetupOptions(undefined, undefined, (builder: Mock.MockEnvironmentBuilder) => {
          return builder.withOldDesign();
        }));

      let star = $$(test.env.element).find('a');
      expect($$(star).hasClass('coveo-sprites-common-star_active')).toBe(true);
    });

    it('should load new placeholder stars when using new design ', () => {
      test = Mock.advancedResultComponentSetup<ResultRating>(ResultRating, fakeResultWithNoStars, undefined);

      let star = $$(test.env.element).find('a');
      expect($$(star).hasClass('coveo-sprites-star_placeholder')).toBe(true);
    });

    it('should load old placeholder stars when using old design', () => {
      test = Mock.advancedResultComponentSetup<ResultRating>(ResultRating, fakeResultWithNoStars,
        new Mock.AdvancedComponentSetupOptions(undefined, undefined, (builder: Mock.MockEnvironmentBuilder) => {
          return builder.withOldDesign();
        }));

      let star = $$(test.env.element).find('a');
      expect($$(star).hasClass('coveo-sprites-common-star_placeholder')).toBe(true);
    });

    it('should call query controller when rating a document', () => {
      let expectedRequest: IRatingRequest = {
        rating: RatingValues[RatingValues.Undefined],
        uniqueId: averageFakeResult.uniqueId
      };
      let spy = <jasmine.Spy>test.env.searchEndpoint.rateDocument;
      spy.and.returnValue(new Promise((resolve, reject) => {
        resolve();
      }));

      test.cmp.rateDocument(RatingValues.Undefined);

      expect(spy).toHaveBeenCalledWith(expectedRequest);
    });

    it('should activate zero stars with undefined rating', () => {
      let fakeResult: IQueryResult = FakeResults.createFakeResult();
      fakeResult.rating = RatingValues.Undefined;

      test = Mock.advancedResultComponentSetup<ResultRating>(ResultRating, fakeResult, undefined);

      expect(numberOActivatedStarsIs(0)).toBe(true);
    });

    it('should activate one star with lowest rating', () => {
      let fakeResult: IQueryResult = FakeResults.createFakeResult();
      fakeResult.rating = RatingValues.Lowest;

      test = Mock.advancedResultComponentSetup<ResultRating>(ResultRating, fakeResult, undefined);

      expect(numberOActivatedStarsIs(1)).toBe(true);
    });

    it('should activate two stars with low rating', () => {
      let fakeResult: IQueryResult = FakeResults.createFakeResult();
      fakeResult.rating = RatingValues.Low;

      test = Mock.advancedResultComponentSetup<ResultRating>(ResultRating, fakeResult, undefined);

      expect(numberOActivatedStarsIs(2)).toBe(true);
    });

    it('should activate three stars with average rating', () => {
      let fakeResult: IQueryResult = FakeResults.createFakeResult();
      fakeResult.rating = RatingValues.Average;

      test = Mock.advancedResultComponentSetup<ResultRating>(ResultRating, fakeResult, undefined);

      expect(numberOActivatedStarsIs(3)).toBe(true);
    });

    it('should activate fours stars with good rating', () => {
      let fakeResult: IQueryResult = FakeResults.createFakeResult();
      fakeResult.rating = RatingValues.Good;

      test = Mock.advancedResultComponentSetup<ResultRating>(ResultRating, fakeResult, undefined);

      expect(numberOActivatedStarsIs(4)).toBe(true);
    });

    it('should activate five stars with best rating', () => {
      let fakeResult: IQueryResult = FakeResults.createFakeResult();
      fakeResult.rating = RatingValues.Best;

      test = Mock.advancedResultComponentSetup<ResultRating>(ResultRating, fakeResult, undefined);

      expect(numberOActivatedStarsIs(5)).toBe(true);
    });

    it('should activate star on mouseover with collaborative rating and placeholder star', () => {
      test = Mock.advancedResultComponentSetup<ResultRating>(ResultRating, fakeResultWithNoStars,
        new Mock.AdvancedComponentSetupOptions(undefined, undefined, (builder: Mock.MockEnvironmentBuilder) => {
          return builder.withCollaborativeRating();
        }));
      let firstStar = $$($$(test.env.element).find('a'));

      firstStar.trigger('mouseover');

      expect(numberOActivatedStarsIs(1)).toBe(true);
    });

    it('should activate one star on mouseover with collaborative rating and average rating', () => {
      test = Mock.advancedResultComponentSetup<ResultRating>(ResultRating, averageFakeResult,
        new Mock.AdvancedComponentSetupOptions(undefined, undefined, (builder: Mock.MockEnvironmentBuilder) => {
          return builder.withCollaborativeRating();
        }));
      let firstStar = $$($$(test.env.element).find('a'));

      firstStar.trigger('mouseover');

      expect(numberOActivatedStarsIs(1)).toBe(true);
    });

    it('should show three activated stars on mouseleave after mouseover with collaborative rating and average rating', () => {
      test = Mock.advancedResultComponentSetup<ResultRating>(ResultRating, averageFakeResult,
        new Mock.AdvancedComponentSetupOptions(undefined, undefined, (builder: Mock.MockEnvironmentBuilder) => {
          return builder.withCollaborativeRating();
        }));
      let firstStar = $$($$(test.env.element).find('a'));

      firstStar.trigger('mouseover');
      firstStar.trigger('mouseout');

      expect(numberOActivatedStarsIs(3)).toBe(true);
    });

    it('should deactivate star on mouseleave after mouseover with collaborative rating and placeholder star', () => {
      test = Mock.advancedResultComponentSetup<ResultRating>(ResultRating, fakeResultWithNoStars,
        new Mock.AdvancedComponentSetupOptions(undefined, undefined, (builder: Mock.MockEnvironmentBuilder) => {
          return builder.withCollaborativeRating();
        }));
      let firstStar = $$($$(test.env.element).find('a'));

      firstStar.trigger('mouseover');
      firstStar.trigger('mouseout');

      expect(numberOActivatedStarsIs(0)).toBe(true);
    });

    it('should not activate star on mouseover with no collaborative rating', () => {
      test = Mock.advancedResultComponentSetup<ResultRating>(ResultRating, fakeResultWithNoStars, undefined);
      let firstStar = $$($$(test.env.element).find('a'));

      firstStar.trigger('mouseover');

      expect(numberOActivatedStarsIs(0)).toBe(true);
    });
  });
}

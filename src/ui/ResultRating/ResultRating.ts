import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IQueryResult } from '../../rest/QueryResult';
import { $$, Dom } from '../../utils/Dom';
import { Initialization } from '../Base/Initialization';
import { Utils } from '../../utils/Utils';
import { IRatingRequest } from '../../rest/RatingRequest';
import { exportGlobally } from '../../GlobalExports';
import { SVGIcons } from '../../utils/SVGIcons';
import { SVGDom } from '../../utils/SVGDom';
import 'styling/_ResultRating';

export enum RatingValues {
  Undefined,
  Lowest,
  Low,
  Average,
  Good,
  Best
}

export interface IResultRatingOptions {}
/**
 * The `ResultRating` component renders a 5-star rating widget. Interactive rating is possible if
 * the [`enableCollaborativeRating`]{@link SearchInterface.options.enableCollaborativeRating} option of your
 * search interface is `true`, and if collaborative rating is enabled on your Coveo index.
 *
 * This component is a result template component (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 *
 * @notSupportedIn salesforcefree
 */
export class ResultRating extends Component {
  static ID = 'ResultRating';

  static doExport = () => {
    exportGlobally({
      ResultRating: ResultRating
    });
  };

  /**
   * Creates a new `ResultRating` component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the `ResultRating` component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   * @param result The result to associate the component with.
   */
  constructor(
    public element: HTMLElement,
    public options?: IResultRatingOptions,
    public bindings?: IComponentBindings,
    public result?: IQueryResult
  ) {
    super(element, ResultRating.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, ResultRating, options);

    if (!Utils.isNullOrUndefined(result.rating)) {
      this.renderComponent(element, result.rating);
    }
  }

  private renderComponent(element: HTMLElement, rating: number) {
    for (let starNumber = 1; starNumber <= 5; starNumber++) {
      this.renderStar(element, starNumber <= rating, starNumber);
    }
  }

  private renderStar(element: HTMLElement, isChecked: boolean, value: number) {
    let star: Dom;
    const starElement = $$(element).find('a[rating-value="' + value + '"]');
    if (starElement == null) {
      star = $$('a', { className: 'coveo-result-rating-star' }, SVGIcons.icons.star);
      SVGDom.addClassToSVGInContainer(star.el, 'coveo-result-rating-star-svg');
      element.appendChild(star.el);

      if (this.bindings.searchInterface.options.enableCollaborativeRating) {
        star.on('click', e => {
          const targetElement: HTMLElement = <HTMLElement>e.currentTarget;
          this.rateDocument(parseInt(targetElement.getAttribute('rating-value')));
        });

        star.on('mouseover', e => {
          const targetElement: HTMLElement = <HTMLElement>e.currentTarget;
          this.renderComponent(element, parseInt(targetElement.getAttribute('rating-value')));
        });

        star.on('mouseout', () => {
          this.renderComponent(element, this.result.rating);
        });
      }

      star.el.setAttribute('rating-value', value.toString());
    } else {
      star = $$(starElement);
    }

    star.toggleClass('coveo-result-rating-star-active', isChecked);
  }

  /**
   * Rates an item using the the specified `rating` value.
   * @param rating The rating to assign to the item.
   *
   * The possible values are:
   *
   * - `0`: renders no star.
   * - `1`: renders 1 star.
   * - `2`: renders 2 stars.
   * - `3`: renders 3 stars.
   * - `4`: renders 4 stars.
   * - `5`: renders 5 stars.
   */
  public rateDocument(rating: RatingValues) {
    const request: IRatingRequest = {
      rating: RatingValues[rating],
      uniqueId: this.result.uniqueId
    };

    this.queryController
      .getEndpoint()
      .rateDocument(request)
      .then(() => {
        this.result.rating = rating;
        this.renderComponent(this.element, rating);
      })
      .catch(() => {
        this.logger.error('An error occurred while rating the item');
      });
  }
}

Initialization.registerAutoCreateComponent(ResultRating);

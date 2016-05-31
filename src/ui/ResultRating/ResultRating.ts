import {Component} from '../Base/Component'
import {IComponentBindings} from '../Base/ComponentBindings'
import {ComponentOptions} from '../Base/ComponentOptions'
import {IQueryResult} from '../../rest/QueryResult'
import {$$, Dom} from '../../utils/Dom'
import {Initialization} from '../Base/Initialization';
import {Utils} from '../../utils/Utils'
import {IRatingRequest} from '../../rest/RatingRequest';

export enum RatingValues { Undefined, Lowest, Low, Average, Good, Best };

export interface IResultRatingOptions {
}
/**
 * Component used to render document rating. Allows search users to rate a result with a 5-star representation.
 * Interactive rating is possible if collaborative rating is enabled.
 */
export class ResultRating extends Component {
  static ID = 'ResultRating';

  constructor(public element: HTMLElement, public options?: IResultRatingOptions, public bindings?: IComponentBindings, public result?: IQueryResult) {
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
    let starElement = $$(element).find('a[rating-value="' + value + '"]');
    if (starElement == null) {
      star = $$('a');
      element.appendChild(star.el);

      if (this.bindings.searchInterface.options.enableCollaborativeRating) {
        star.on('click', (e) => {
          let targetElement: HTMLElement = <HTMLElement>e.currentTarget;
          this.rateDocument(parseInt(targetElement.getAttribute('rating-value')));
        });

        star.on('mouseover', (e) => {
          let targetElement: HTMLElement = <HTMLElement>e.currentTarget;
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

    let basePath: String = '';
    if (this.searchInterface.isNewDesign()) {
      basePath = 'coveo-sprites-';
    } else {
      basePath = 'coveo-sprites-common-';
    }
    star.toggleClass(basePath + 'star_placeholder', !isChecked);
    star.toggleClass(basePath + 'star_active', isChecked);
  }

  /**
   * Rates a document with the specified rating value.
   * @param rating The rating assigned to the document. Specified using the enum RatingValues.
   * Possible values are: Undefined, Lowest, Low, Average, Good and Best.
   */
  public rateDocument(rating: RatingValues) {
    let request: IRatingRequest = {
      rating: RatingValues[rating],
      uniqueId: this.result.uniqueId
    };

    this.queryController.getEndpoint().rateDocument(request)
      .then(() => {
        this.result.rating = rating;
        this.renderComponent(this.element, rating);
      })
      .catch(() => {
        this.logger.error('An error occurred while rating the document');
      });
  }
}

Initialization.registerAutoCreateComponent(ResultRating);

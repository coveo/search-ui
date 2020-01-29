import 'styling/_StarRating';
import { $$ } from '../../utils/Dom';
import { Utils } from '../../utils/Utils';
import { l } from '../../strings/Strings';
import { Component } from '../Base/Component';
import { SVGIcons } from '../../utils/SVGIcons';
import { exportGlobally } from '../../GlobalExports';
import { IQueryResult } from '../../rest/QueryResult';
import { Initialization } from '../Base/Initialization';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IFieldOption } from '../Base/IComponentOptions';

const DEFAULT_SCALE = 5;

export interface IStarRatingOptions {
  ratingField?: IFieldOption;
  numberOfRatingsField?: IFieldOption;
  ratingScale?: number;
}
/**
 * The `StarRating` component renders a five-star rating widget for use in commerce result templates.
 *
 * @isresulttemplatecomponent
 *
 * @availablesince [January 2020 Release (v2.7968)](https://docs.coveo.com/en/3163/)
 */
export class StarRating extends Component {
  static ID = 'StarRating';
  private rating: number;
  private numberOfRatings: number;

  static doExport = () => {
    exportGlobally({
      StarRating: StarRating
    });
  };

  /**
   * @componentOptions
   */
  static options: IStarRatingOptions = {
    /**
     * Specifies the rating to be displayed as stars. If the rating is on a different scale than 0-5, a `ratingScale` value must be provided.
     */
    ratingField: ComponentOptions.buildFieldOption({ required: true }),

    /**
     * A numeric field whose value should be used to display the total number of ratings label for the result item.
     *
     * If unspecified, no number of ratings label is displayed. If the `numberOfRatingsField`'s value is `0` or less, a `(No Ratings)` label is displayed.
     */
    numberOfRatingsField: ComponentOptions.buildFieldOption(),

    /**
     * The scale to apply to the [`ratingField`]{@link StarRating.options.ratingField}'s value. Must be smaller than or equal to the highest possible `ratingField`'s value.
     *
     * **Example:** If the `ratingScale` is `100` and the current `ratingField`'s value is `75`, the component will render 3 stars (i.e., `75 * (5 / 100)`, rounded down).
     */
    ratingScale: ComponentOptions.buildNumberOption({ defaultValue: 5, min: 1, max: 100000 })
  };

  /**
   * Creates a new `StarRating` component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the `StarRating` component.
   * @param bindings The bindings that the component requires to function normally.
   */
  constructor(
    public element: HTMLElement,
    public options: IStarRatingOptions,
    public bindings?: IComponentBindings,
    private result?: IQueryResult
  ) {
    super(element, StarRating.ID);
    this.options = ComponentOptions.initComponentOptions(element, StarRating, options);

    if (!result) {
      this.logger.error('No result passed to Star Rating component.');
      return;
    }
    this.renderComponent();
  }

  private get configuredFieldsAreValid(): boolean {
    const rawRating = Utils.getFieldValue(this.result, <string>this.options.ratingField);
    const rawNumberOfRatings = Utils.getFieldValue(this.result, <string>this.options.numberOfRatingsField);

    if (rawNumberOfRatings !== undefined) {
      this.numberOfRatings = Number(rawNumberOfRatings) < 0 ? 0 : Number(rawNumberOfRatings) || 0;
    }

    this.rating = Number(rawRating) < 0 ? 0 : Number(rawRating) || 0;
    const scale = this.options.ratingScale;

    if (scale < this.rating || scale <= 0) {
      this.logger.error(`The rating scale property is either missing or invalid.`);
      return false;
    }

    this.rating = Math.round(this.rating * (DEFAULT_SCALE / scale));
    return true;
  }

  private renderComponent() {
    if (this.configuredFieldsAreValid) {
      this.makeAccessible();
      for (let starNumber = 1; starNumber <= DEFAULT_SCALE; starNumber++) {
        this.renderStar(starNumber <= this.rating);
      }
      if (this.numberOfRatings !== undefined) {
        this.renderNumberOfReviews(this.numberOfRatings);
      }
    }
  }

  private makeAccessible() {
    this.setDefaultTabIndex();
    this.element.setAttribute('aria-label', this.getAriaLabel());
  }

  private setDefaultTabIndex() {
    if (Utils.isNullOrUndefined(this.element.getAttribute('tabindex'))) {
      this.element.tabIndex = 0;
    }
  }

  private getAriaLabel() {
    const numberOfRatingsIsKnown = !Utils.isNullOrUndefined(this.numberOfRatings);
    const wasRated = !!this.numberOfRatings;
    if (numberOfRatingsIsKnown && !wasRated) {
      return l('NoRatings');
    }
    const label = l('Rated', this.rating, this.options.ratingScale, this.options.ratingScale);
    if (numberOfRatingsIsKnown) {
      return label + ' ' + l('RatedBy', this.numberOfRatings, this.numberOfRatings);
    }
    return label;
  }

  private renderStar(isChecked: boolean) {
    const star = $$('span', { className: 'coveo-star-rating-star' }, SVGIcons.icons.star);
    star.toggleClass('coveo-star-rating-star-active', isChecked);
    this.element.appendChild(star.el);
  }

  private renderNumberOfReviews(value: number) {
    const numberString = $$('span', { className: 'coveo-star-rating-label' });
    numberString.text(value > 0 ? `(${value})` : l('NoRatings'));
    this.element.appendChild(numberString.el);
  }
}

Initialization.registerAutoCreateComponent(StarRating);

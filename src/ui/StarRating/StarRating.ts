import 'styling/_StarRating';
import { $$ } from '../../utils/Dom';
import { Utils } from '../../utils/Utils';
import { l } from '../../strings/Strings';
import { Component } from '../Base/Component';
import { SVGIcons } from '../../utils/SVGIcons';
import { exportGlobally } from '../../GlobalExports';
import { IQueryResult } from '../../rest/QueryResult';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions, IFieldOption } from '../Base/ComponentOptions';
import { Initialization } from '../Base/Initialization';

const DEFAULT_SCALE = 5;

export interface IStarRatingOptions {
  rating?: IFieldOption;
  numberOfRatings?: IFieldOption;
  ratingScale?: number;
}
/**
 * The `StarRating` component renders a 5-star rating widget for commerce results.
 *
 * This component is a result template component (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
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

  static options: IStarRatingOptions = {
    /**
     * Specifies the rating to be displayed as stars.
     *
     * Specifying a value for this parameter is required in order for the StarRating component to work.
     */
    rating: ComponentOptions.buildFieldOption({ defaultValue: '@rating', required: true }),

    /**
     * Specifies the value to be displayed in the label indicating the quantity of ratings.
     *
     * If unspecified, no label is shown. If a value of `0` is provided, a `(No Ratings)` label is displayed instead.
     */
    numberOfRatings: ComponentOptions.buildFieldOption({ required: false }),

    /**
     * Specifies the scale on which ratings are to be applied
     *
     * Default value is `5`
     */
    ratingScale: ComponentOptions.buildNumberOption({ defaultValue: DEFAULT_SCALE, min: 1, max: 1000 })
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

  private get configuredFieldsHaveValues(): boolean {
    const rawRating = Utils.getFieldValue(this.result, <string>this.options.rating);
    const rawNumberOfRatings = Utils.getFieldValue(this.result, <string>this.options.numberOfRatings);

    if (rawNumberOfRatings !== undefined) {
      this.numberOfRatings = Number(rawNumberOfRatings) < 0 ? 0 : Number(rawNumberOfRatings) || 0;
    }

    this.rating = Number(rawRating) < 0 ? 0 : Number(rawRating) || 0;
    const scale = this.options.ratingScale;

    if (scale < this.rating || scale <= 0) {
      this.logger.error(`The specified Star Rating of {${scale}} scale is invalid.`);
      return false;
    } else {
      this.rating = Math.floor(this.rating * (DEFAULT_SCALE / scale));
      return true;
    }
  }

  private renderComponent() {
    if (this.configuredFieldsHaveValues) {
      for (let starNumber = 1; starNumber <= DEFAULT_SCALE; starNumber++) {
        this.renderStar(starNumber <= this.rating, starNumber);
      }
      if (this.numberOfRatings !== undefined) {
        this.renderNumberOfReviews(this.numberOfRatings);
      }
    }
  }

  private renderStar(isChecked: boolean, value: number) {
    const star = $$('span', { className: 'coveo-star-rating-star' }, SVGIcons.icons.star);
    star.toggleClass('coveo-star-rating-star-active', isChecked);
    this.element.appendChild(star.el);
  }

  private renderNumberOfReviews(value: number) {
    const numberString = $$('span', { className: 'coveo-star-rating-label' });
    numberString.text(value > 0 ? `(${value})` : l('No Ratings'));
    this.element.appendChild(numberString.el);
  }
}

Initialization.registerAutoCreateComponent(StarRating);

import { Component } from '../Base/Component';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { Initialization, IInitializationParameters } from '../Base/Initialization';
import { IResultsComponentBindings } from '../Base/ResultsComponentBindings';
import { IQueryResult } from '../../rest/QueryResult';
import _ = require('underscore');

export interface IBackdropOptions {
  imageUrl?: string;
  imageField?: string;
  overlayColor?: string;
  overlayGradient?: boolean;
}

/**
 * The Backdrop component renders an image URL (either passed as a direct URL or contained in a result field) as a
 * background image. It is useful for displaying information in front of a dynamic background image.
 *
 * The Backdrop component will automatically initialize components embedded within itself:
 *
 * ```html
 *   <div class="CoveoBackdrop" data-image-field="ytthumbnailurl">
 *     <div class="CoveoFieldValue" data-field="somefield"></div>
 *   </div>
 * ```
 */
export class Backdrop extends Component {
  static ID = 'Backdrop';

  /**
   * @componentOptions
   */
  static options: IBackdropOptions = {

    /**
     * Specifies a direct URL from which the background image will be sourced.
     *
     * Has priority over {@link Backdrop.options.imageField}.
     */
    imageUrl: ComponentOptions.buildStringOption(),

    /**
     * Specifies the field from which the background image will be pulled.
     *
     * If {@link Backdrop.options.imageUrl} is specified, it will override this option.
     */
    imageField: ComponentOptions.buildStringOption(),

    /**
     * Specifies the color that will be overlaid on top of the background image.
     * This option needs to be declared as a CSS color. Be sure to use RGBA with an alpha value lower than 1 in order to
     * be able to see the image behind the overlay color.
     *
     * Example value : "`rgba(101, 123, 76, 0.5)`"
     */
    overlayColor: ComponentOptions.buildColorOption(),

    /**
     * Specifies whether the overlay color should be instead be rendered as a top-to-bottom gradient from
     * {@link Backdrop.options.overlayColor} to transparent.
     *
     * Default value is `false`.
     */
    overlayGradient: ComponentOptions.buildBooleanOption({ defaultValue: false, depend: 'overlayColor' }),
  };

  /**
   * Creates a new Backdrop component.
   * @param element The HTMLElement on which the component will be instantiated.
   * @param options The options for the Backdrop component.
   * @param bindings The bindings that the component requires to function normally. If not set, it will be automatically
   * resolved (with a slower execution time).
   * @param result The {@link IQueryResult}.
   */
  constructor(public element: HTMLElement, public options?: IBackdropOptions, bindings?: IComponentBindings, public result?: IQueryResult, public _window?: Window) {
    super(element, Backdrop.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, Backdrop, options);

    this._window = this._window || window;

    let background = '';
    if (this.options.overlayColor) {
      background += `linear-gradient(${this.options.overlayColor}, `
        + (this.options.overlayGradient ? 'rgba(0,0,0,0)' : this.options.overlayColor) + '), ';
    }

    const imageSource = this.options.imageUrl || result.raw[this.options.imageField];
    background += `url('${imageSource}') center center`;

    this.element.style.background = background;
    this.element.style.backgroundSize = 'cover';

    // Initialize components inside
    let initOptions = this.searchInterface.options.originalOptionsObject;
    let resultComponentBindings: IResultsComponentBindings = _.extend({}, this.getBindings(), {
      resultElement: element
    });
    let initParameters: IInitializationParameters = {
      options: _.extend({}, { initOptions: { ResultLink: options } }, initOptions),
      bindings: resultComponentBindings,
      result: result
    };
    Initialization.automaticallyCreateComponentsInside(this.element, initParameters);
  }
}

Initialization.registerAutoCreateComponent(Backdrop);

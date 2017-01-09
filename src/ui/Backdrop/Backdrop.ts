import {Component} from '../Base/Component';
import {ComponentOptions} from '../Base/ComponentOptions';
import {IComponentBindings} from '../Base/ComponentBindings';
import {Initialization, IInitializationParameters} from '../Base/Initialization';
import {IResultsComponentBindings} from '../Base/ResultsComponentBindings';
import {IQueryResult} from '../../rest/QueryResult';
import {$$} from '../../utils/Dom';

export interface IBackdropOptions {
  imageUrl?: string;
  imageField?: string;
  overlayColor?: string;
  overlayGradient?: boolean;
  clickUrlField?: string;
  clickUrl?: string;
}

/**
 * This component is used to render an image URL (either passed as a direct URL
 * or contained in a result's field) as a background image. It is useful for
 * displaying information in front of a dynamic background image. Optionally, it
 * also supports linking to an URL when clicked, which can be sourced from a
 * field or specified manually.
 *
 * Backdrop will automatically initialize components embedded within itself :
 *
 *     <div class="CoveoBackdrop" data-image-field="ytthumbnailurl">
 *       <div class="CoveoFieldValue" data-field="somefield"></div>
 *     </div>
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
     * Has priority over `imageField`.
     */
    imageUrl: ComponentOptions.buildStringOption(),
    /**
     * Specifies the field from which the background image will be pulled.
     *
     * If `imageUrl` is specified, this option will not be considered.
     */
    imageField: ComponentOptions.buildStringOption(),
    /**
     * If specified, this color will be overlaid on top of the background image.
     * It needs to be declared as a CSS color (be sure to use RGBA with an alpha
     * value lower than 1 in order to be able to see the image behind).
     *
     * Example value : "`rgba(101, 123, 76, 0.5)`"
     */
    overlayColor: ComponentOptions.buildColorOption(),
    /**
     * If true, the overlay color will instead be rendered as a top-to-bottom
     * gradient from `overlayColor` to transparent.
     *
     * The default value is `false`.
     */
    overlayGradient: ComponentOptions.buildBooleanOption({ defaultValue: false, depend: 'overlayColor' }),
    /**
     * If specified, the component will redirect the page to this URL when clicked.
     */
    clickUrl: ComponentOptions.buildStringOption(),
    /**
     * If specified, the component will redirect the page to the URL contained in this field.
     * If `clickUrl` is specified, this option will not be considered.
     */
    clickUrlField: ComponentOptions.buildStringOption()
  };

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

    const clickUrl = this.options.clickUrl || result.raw[this.options.clickUrlField];
    if (clickUrl) {
      $$(this.element).on('click', (e: Event) => {
        this._window.location.replace(clickUrl);
      })
    }

    this.element.style.background = background;
    this.element.style.backgroundSize = 'cover';

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

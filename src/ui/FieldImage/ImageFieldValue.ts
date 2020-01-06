import { Component, Initialization } from '../../Core';
import { exportGlobally } from '../../GlobalExports';
import { IQueryResult } from '../../rest/QueryResult';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IFieldOption } from '../Base/IComponentOptions';
import { FieldValue, IFieldValueOptions } from '../FieldValue/FieldValue';

export interface IImageFieldValue {
  field?: IFieldOption;
  width?: number;
  height?: number;
  alt?: string;
  srcTemplate?: string;
}

/**
 * This [result template](https://docs.coveo.com/en/413/) component renders an image from a URL retrieved in a given [`field`]{@link ImageFieldValue.options.field}.
 *
 * A typical use case of this component is to display product images in the context of commerce.
 */
export class ImageFieldValue extends Component {
  static ID = 'ImageFieldValue';
  static doExport = () => {
    exportGlobally({
      ImageFieldValue: ImageFieldValue
    });
  };

  /**
   * The options for the component
   * @componentOptions
   */
  static options: IImageFieldValue = {
    /**
     * **Required**. The name of a field whose value is the URL of the image to display.
     *
     * **Note:** The component uses the value of this field to set the `src` attribute of the [`img`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img) HTML tag it generates.
     */
    field: ComponentOptions.buildFieldOption({ required: true }),
    /**
     * The width of the image (in pixels).
     *
     * **Note:** The component uses this value to set the `width` attribute of the [`img`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img) HTML tag it generates.
     */
    width: ComponentOptions.buildNumberOption(),
    /**
     * The height of the image (in pixels).
     *
     * **Note:** The component uses this value to set the `height` attribute of the [`img`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img) HTML tag it generates.
     */
    height: ComponentOptions.buildNumberOption(),
    /**
     * A [Template literals](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals))
     * from which to generate the `img` tag's `src` attribute value.
     *
     * This option overrides the [`field`]{@link ImageFieldValue.options.field} option value.
     *
     * The template literal can reference any number of fields from the parent result. It can also reference global
     * scope properties.
     *
     * **Examples:**
     *
     * - The following markup generates an `src` value such as `http://uri.com?id=itemTitle`:
     *
     * ```html
     * <a class='CoveoImageFieldValue' data-src-template='${clickUri}?id=${raw.title}'></a>
     * ```
     *
     * - The following markup generates an `src` value such as `localhost/fooBar`:
     *
     * ```html
     * <a class='CoveoImageFieldValue' data-src-template='${window.location.hostname}/{Foo.Bar}'></a>
     * ```
     *
     * Default value is `undefined`.
     */
    srcTemplate: ComponentOptions.buildStringOption()
  };

  /**
   * Creates a new ImageFieldValue.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the ImageFieldValue component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   * @param result The result to associate the component with.
   */
  constructor(public element: HTMLElement, public options: IImageFieldValue, bindings?: IComponentBindings, public result?: IQueryResult) {
    super(element, ImageFieldValue.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, ImageFieldValue, options);

    const fieldValueOption: IFieldValueOptions = {
      field: this.options.field,
      helper: 'image',
      htmlValue: true,
      helperOptions: {
        height: this.options.height,
        width: this.options.width,
        alt: result.title,
        srcTemplate: this.options.srcTemplate
      }
    };
    new FieldValue(element, fieldValueOption, bindings, result);
  }
}

Initialization.registerAutoCreateComponent(ImageFieldValue);

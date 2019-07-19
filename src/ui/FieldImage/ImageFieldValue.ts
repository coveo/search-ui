import { Component, Initialization } from '../../Core';
import { exportGlobally } from '../../GlobalExports';
import { IComponentBindings } from '../Base/ComponentBindings';
import { IQueryResult } from '../../rest/QueryResult';
import { FieldValue, IFieldValueOptions } from '../FieldValue/FieldValue';
import { ComponentOptions, IFieldOption } from '../Base/ComponentOptions';

export interface IImageFieldValue {
  field?: IFieldOption;
  width?: number;
  height?: number;
  alt?: string;
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
    height: ComponentOptions.buildNumberOption()
  };

  /**
   * Creates a new ImageFieldValue.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the ImageFieldValue component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   * @param result The result to associate the component with.
   */
  constructor(
    public element: HTMLElement,
    public options: IImageFieldValue,
    bindings?: IComponentBindings,
    public result?: IQueryResult,
    ImageFieldValueClassId: string = ImageFieldValue.ID
  ) {
    super(element, ImageFieldValueClassId, bindings);

    this.options = ComponentOptions.initComponentOptions(element, ImageFieldValue, options);

    const fieldValueOption: IFieldValueOptions = {
      field: this.options.field,
      helper: 'image',
      htmlValue: true,
      helperOptions: {
        height: this.options.height,
        width: this.options.width,
        alt: result.title
      }
    };
    new FieldValue(element, fieldValueOption, bindings, result);
  }
}

Initialization.registerAutoCreateComponent(ImageFieldValue);

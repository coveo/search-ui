import { Component, Initialization } from '../../Core';
import { exportGlobally } from '../../GlobalExports';
import { IComponentBindings } from '../Base/ComponentBindings';
import { IQueryResult } from '../../rest/QueryResult';
import { FieldValue, IFieldValueOptions } from '../FieldValue/FieldValue';
import { ComponentOptions, IFieldOption } from '../Base/ComponentOptions';

export interface IImageFieldValue {
  field?: IFieldOption;
  width?: string;
  height?: string;
}

/**
 * The ImageFieldValue component displays the value of a field associated to its parent search result.
 * It is use strictly for displaying an image.
 *
 * This component is a result template component (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 *
 * A common use of this component is to display the image of a product for sale.
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
     * Specifies the field that the ImageFieldValue should display.
     *
     * Specifying a value for this parameter is required in order for the ImageFieldValue component to work.
     *
     * **Default value:** `@field`
     */
    field: ComponentOptions.buildFieldOption({ defaultValue: '@field', required: true }),
    /**
     * The width of the image
     *
     * the value can either be in `pixels` or `pourcentages`
     */
    width: ComponentOptions.buildStringOption(),
    /**
     * The height of the image
     *
     * the value can either be in `pixels` or `pourcentages`
     */
    height: ComponentOptions.buildStringOption()
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
        width: this.options.width
      }
    };
    new FieldValue(element, fieldValueOption, bindings, result);
  }
}

Initialization.registerAutoCreateComponent(ImageFieldValue);

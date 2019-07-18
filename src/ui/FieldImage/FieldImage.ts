import { Component, Initialization } from '../../Core';
import { exportGlobally } from '../../GlobalExports';
import { IComponentBindings } from '../Base/ComponentBindings';
import { IQueryResult } from '../../rest/QueryResult';
import { FieldValue, IFieldValueOptions } from '../FieldValue/FieldValue';
import { ComponentOptions, IFieldOption } from '../Base/ComponentOptions';

export interface IFieldImage {
  field?: IFieldOption;
  width?: string;
  height?: string;
}

/**
 * The FieldImage component displays the value of a field associated to its parent search result.
 * It is use strictly for displaying an image.
 *
 * This component is a result template component (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 *
 * A common use of this component is to display the image of a product for sale.
 */
export class FieldImage extends Component {
  static ID = 'FieldImage';
  static doExport = () => {
    exportGlobally({
      FieldImage: FieldImage
    });
  };

  /**
   * The options for the component
   * @componentOptions
   */
  static options: IFieldImage = {
    /**
     * Specifies the field that the FieldImage should display.
     *
     * Specifying a value for this parameter is required in order for the FieldImage component to work.
     */
    field: ComponentOptions.buildFieldOption({ defaultValue: '@field', required: true }),
    /**
     * The width of the image
     */
    width: ComponentOptions.buildStringOption(),
    /**
     * The height of the image
     */
    height: ComponentOptions.buildStringOption()
  };

  /**
   * Creates a new FieldImage.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the FieldImage component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   * @param result The result to associate the component with.
   */
  constructor(
    public element: HTMLElement,
    public options: IFieldImage,
    bindings?: IComponentBindings,
    public result?: IQueryResult,
    fieldImageClassId: string = FieldImage.ID
  ) {
    super(element, fieldImageClassId, bindings);

    this.options = ComponentOptions.initComponentOptions(element, FieldImage, options);

    const fieldValueOption: IFieldValueOptions = {
      field: this.options.field,
      helper: 'image',
      htmlValue: true,
      helperOptions: {
        height: this.options.height,
        width: this.options.width
      }
    };
    new FieldValue(this.element, fieldValueOption, bindings, this.result, fieldImageClassId);
  }
}

Initialization.registerAutoCreateComponent(FieldImage);

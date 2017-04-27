import {Template} from '../Templates/Template'
import {Component} from '../Base/Component'
import {IComponentBindings} from '../Base/ComponentBindings'
import {ComponentOptions} from '../Base/ComponentOptions'
import {DefaultResultAttachmentTemplate} from './DefaultResultAttachmentTemplate'
import {IQueryResult} from '../../rest/QueryResult'
import {Utils} from '../../utils/Utils'
import {QueryUtils} from '../../utils/QueryUtils'
import {Initialization, IInitializationParameters} from '../Base/Initialization';
import {Assert} from '../../misc/Assert'
import {$$} from '../../utils/Dom'

export interface IResultAttachmentsOptions {
  resultTemplate?: Template;
  subResultTemplate?: Template;
  maximumAttachmentLevel?: number;
}

/**
 * This component is used to render attachments in a result set, for example when displaying emails.<br/>
 * It is intended to be used inside a result template when there is an active {@link Folding} component
 * inside the page.
 */
export class ResultAttachments extends Component {
  static ID = 'ResultAttachments';

  /**
   * The options for the component
   * @componentOptions
   */
  static options: IResultAttachmentsOptions = {
    /**
     * Specifies the template to use to render each of the attachments for a top result.<br/>
     * By default, it will use the template specified in a child element with a `<script>` tag.<br/>
     * This can be specified directly as an attribute to the element, for example :
     * ```html
     * <div class="CoveoResultFolding" data-result-template-id="Foo"></div>
     * ```
     * which will use a previously registered template ID (see {@link TemplateCache})
     */
    resultTemplate: ComponentOptions.buildTemplateOption({ defaultFunction: (e) => new DefaultResultAttachmentTemplate() }),
    /**
     * Specifies the template to use to render sub-attachments, which are attachments within other attachments,
     * for example multiple files embedded in a .zip attachment.<br/>
     * Sub-attachments can also contain other sub-attachments.<br/>
     * The template can be specified the same way as {@link ResultAttachments.options.resultTemplate resultTemplate}
     */
    subResultTemplate: ComponentOptions.buildTemplateOption({ postProcessing: (value: Template, options: IResultAttachmentsOptions) => value != null ? value : options.resultTemplate }),
    /**
     * Specifies the maximum nesting depth at which the component should stop rendering sub-attachments.<br/>
     * The default value is 5.
     */
    maximumAttachmentLevel: ComponentOptions.buildNumberOption({ defaultValue: 5, min: 0 })
  }

  private attachments: IQueryResult[];

  /**
   * Build a new ResultAttachments component
   * @param element
   * @param options
   * @param bindings
   * @param result
   * @param attachmentLevel
   */
  constructor(public element: HTMLElement, public options?: IResultAttachmentsOptions, public bindings?: IComponentBindings, result?: IQueryResult, public attachmentLevel = 0) {
    super(element, ResultAttachments.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, ResultAttachments, options);

    this.attachments = result.attachments;
    if (Utils.isNonEmptyArray(this.attachments)) {
      this.renderAttachments();
    }
  }

  private renderAttachments() {
    _.each(this.attachments, (attachment) => {
      QueryUtils.setStateObjectOnQueryResult(this.queryStateModel.get(), attachment)
      var container = this.attachmentLevel > 0 ? this.options.subResultTemplate.instantiateToElement(attachment) : this.options.resultTemplate.instantiateToElement(attachment);

      this.autoCreateComponentsInsideResult(container, _.extend({}, attachment, { attachments: [] }));

      $$(container).addClass('coveo-result-attachments-container');
      this.element.appendChild(container);

      if (this.attachmentHasSubAttachment(attachment) && this.attachmentLevel < this.options.maximumAttachmentLevel) {
        var childAttachmentContainer = $$('div').el;
        container.appendChild(childAttachmentContainer);
        new ResultAttachments(childAttachmentContainer, this.options, this.bindings, attachment, this.attachmentLevel + 1);
      }
    })
  }

  private attachmentHasSubAttachment(attachment: IQueryResult) {
    if (Utils.isNonEmptyArray(attachment.attachments)) {
      return true;
    } else if (Utils.isNonEmptyArray(attachment.childResults)) {
      attachment.attachments = attachment.childResults;
      return true;
    } else {
      return false;
    }
  }

  private autoCreateComponentsInsideResult(element: HTMLElement, result: IQueryResult) {
    Assert.exists(element);
    var initOptions = this.searchInterface.options;
    var initParameters: IInitializationParameters = {
      options: initOptions,
      bindings: this.getBindings(),
      result: result
    }
    Initialization.automaticallyCreateComponentsInside(element, initParameters, [ResultAttachments.ID]);
  }
}

Initialization.registerAutoCreateComponent(ResultAttachments);

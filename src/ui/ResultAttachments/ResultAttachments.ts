import { Template } from '../Templates/Template';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { DefaultResultAttachmentTemplate } from './DefaultResultAttachmentTemplate';
import { IQueryResult } from '../../rest/QueryResult';
import { Utils } from '../../utils/Utils';
import { QueryUtils } from '../../utils/QueryUtils';
import { Initialization, IInitializationParameters } from '../Base/Initialization';
import { Assert } from '../../misc/Assert';
import { $$ } from '../../utils/Dom';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';

import 'styling/_ResultAttachments';

export interface IResultAttachmentsOptions {
  resultTemplate?: Template;
  subResultTemplate?: Template;
  maximumAttachmentLevel?: number;
}

/**
 * The `ResultAttachments` component renders attachments in a result set, for example when displaying emails. This
 * component is usable inside a result template when there is an active [`Folding`]{@link Folding} component in the
 * page.
 *
 * This component is a result template component (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 * @notSupportedIn salesforcefree
 */
export class ResultAttachments extends Component {
  static ID = 'ResultAttachments';

  static doExport = () => {
    exportGlobally({
      ResultAttachments: ResultAttachments,
      DefaultResultAttachmentTemplate: DefaultResultAttachmentTemplate
    });
  };

  /**
   * The options for the component
   * @componentOptions
   */
  static options: IResultAttachmentsOptions = {
    /**
     * Specifies the template to use to render each attachment for a top result.
     *
     * You can specify a previously registered template to use either by referring to its HTML `id` attribute or to a
     * CSS selector (see {@link TemplateCache}).
     *
     * **Examples:**
     *
     * Specifying a previously registered template by referring to its HTML `id` attribute:
     *
     * ```html
     * <div class="CoveoResultAttachments" data-result-template-id="Foo"></div>
     * ```
     *
     * Specifying a previously registered template by referring to a CSS selector:
     *
     * ```html
     * <div class='CoveoResultAttachments' data-result-template-selector=".Foo"></div>
     * ```
     *
     * If you do not specify a custom folding template, the component uses the default result attachment template.
     */
    resultTemplate: ComponentOptions.buildTemplateOption({
      defaultFunction: e => new DefaultResultAttachmentTemplate()
    }),

    /**
     * Specifies the template to use to render sub-attachments, which are attachments within attachments, for example
     * when multiple files are embedded within a `.zip` attachment.
     *
     * Sub-attachments can themselves contain sub-attachments, and so on up to a certain level (see the
     * [`maximumAttachmentLevel`]{@link ResultAttachments.options.maximumAttachmentLevel} option).
     *
     * You can specify a previously registered template to use either by referring to its HTML `id` attribute or to a
     * CSS selector (see {@link TemplateCache}).
     *
     * **Example:**
     *
     * Specifying a previously registered template by referring to its HTML `id` attribute:
     *
     * ```html
     * <div class="CoveoResultAttachments" data-sub-result-template-id="Foo"></div>
     * ```
     *
     * Specifying a previously registered template by referring to a CSS selector:
     *
     * ```html
     * <div class="CoveoResultAttachments" data-sub-result-template-selector=".Foo"></div>
     * ```
     *
     * By default, this option uses the same template you specify for the
     * [`resultTemplate`]{@link ResultAttachments.options.resultTemplate} option.
     */
    subResultTemplate: ComponentOptions.buildTemplateOption({
      postProcessing: (value: Template, options: IResultAttachmentsOptions) => (value != null ? value : options.resultTemplate)
    }),

    /**
     * Specifies the maximum nesting depth. Beyond this depth, the component stops rendering sub-attachments.
     *
     * Default value is `5`. Minimum value is `0`.
     */
    maximumAttachmentLevel: ComponentOptions.buildNumberOption({ defaultValue: 5, min: 0 })
  };

  private attachments: IQueryResult[];

  /**
   * Creates a new `ResultAttachments` component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the `ResultAttachments` component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   * @param result The result to associate the component with.
   * @param attachmentLevel The nesting depth.
   */
  constructor(
    public element: HTMLElement,
    public options?: IResultAttachmentsOptions,
    public bindings?: IComponentBindings,
    result?: IQueryResult,
    public attachmentLevel = 0
  ) {
    super(element, ResultAttachments.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, ResultAttachments, options);

    this.attachments = result.attachments;
    if (Utils.isNonEmptyArray(this.attachments)) {
      this.renderAttachments();
    }
  }

  private renderAttachments() {
    _.each(this.attachments, attachment => {
      QueryUtils.setStateObjectOnQueryResult(this.queryStateModel.get(), attachment);
      QueryUtils.setSearchInterfaceObjectOnQueryResult(this.searchInterface, attachment);
      let subTemplatePromise =
        this.attachmentLevel > 0
          ? this.options.subResultTemplate.instantiateToElement(attachment)
          : this.options.resultTemplate.instantiateToElement(attachment);

      subTemplatePromise.then((container: HTMLElement) => {
        this.autoCreateComponentsInsideResult(container, _.extend({}, attachment, { attachments: [] }));

        $$(container).addClass('coveo-result-attachments-container');
        this.element.appendChild(container);

        if (this.attachmentHasSubAttachment(attachment) && this.attachmentLevel < this.options.maximumAttachmentLevel) {
          var childAttachmentContainer = $$('div').el;
          container.appendChild(childAttachmentContainer);
          new ResultAttachments(childAttachmentContainer, this.options, this.bindings, attachment, this.attachmentLevel + 1);
        }
      });
    });
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
    };
    Initialization.automaticallyCreateComponentsInside(element, initParameters, [ResultAttachments.ID]);
  }
}

Initialization.registerAutoCreateComponent(ResultAttachments);

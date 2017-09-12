import { Template } from '../Templates/Template';
import { Component } from '../Base/Component';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { IQueryResult } from '../../rest/QueryResult';
import { Assert } from '../../misc/Assert';
import { Initialization, IInitializationParameters } from '../Base/Initialization';
import { $$ } from '../../utils/Dom';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';

export interface ITemplateLoaderOptions {
  template: Template;
  condition?: String;
}

/**
 * The TemplateLoader component can load one result template into another. You should normally declare any reusable
 * result template outside of the {@link ResultList} component. Otherwise, the framework will evaluate the
 * `data-condition` of the reusable result template and possibly render it.
 *
 * **Example:**
 *
 * ```html
 * [ ... ]
 *
 * <!-- A reusable result template. Note that it is important to declare it outside of the ResultList component. -->
 * <script type='text/underscore' class='result-template' id='ReusableTemplate'>
 *   <table class='CoveoFieldTable'>
 *     <tr data-field='@source' data-caption='Source'></tr>
 *     <tr data-field='@percentScore' data-caption='Score'></tr>
 *   </table>
 * </script>
 *
 * [ ... ]
 *
 * <div class="CoveoResultList" data-wait-animation="fade" data-auto-select-fields-to-include="true">
 *
 *   <!-- A custom result template for Lithium messages. -->
 *   <script type='text/underscore' class='result-template' data-condition='raw.filetype == "lithiummessage"'>
 *     <div>
 *       <img class='CoveoIcon' data-small='true'>
 *       <a class='CoveoResultLink'></a>
 *       <div class='CoveoTemplateLoader' data-template-id='ReusableTemplate'></div>
 *     </div>
 *   </script>
 *
 *   <!-- A custom result template for images. -->
 *   <script type='text/underscore' class='result-template' data-condition='raw.filetype == "Image"'>
 *     <div>
 *       <img class='CoveoIcon' data-small='true'></img>
 *         <a class='CoveoResultLink'>
 *           <img class='CoveoThumbnail'>
 *         </a>
 *       <div class='CoveoTemplateLoader' data-template-id='ReusableTemplate'></div>
 *     </div>
 *   </script>
 * </div>
 *
 * [ ... ]
 * ```
 *
 * See [Result Templates](https://developers.coveo.com/x/aIGfAQ).
 */
export class TemplateLoader extends Component {
  static ID = 'TemplateLoader';

  static doExport = () => {
    exportGlobally({
      TemplateLoader: TemplateLoader
    });
  };

  /**
   * The possible options for a TemplateLoader.
   * @componentOptions
   */
  static options: ITemplateLoaderOptions = {
    /**
     * Specifies how to find the template. This can be either a CSS selector or an HTML `id` attribute.
     *
     * **Examples:**
     *
     * - With a CSS selector: `data-template-selector='.MySelector'`
     * - With an HTML `id`: `data-template-id='MyId'`
     */
    template: ComponentOptions.buildTemplateOption(),

    /**
     * Specifies the boolean condition that the result must satisfy in order for the template to load.
     *
     * **Example:**
     *
     * `data-condition='percentScore > 80'`
     */
    condition: ComponentOptions.buildStringOption()
  };

  /**
   * Creates a new TemplateLoader.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the TemplateLoader component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   * @param result The result to associate the component with.
   */
  constructor(
    public element: HTMLElement,
    public options?: ITemplateLoaderOptions,
    public bindings?: IComponentBindings,
    public result?: IQueryResult
  ) {
    super(element, TemplateLoader.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, TemplateLoader, options);
    this.result = this.result || this.resolveResult();
    Assert.exists(this.result);

    if (this.options.condition != null) {
      var conditionFunction = new Function('obj', 'with(obj||{}){return ' + this.options.condition + '}');
      if (conditionFunction(this.result)) {
        this.initialize();
      }
    } else {
      this.initialize();
    }
  }

  private initialize() {
    if (this.options.template != null) {
      var initOptions = this.searchInterface.options;
      var initParameters: IInitializationParameters = {
        options: initOptions,
        bindings: this.bindings,
        result: this.result
      };

      var parents = $$(this.element).parents(Component.computeCssClassName(TemplateLoader));
      _.each(parents, (parent: HTMLElement) => {
        let clone = <HTMLElement>parent.cloneNode();
        $$(clone).empty();
        let outerHTMLParent = clone.outerHTML;
        Assert.check(outerHTMLParent.indexOf(this.element.outerHTML) === -1, 'TemplateLoader cannot load a template into itself.');
      });

      this.element.innerHTML = this.options.template.instantiateToString(this.result, {
        checkCondition: false,
        responsiveComponents: this.bindings ? this.bindings.searchInterface.responsiveComponents : null
      });
      Initialization.automaticallyCreateComponentsInside(this.element, initParameters);
    }
  }
}

Initialization.registerAutoCreateComponent(TemplateLoader);

import {Template} from '../Templates/Template';
import {Component} from '../Base/Component';
import {ComponentOptions} from '../Base/ComponentOptions';
import {IComponentBindings} from '../Base/ComponentBindings';
import {IQueryResult} from '../../rest/QueryResult';
import {Assert} from '../../misc/Assert';
import {Initialization, IInitializationParameters} from '../Base/Initialization';
import {$$} from '../../utils/Dom';

export interface ITemplateLoaderOptions {
  template: Template;
  condition?: String;
}

/**
 * This component can be used to load one result template into another. A reusable result template should normally be
 * declared outside of the {@link ResultList} component. Note that a TemplateLoader cannot load a template into itself.
 *
 * # Example
 *
 * ```
 * [ ... ]
 *
 * <!-- A reusable result template. Note that it is declared outside of the ResultList component. -->
 * <script type='text/underscore' class='result-template' id='ReusableTemplate'>
 *   <table class='CoveoFieldTable'>
 *     <tr data-field='@source' data-caption='Source'></tr>
 *     <tr data-field='@percentScore' data-caption='Score'></tr>
 *   </table>
 * </script>
 *
 * [ ... ]
 *
 * <div class="CoveoResultList" data-wait-animation="fade"
 *      data-auto-select-fields-to-include="true">
 *
 *   <!-- A custom result template for Lithium messages. -->
 *   <script type='text/underscore' class='result-template'
 *           data-condition='raw.filetype == "lithiummessage"'>
 *     <div>
 *       <img class='CoveoIcon' data-small='true'>
 *       <a class='CoveoResultLink'></a>
 *       <div class='CoveoTemplateLoader' data-template-id='ReusableTemplate'></div>
 *     </div>
 *   </script>
 *
 *   <!-- A custom result template for images. -->
 *   <script type='text/underscore' class='result-template'
 *           data-condition='raw.filetype == "Image"'>
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
 */
export class TemplateLoader extends Component {
  static ID = 'TemplateLoader';

  /**
   * The possible options for a TemplateLoader.
   * @componentOptions
   */
  static options: ITemplateLoaderOptions = {
    /**
     * Specifies how the template can be found. This can be either a CSS selector or an HTML id global attribute.<br>
     * Example with a CSS selector: `data-template-selector='Example_CSS_Selector'`<br>
     * Example with an HTML id: `data-template-id='Example_HTML_Id'`
     */
    template: ComponentOptions.buildTemplateOption(),
    /**
     * Specifies the boolean condition under which the template should be loaded.<br>
     * Example: `data-condition='percentScore > 80'`
     */
    condition: ComponentOptions.buildStringOption()
  };

  /**
   * Creates a new TemplateLoader component.
   * @param element
   * @param options
   * @param bindings
   * @param result
   */
  constructor(public element: HTMLElement, public options?: ITemplateLoaderOptions, public bindings?: IComponentBindings, public result?: IQueryResult) {
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

      this.element.innerHTML = this.options.template.instantiateToString(this.result, false);
      Initialization.automaticallyCreateComponentsInside(this.element, initParameters);
    }
  }
}

Initialization.registerAutoCreateComponent(TemplateLoader);

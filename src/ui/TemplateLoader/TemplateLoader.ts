import {Template} from '../Templates/Template';
import {Component} from '../Base/Component';
import {ComponentOptions} from '../Base/ComponentOptions';
import {IComponentBindings} from '../Base/ComponentBindings';
import {IQueryResult} from '../../rest/QueryResult';
import {Assert} from '../../misc/Assert';
import {Initialization, IInitializationParameters} from '../Base/Initialization';

export interface ITemplateLoaderOptions {
  template: Template;
  condition?: String;
}

export class TemplateLoader extends Component {
  static ID = 'TemplateLoader';

  static options: ITemplateLoaderOptions = {
    template: ComponentOptions.buildTemplateOption(),
    condition: ComponentOptions.buildStringOption()
  };

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

      var parents = $(this.element).parents('.' + Component.computeCssClassName(TemplateLoader));
      _.each(parents, (parent) => {
        var parentHTML = $(parent).clone().children().remove().end().get(0).outerHTML;
        Assert.check(parentHTML.indexOf(this.element.outerHTML) === -1, 'TemplateLoader cannot load a template into itself.')
      })

      this.element.innerHTML = this.options.template.instantiateToString(this.result, false);
      Initialization.automaticallyCreateComponentsInside(this.element, initParameters);
    }
  }
}

Initialization.registerAutoCreateComponent(TemplateLoader);

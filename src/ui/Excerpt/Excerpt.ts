import {Component} from '../Base/Component';
import {IComponentBindings} from '../Base/ComponentBindings';
import {IQueryResult} from '../../rest/QueryResult';
import {ComponentOptions} from '../Base/ComponentOptions';
import {Assert} from '../../misc/Assert';
import {HighlightUtils} from '../../utils/HighlightUtils';
import {Initialization} from '../Base/Initialization';

/**
 * This component, located in a result template, is used to render the document's excerpt,
 * as well as highlighting searched **keywords** using the appropriate template helpers.
 */
export class Excerpt extends Component {
  static ID = 'Excerpt';

  /**
   * Create a new Excerpt component
   * @param element
   * @param options
   * @param bindings
   * @param result
   */
  constructor(public element: HTMLElement, public options?: any, public bindings?: IComponentBindings, public result?: IQueryResult) {
    super(element, Excerpt.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, Excerpt, options);
    this.result = this.result || this.resolveResult();
    Assert.exists(this.result);
    this.element.innerHTML = HighlightUtils.highlightString(this.result.excerpt, this.result.excerptHighlights, null, 'coveo-highlight');
  }
}

Initialization.registerAutoCreateComponent(Excerpt);

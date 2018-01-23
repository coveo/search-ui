import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { IQueryResult } from '../../rest/QueryResult';
import { ComponentOptions } from '../Base/ComponentOptions';
import { Assert } from '../../misc/Assert';
import { HighlightUtils } from '../../utils/HighlightUtils';
import { Initialization } from '../Base/Initialization';
import { exportGlobally } from '../../GlobalExports';
import 'styling/_Excerpt';

/**
 * The Excerpt component renders an excerpt of its associated result and highlights the keywords from the query using
 * the appropriate template helpers.
 *
 * This component is a result template component (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 */
export class Excerpt extends Component {
  static ID = 'Excerpt';

  static doExport = () => {
    exportGlobally({
      Excerpt: Excerpt
    });
  };

  /**
   * Creates a new Excerpt component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the Excerpt component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   * @param result The result to associate the component with.
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

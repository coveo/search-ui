import {Component, IComponentBindings} from '../Base/Component'
import {ComponentOptions} from '../Base/ComponentOptions'
import {Assert} from '../../misc/Assert'
import {IQueryResult} from '../../rest/QueryResult'
import {Initialization} from '../Base/Initialization';
import {HighlightUtils} from '../../utils/HighlightUtils';


/**
 * You can use the Excerpt component inside @link{ResultTemplates} to take care of rendering the document excerpt, as well as highlight keywords using the correct @link{ResultTemplateHelpers}. 
 */
export class Excerpt extends Component {
  static ID = 'Excerpt';

  constructor(public element: HTMLElement,
    public options?: any,
    public bindings?: IComponentBindings,
    public result?: IQueryResult) {
    super(element, Excerpt.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, Excerpt, options);
    this.result = this.result || this.resolveResult();
    Assert.exists(this.result);
    this.element.innerHTML = HighlightUtils.highlightString(this.result.excerpt, this.result.excerptHighlights, null, 'coveo-highlight');
  }
}
Initialization.registerAutoCreateComponent(Excerpt);

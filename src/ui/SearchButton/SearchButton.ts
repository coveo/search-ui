import {Component} from '../Base/Component';
import {IComponentBindings} from '../Base/ComponentBindings';
import {Utils} from '../../utils/Utils';
import {$$} from '../../utils/Dom';
import {l} from '../../strings/Strings';
import {IAnalyticsNoMeta, analyticsActionCauseList} from '../Analytics/AnalyticsActionListMeta';
import {Initialization} from '../Base/Initialization';

export interface ISearchButtonOptions {
}

/**
 * A component that allows user to trigger a query by clicking on it.<br/>
 * This component will instantiate on an element and add a search icon.<br/>
 * It will also sends an analytics event to the coveo platform when clicked.
 */
export class SearchButton extends Component {
  static ID = 'SearchButton';

  static options: ISearchButtonOptions = {}

  /**
   * Create a new SearchButton on the given element with the given options
   * Bind a click event on the element
   * Adds a search icon on the element
   * @param element
   * @param options
   * @param bindings
   */
  constructor(public element: HTMLElement, public options?: ISearchButtonOptions, bindings?: IComponentBindings) {
    super(element, SearchButton.ID, bindings);

    this.bind.on(element, 'click', () => this.handleClick());
    // Provide a magnifier icon if element contains nothing
    if (Utils.trim($$(this.element).text()) == '') {
      element.innerHTML = '<span class=\'coveo-icon\'>' + l('Search') + '</span>';
    }
  }

  /**
   * Trigger the click handler
   */
  public click() {
    this.handleClick();
  }

  private handleClick() {
    this.logger.debug('Performing query following button click');
    this.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxSubmit, {});
    this.queryController.executeQuery();
  }
}

Initialization.registerAutoCreateComponent(SearchButton);

import { exportGlobally } from '../../GlobalExports';
import { l } from '../../strings/Strings';
import { AccessibleButton } from '../../utils/AccessibleButton';
import { $$ } from '../../utils/Dom';
import { SVGDom } from '../../utils/SVGDom';
import { SVGIcons } from '../../utils/SVGIcons';
import { Utils } from '../../utils/Utils';
import { IAnalyticsNoMeta, analyticsActionCauseList } from '../Analytics/AnalyticsActionListMeta';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { Initialization } from '../Base/Initialization';

export interface ISearchButtonOptions {}

/**
 * The SearchButton component renders a search icon that the end user can click to trigger a new query.
 *
 * See also the {@link Searchbox} component, which can automatically instantiate a SearchButton component along with a
 * {@link Querybox} component or an {@link Omnibox} component.
 */
export class SearchButton extends Component {
  static ID = 'SearchButton';

  static doExport = () => {
    exportGlobally({
      SearchButton: SearchButton
    });
  };

  static options: ISearchButtonOptions = {};

  /**
   * Creates a new SearchButton. Binds a `click` event on the element. Adds a search icon on the element.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the SearchButton component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options?: ISearchButtonOptions, bindings?: IComponentBindings) {
    super(element, SearchButton.ID, bindings);

    new AccessibleButton()
      .withElement(element)
      .withOwner(this.bind)
      .withLabel(l('Search'))
      .withSelectAction(() => this.handleClick())
      .build();

    // Provide a magnifier icon if element contains nothing
    if (Utils.trim($$(this.element).text()) == '') {
      const svgMagnifierContainer = $$('span', { className: 'coveo-search-button' }, SVGIcons.icons.search).el;
      SVGDom.addClassToSVGInContainer(svgMagnifierContainer, 'coveo-search-button-svg');
      const svgLoadingAnimationContainer = $$('span', { className: 'coveo-search-button-loading' }, SVGIcons.icons.loading).el;
      SVGDom.addClassToSVGInContainer(svgLoadingAnimationContainer, 'coveo-search-button-loading-svg');
      element.appendChild(svgMagnifierContainer);
      element.appendChild(svgLoadingAnimationContainer);
    }
  }

  /**
   * Triggers the `click` event handler, which logs a `searchboxSubmit` event in the usage analytics and executes a
   * query.
   */
  public click() {
    this.handleClick();
  }

  private handleClick() {
    this.logger.debug('Performing query following button click');
    this.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxSubmit, {});
    this.queryController.executeQuery({ origin: this });
  }
}

Initialization.registerAutoCreateComponent(SearchButton);

import {Component} from '../Base/Component';
import {ComponentOptions} from '../Base/ComponentOptions';
import {IComponentBindings} from '../Base/ComponentBindings';
import {QueryEvents, IBuildingQueryEventArgs} from '../../events/QueryEvents';
import {SettingsEvents} from '../../events/SettingsEvents';
import {ISettingsPopulateMenuArgs} from '../Settings/Settings';
import {Initialization} from '../Base/Initialization';
import {l} from '../../strings/Strings';
import {$$} from '../../utils/Dom';
import {ModalBox} from '../../ExternalModulesShim';

export interface IAdvancedSearchOptions {
  includeKeywords?: boolean;
}

/**
 * TODO documentation
 */
export class AdvancedSearch extends Component {
  static ID = 'AdvancedSearch'

  /**
   * @componentOptions
   */
  static options: IAdvancedSearchOptions = {
    includeKeywords: ComponentOptions.buildBooleanOption({ defaultValue: true })
  }

  private modal: Coveo.ModalBox.ModalBox

  constructor(public element: HTMLElement, public options?: IAdvancedSearchOptions, bindings?: IComponentBindings) {
    super(element, AdvancedSearch.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, AdvancedSearch, options);

    this.bind.onRootElement(SettingsEvents.settingsPopulateMenu, (args: ISettingsPopulateMenuArgs) => {
        args.menuData.push({
          text: l('AdvancedSearch_Panel'),
          className: 'coveo-advanced-search',
          onOpen: () => this.open(),
          onClose: () => this.close()
        });
    });

    this.buildComponent();
  }

  private buildComponent() {
    this.buildTitle();
    this.buildCloseButton();
    let component = $$('div');
    if(this.options.includeKeywords) {
      component.append(this.buildKeywords());
    }
    this.element.appendChild(component.el);
    $$(this.element).hide();
  }

  private open() {
    $$(this.element).show();
  }

  private close() {
    $$(this.element).hide();
  }

  private buildKeywords(): HTMLElement {
    let keywordsSection = $$('div', { className: 'coveo-advanced-search-keywords-section' });
    let title = $$('div', { className: 'coveo-advanced-search-keywords-title'});
    title.text(l('AdvancedSearchKeywordsSectionTitle'));
    keywordsSection.append(title.el);

    let allKeywords = this.buildKeywordSection('AdvancedSearchAll', this.addAllKeywords);
    let exactKeywords = this.buildKeywordSection('AdvancedSearchExact', this.addExactKeywords);
    let anyKeywords = this.buildKeywordSection('AdvancedSearchAny', this.addAnyKeywords);
    let noneKeywords = this.buildKeywordSection('AdvancedSearchNone', this.addNoneKeywords);
    keywordsSection.append(allKeywords);
    keywordsSection.append(exactKeywords);
    keywordsSection.append(anyKeywords);
    keywordsSection.append(noneKeywords);

    return keywordsSection.el;
  }

  private buildKeywordSection(sectionName: string, onBuildingQuery: (inputValue: string, data: IBuildingQueryEventArgs)=>void): HTMLElement {
    let sectionClassName = 'coveo-advanced-search-keyword coveo' + ComponentOptions.camelCaseToHyphen(sectionName).toLowerCase();
    let keyword = $$('div', { className: sectionClassName});
    let label = $$('span', { className: 'coveo-advanced-search-label' });
    let input = $$('input', { className: 'coveo-share-query-summary-info-input coveo-advanced-search-input' });
    input.on('keydown', (e: KeyboardEvent)=>{
      if(e.keyCode == 13) { // Enter
        this.queryController.executeQuery();
      }
    })
    label.text(l(sectionName + 'Label'));
    keyword.append(label.el);
    keyword.append(input.el);
    this.bind.onRootElement(QueryEvents.buildingQuery, (data: IBuildingQueryEventArgs)=>{onBuildingQuery((<HTMLInputElement>input.el).value, data)})
    return keyword.el;
  }

  private buildCloseButton(): void {
    var closeButton = $$('div', { className: 'coveo-advanced-search-panel-close' }, $$('span', { className: 'coveo-icon' }).el)
    closeButton.on('click', () => {
      this.close();
    })
    $$(this.element).append(closeButton.el);
  }

  private buildTitle(): void {
    var title = $$('div', { className: 'coveo-advanced-search-panel-title' }, l('AdvancedSearch')).el;
    $$(this.element).append(title);
  }

  private addAllKeywords(value: string, data: IBuildingQueryEventArgs) {
    if (value) {
      data.queryBuilder.advancedExpression.add(value);
    }
  }

  private addExactKeywords(value: string, data: IBuildingQueryEventArgs) {
    if (value) {
      data.queryBuilder.advancedExpression.add('"' + value + '"');
    }
  }

  private addAnyKeywords(value: string, data: IBuildingQueryEventArgs) {
    if (value) {
      let splitValues = value.split(' ');
      let generatedValue = "";
      _.each(splitValues, (splitValue) => {
        generatedValue += splitValue + " OR "
      })
      generatedValue = generatedValue.substr(0, generatedValue.length - 4);
      data.queryBuilder.advancedExpression.add(generatedValue);
    }
  }

  private addNoneKeywords(value: string, data: IBuildingQueryEventArgs) {
    if (value) {
      let splitValues = value.split(' ');
      let generatedValue = "";
      _.each(splitValues, (splitValue) => {
        generatedValue += " NOT " + splitValue
      })
      generatedValue = generatedValue.substr(1);
      data.queryBuilder.advancedExpression.add(generatedValue);
    }
  }

}

Initialization.registerAutoCreateComponent(AdvancedSearch);

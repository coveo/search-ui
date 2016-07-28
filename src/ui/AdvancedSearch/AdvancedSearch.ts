import {Component} from '../Base/Component';
import {ComponentOptions} from '../Base/ComponentOptions';
import {IComponentBindings} from '../Base/ComponentBindings';
import {QueryStateModel} from '../../models/QueryStateModel';
import {QueryEvents, IBuildingQueryEventArgs} from '../../events/QueryEvents';
import {SettingsEvents} from '../../events/SettingsEvents';
import {ISettingsPopulateMenuArgs} from '../Settings/Settings';
import {Initialization} from '../Base/Initialization';
import {l} from '../../strings/Strings';
import {$$} from '../../utils/Dom';
import {IAdvancedSearchInput} from './AdvancedSearchInput';
import {KeywordsInput, AllKeywordsInput, ExactKeywordsInput, AnyKeywordsInput, NoneKeywordsInput} from './KeywordsInput';
import {DateInput, AnytimeDateInput, InTheLastDateInput, BetweenDateInput} from './DateInput';
import {SimpleFieldInput, SizeInput, AdvancedFieldInput} from './DocumentInput';
import {ModalBox} from '../../ExternalModulesShim';

export interface IAdvancedSearchOptions {
  includeKeywords?: boolean;
  includeDate?: boolean;
  includeDocument?: boolean;
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
    includeKeywords: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    includeDate: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    includeDocument: ComponentOptions.buildBooleanOption({defaultValue: true})
  }

  private modal: Coveo.ModalBox.ModalBox
  private keywords: KeywordsInput[] = [];
  private dates: DateInput[] = [];
  private documents: IAdvancedSearchInput[] = [];

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

    this.bind.onRootElement(QueryEvents.buildingQuery, (data: IBuildingQueryEventArgs) => {
      _.each(this.dates, (date) => {
        let value = date.getValue();
        if (date.isSelected() && value) {
          data.queryBuilder.advancedExpression.add(value);
        }
      })
      _.each(this.documents, (document) => {
        let value = document.getValue();
        if (value) {
          data.queryBuilder.advancedExpression.add(value);
        }
      })
    })

    this.buildComponent();
  }

  public executeAdvancedSearch() {
    this.updateQueryStateModel();
    this.queryController.executeQuery();
    _.each(this.keywords, (keyword) => {
      keyword.clear();
    })
  }

  private buildComponent() {
    this.buildTitle();
    this.buildCloseButton();
    let component = $$('div');
    if (this.options.includeKeywords) {
      component.append(this.buildKeywordsSection());
    }
    if (this.options.includeDate) {
      component.append(this.buildDateSection());
    }
    if(this.options.includeDocument) {
      component.append(this.buildDocumentSection());
    }

    component.on('keydown', (e: KeyboardEvent) => {
      if (e.keyCode == 13) { // Enter
        this.executeAdvancedSearch();
      }
    })

    this.element.appendChild(component.el);
    $$(this.element).hide();
  }

  private buildTitle(): void {
    var title = $$('div', { className: 'coveo-advanced-search-panel-title' }, l('AdvancedSearch')).el;
    $$(this.element).append(title);
  }

  private buildCloseButton(): void {
    var closeButton = $$('div', { className: 'coveo-advanced-search-panel-close' }, $$('span', { className: 'coveo-icon' }).el)
    closeButton.on('click', () => {
      this.close();
    })
    $$(this.element).append(closeButton.el);
  }

  private open() {
    $$(this.element).show();
  }

  private close() {
    $$(this.element).hide();
  }

  private buildKeywordsSection(): HTMLElement {
    let keywordsSection = $$('div', { className: 'coveo-advanced-search-section coveo-advanced-search-keywords-section' });
    let title = $$('div', { className: 'coveo-advanced-search-section-title' });
    title.text(l('AdvancedSearchKeywordsSectionTitle'));
    keywordsSection.append(title.el);

    this.keywords.push(new AllKeywordsInput());
    this.keywords.push(new ExactKeywordsInput());
    this.keywords.push(new AnyKeywordsInput());
    this.keywords.push(new NoneKeywordsInput());

    _.each(this.keywords, (keyword) => {
      keywordsSection.append(keyword.buildInput());
    })

    return keywordsSection.el;
  }

  private buildDateSection(): HTMLElement {
    let dateSection = $$('div', { className: 'coveo-advanced-search-section coveo-advanced-search-date-section' });
    let title = $$('div', { className: 'coveo-advanced-search-section-title' });
    title.text(l('Date'));
    dateSection.append(title.el);

    this.dates.push(new AnytimeDateInput());
    this.dates.push(new InTheLastDateInput());
    this.dates.push(new BetweenDateInput());

    _.each(this.dates, (date) => {
      dateSection.append(date.buildInput());
    })

    return dateSection.el;
  }

  private buildDocumentSection(): HTMLElement {
    let documentSection = $$('div', { className: 'coveo-advanced-search-section coveo-advanced-search-document-section' });
    let title = $$('div', { className: 'coveo-advanced-search-section-title' });
    title.text(l('AdvancedSearchDocumentSectionTitle'));
    documentSection.append(title.el);

    this.documents.push(new SimpleFieldInput('FileType', '@filetype', this.queryController.getEndpoint()));
    this.documents.push(new SimpleFieldInput('Language', '@language', this.queryController.getEndpoint()));
    this.documents.push(new SizeInput());
    this.documents.push(new AdvancedFieldInput('Title', '@title'));
    this.documents.push(new AdvancedFieldInput('Author', '@author'));

    _.each(this.documents, (document) => {
      documentSection.append(document.buildInput());
    })

    return documentSection.el;
  }

  private updateQueryStateModel() {
    let query = this.queryStateModel.get(QueryStateModel.attributesEnum.q);
    _.each(this.keywords, (keyword) => {
      let inputValue = keyword.getValue();
      if (inputValue) {
        query += query ? '(' + inputValue + ')' : inputValue;
      }
    })
    this.queryStateModel.set(QueryStateModel.attributesEnum.q, query);
  }

}

Initialization.registerAutoCreateComponent(AdvancedSearch);

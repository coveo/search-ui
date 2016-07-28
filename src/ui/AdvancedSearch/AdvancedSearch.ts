import {Component} from '../Base/Component';
import {ComponentOptions} from '../Base/ComponentOptions';
import {IComponentBindings} from '../Base/ComponentBindings';
import {QueryStateModel} from '../../models/QueryStateModel';
import {QueryEvents, IBuildingQueryEventArgs} from '../../events/QueryEvents';
import {AdvancedSearchEvents, IBuildingAdvancedSearchEventArgs} from '../../events/AdvancedSearchEvents';
import {SettingsEvents} from '../../events/SettingsEvents';
import {ISettingsPopulateMenuArgs} from '../Settings/Settings';
import {Initialization} from '../Base/Initialization';
import {l} from '../../strings/Strings';
import {$$, Dom} from '../../utils/Dom';
import {IAdvancedSearchInput, IAdvancedSearchSection} from './AdvancedSearchInput';
import {KeywordsInput, AllKeywordsInput, ExactKeywordsInput, AnyKeywordsInput, NoneKeywordsInput} from './KeywordsInput';
import {DateInput, AnytimeDateInput, InTheLastDateInput, BetweenDateInput} from './DateInput';
import {SimpleFieldInput, SizeInput, AdvancedFieldInput} from './DocumentInput';

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
    includeDocument: ComponentOptions.buildBooleanOption({ defaultValue: true })
  }

  private inputs: IAdvancedSearchInput[] = [];

  constructor(public element: HTMLElement, public options?: IAdvancedSearchOptions, bindings?: IComponentBindings) {
    super(element, AdvancedSearch.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, AdvancedSearch, options);
    this.bindEvents();
    this.buildComponent();
  }

  public executeAdvancedSearch() {
    this.updateQueryStateModel();
    this.queryController.executeQuery();
  }

  private buildComponent() {
    this.buildTitle();
    this.buildCloseButton();
    this.buildContent();
    $$(this.element).hide();
  }

  private buildTitle() {
    var title = $$('div', { className: 'coveo-advanced-search-panel-title' }, l('AdvancedSearch')).el;
    $$(this.element).append(title);
  }

  private buildCloseButton() {
    var closeButton = $$('div', { className: 'coveo-advanced-search-panel-close' }, $$('span', { className: 'coveo-icon' }).el)
    closeButton.on('click', () => {
      this.close();
    })
    $$(this.element).append(closeButton.el);
  }

  private buildContent() {
    let component = $$('div');
    let inputSections: IAdvancedSearchSection[] = [];
    if (this.options.includeKeywords) {
      inputSections.push(this.getKeywordsSection());
    }
    if (this.options.includeDate) {
      inputSections.push(this.getDateSection());
    }
    if (this.options.includeDocument) {
      inputSections.push(this.getDocumentSection());
    }

    $$(this.element).trigger(AdvancedSearchEvents.buildingAdvancedSearch, { sections: inputSections })

    _.each(inputSections, (section) => {
      component.append(this.buildSection(section));
    })

    component.on('keydown', (e: KeyboardEvent) => {
      if (e.keyCode == 13) { // Enter
        this.executeAdvancedSearch();
      }
    })

    $$(this.element).append(component.el);
  }

  private open() {
    $$(this.element).show();
  }

  private close() {
    $$(this.element).hide();
  }

  private getKeywordsSection(): IAdvancedSearchSection {
    let sectionName = 'Keywords';
    let keywordsInputs = []
    keywordsInputs.push(new AllKeywordsInput());
    keywordsInputs.push(new ExactKeywordsInput());
    keywordsInputs.push(new AnyKeywordsInput());
    keywordsInputs.push(new NoneKeywordsInput());
    return { name: sectionName, inputs: keywordsInputs };
  }

  private getDateSection(): IAdvancedSearchSection {
    let sectionName = 'Date';
    let dateInputs = [];
    dateInputs.push(new AnytimeDateInput());
    dateInputs.push(new InTheLastDateInput());
    dateInputs.push(new BetweenDateInput());
    return { name: sectionName, inputs: dateInputs };
  }

  private getDocumentSection(): IAdvancedSearchSection {
    let sectionName = 'Document'
    let documentInputs = []
    documentInputs.push(new SimpleFieldInput('FileType', '@filetype', this.queryController.getEndpoint()));
    documentInputs.push(new SimpleFieldInput('Language', '@language', this.queryController.getEndpoint()));
    documentInputs.push(new SizeInput());
    documentInputs.push(new AdvancedFieldInput('Title', '@title'));
    documentInputs.push(new AdvancedFieldInput('Author', '@author'));
    return { name: sectionName, inputs: documentInputs };
  }

  private buildSection(section: IAdvancedSearchSection): HTMLElement {
    let sectionHTML = $$('div', { className: 'coveo-advanced-search-section' });
    let title = $$('div', { className: 'coveo-advanced-search-section-title' });
    title.text(l('AdvancedSearch' + section.name + 'SectionTitle'));
    sectionHTML.append(title.el);

    this.inputs = _.union(this.inputs, section.inputs);

    _.each(section.inputs, (input) => {
      sectionHTML.append(input.build());
    })

    return sectionHTML.el;
  }

  private updateQueryStateModel() {
    let query = this.queryStateModel.get(QueryStateModel.attributesEnum.q);
    let queryStateInput = _.filter(this.inputs, (input) => {
      return input.shouldUpdateQueryState();
    })
    _.each(queryStateInput, (input) => {
      let inputValue = input.getValue();
      if (inputValue) {
        query += query ? '(' + inputValue + ')' : inputValue;
      }
    })
    this.queryStateModel.set(QueryStateModel.attributesEnum.q, query);
  }

  private bindEvents() {
    this.bind.onRootElement(SettingsEvents.settingsPopulateMenu, (args: ISettingsPopulateMenuArgs) => {
      args.menuData.push({
        text: l('AdvancedSearch_Panel'),
        className: 'coveo-advanced-search',
        onOpen: () => this.open(),
        onClose: () => this.close()
      });
    });

    this.bind.onRootElement(QueryEvents.buildingQuery, (data: IBuildingQueryEventArgs) => {
      let buildingQueryInputs = _.filter(this.inputs, (input) => {
        return input.shouldUpdateOnBuildingQuery();
      })
      _.each(buildingQueryInputs, (input) => {
        let value = input.getValue();
        if (value) {
          data.queryBuilder.advancedExpression.add(value);
        }
      })
    })
  }

}

Initialization.registerAutoCreateComponent(AdvancedSearch);

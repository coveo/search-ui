import {Component} from '../Base/Component';
import {ComponentOptions} from '../Base/ComponentOptions';
import {IComponentBindings} from '../Base/ComponentBindings';
import {QueryEvents, IBuildingQueryEventArgs} from '../../events/QueryEvents';
import {AdvancedSearchEvents} from '../../events/AdvancedSearchEvents';
import {SettingsEvents} from '../../events/SettingsEvents';
import {ISettingsPopulateMenuArgs} from '../Settings/Settings';
import {Initialization} from '../Base/Initialization';
import {l} from '../../strings/Strings';
import {$$} from '../../utils/Dom';
import {IAdvancedSearchInput, IAdvancedSearchSection} from './AdvancedSearchInput';
import {AllKeywordsInput} from './KeywordsInput/AllKeywordsInput';
import {ExactKeywordsInput} from './KeywordsInput/ExactKeywordsInput';
import {AnyKeywordsInput} from './KeywordsInput/AnyKeywordsInput';
import {NoneKeywordsInput} from './KeywordsInput/NoneKeywordsInput';
import {AnytimeDateInput} from './DateInput/AnytimeDateInput';
import {InTheLastDateInput} from './DateInput/InTheLastDateInput';
import {BetweenDateInput} from './DateInput/BetweenDateInput';
import {SimpleFieldInput} from './DocumentInput/SimpleFieldInput';
import {SizeInput} from './DocumentInput/SizeInput';
import {AdvancedFieldInput} from './DocumentInput/AdvancedFieldInput';

export interface IAdvancedSearchOptions {
  includeKeywords?: boolean;
  includeDate?: boolean;
  includeDocument?: boolean;
}

/**
 * The Advanced Search component allows the user to easily create a complex query to send to the index.
 * The component also allows custom code to modify the content by using the buildingAdvancedSearch event.
 */
export class AdvancedSearch extends Component {
  static ID = 'AdvancedSearch'

  /**
   * @componentOptions
   */
  static options: IAdvancedSearchOptions = {
    /**
     * Specifies whether or not to include the built-in keywords section.
     * Default is `true`
     */
    includeKeywords: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * Specifies whether or not to include the built-in date section.
     * Default is `true`
     */
    includeDate: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * Specifies whether or not to include the built-in document section.
     * Default is `true`
     */
    includeDocument: ComponentOptions.buildBooleanOption({ defaultValue: true })
  }

  public inputs: IAdvancedSearchInput[] = [];

  constructor(public element: HTMLElement, public options?: IAdvancedSearchOptions, bindings?: IComponentBindings) {
    super(element, AdvancedSearch.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, AdvancedSearch, options);
    this.bindEvents();
    this.buildComponent();
  }

  /**
   * Launch the advanced search query.
   */
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
    closeButton.on('click', () => this.close());
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

    $$(this.element).append(component.el);
  }

  private open() {
    $$(this.element).show();
  }

  private close() {
    $$(this.element).hide();
  }

  private getKeywordsSection(): IAdvancedSearchSection {
    let sectionName = l('Keywords');
    let keywordsInputs = [];
    keywordsInputs.push(new AllKeywordsInput());
    keywordsInputs.push(new ExactKeywordsInput());
    keywordsInputs.push(new AnyKeywordsInput());
    keywordsInputs.push(new NoneKeywordsInput());
    return { name: sectionName, inputs: keywordsInputs };
  }

  private getDateSection(): IAdvancedSearchSection {
    let sectionName = l('Date');
    let dateInputs = [];
    dateInputs.push(new AnytimeDateInput());
    dateInputs.push(new InTheLastDateInput());
    dateInputs.push(new BetweenDateInput());
    return { name: sectionName, inputs: dateInputs };
  }

  private getDocumentSection(): IAdvancedSearchSection {
    let sectionName = l('Document');
    let documentInputs = [];
    documentInputs.push(new SimpleFieldInput(l('FileType'), '@filetype', this.queryController.getEndpoint()));
    documentInputs.push(new SimpleFieldInput(l('Language'), '@language', this.queryController.getEndpoint()));
    documentInputs.push(new SizeInput());
    documentInputs.push(new AdvancedFieldInput(l('Title'), '@title'));
    documentInputs.push(new AdvancedFieldInput(l('Author'), '@author'));
    return { name: sectionName, inputs: documentInputs };
  }

  private buildSection(section: IAdvancedSearchSection): HTMLElement {
    let sectionHTML = $$('div', { className: 'coveo-advanced-search-section coveo-advanced-search-' + section.name.toLowerCase() + '-section' });
    let title = $$('div', { className: 'coveo-advanced-search-section-title' });
    title.text(section.name);
    sectionHTML.append(title.el);

    this.inputs = _.union(this.inputs, section.inputs);

    _.each(section.inputs, (input) => {
      sectionHTML.append(input.build());
    })

    return sectionHTML.el;
  }

  private updateQueryStateModel() {
    _.each(this.inputs, (input) => {
      if (input.updateQueryState) {
        input.updateQueryState(this.queryStateModel);
      }
    })
  }

  private bindEvents() {
    this.bind.onRootElement(SettingsEvents.settingsPopulateMenu, (args: ISettingsPopulateMenuArgs) => {
      args.menuData.push({
        text: l('AdvancedSearch'),
        className: 'coveo-advanced-search',
        onOpen: () => this.open(),
        onClose: () => this.close()
      });
    });

    this.bind.onRootElement(QueryEvents.buildingQuery, (data: IBuildingQueryEventArgs) => {
      _.each(this.inputs, (input) => {
        if (input.updateQuery) {
          input.updateQuery(data.queryBuilder);
        }
      })
    })
  }

}

Initialization.registerAutoCreateComponent(AdvancedSearch);

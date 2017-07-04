import {$$, Dom} from "../../../src/utils/Dom";
import {SearchEndpoint} from "../../../src/rest/SearchEndpoint";
import {IComponentPlaygroundConfiguration, PlaygroundConfiguration} from "./PlaygroundConfiguration";
import {ResultList} from "../../../src/ui/ResultList/ResultList";
import {QueryEvents, IBuildingQueryEventArgs} from "../../../src/events/QueryEvents";
import { setLanguageAfterPageLoaded } from '../../../src/strings/DefaultLanguage';
setLanguageAfterPageLoaded();

declare var Coveo;
declare var $;

export class Playground {
  private componentContainer: Dom;
  private showButton: Dom;
  private hideButton: Dom;
  private initialized = false;

  constructor(public body: HTMLBodyElement) {
    let previewContainer = $$(document.body).find('.preview-container');
    if (this.isComponentPage() && this.shouldInitialize()) {
      this.initializePreview();
    } else {
      previewContainer.remove();
    }
  }

  public getTitle(): HTMLElement {
    return $$(this.body).find('.tsd-page-title h1');
  }

  public getConfiguration(): IComponentPlaygroundConfiguration {
    return PlaygroundConfiguration[this.getComponentName()];
  }

  public shouldInitialize() {
    let name = this.getComponentName();
    let configuration = this.getConfiguration();
    return name && configuration && configuration.show;
  }

  public isComponentPage() {
    return $$(this.getTitle()).text().toLowerCase().indexOf('coveo component') != -1;
  }

  public getComponentName() {
    let match = $$(this.getTitle()).text().match(/([a-zA-Z]+)$/);
    if (match) {
      return match[1];
    }
    return null;
  }

  public hide() {
    this.showButton.show();
    this.hideButton.hide();
    $(this.componentContainer.el).slideUp();
  }

  public show() {
    this.showButton.hide();
    this.hideButton.show();
    $(this.componentContainer.el).slideDown(undefined, ()=> {
      if (!this.initialized) {
        this.initializeComponent();
      }
    });
  }

  public initializeComponent() {
    let configuration = this.getConfiguration();
    SearchEndpoint.configureSampleEndpointV2();
    let searchInterface = this.getSearchInterface();
    this.componentContainer.append(searchInterface.el);
    Coveo.SearchEndpoint.endpoints['default'] = SearchEndpoint.endpoints['default'];
    let initOptions = this.getInitConfig();
    Coveo.init(searchInterface.el, initOptions);
    this.initialized = true;
    if(this.getConfiguration().toExecute) {
      this.getConfiguration().toExecute();
    }
    this.triggerQuery(configuration, searchInterface.el);

  }

  public getInitConfig() {
    let initOptions = {};
    let configuration = this.getConfiguration();
    initOptions[this.getComponentName()] = configuration.options;
    initOptions['SearchInterface'] = PlaygroundConfiguration['SearchInterface'].options;
    if (configuration.isResultComponent) {
      initOptions['SearchInterface'].resultsPerPage = 1;
    }
    return initOptions;
  }

  public getSearchInterface(): Dom {
    let searchInterface = $$('div', {
      className: 'CoveoSearchInterface',
      'data-design': 'new'
    });
    let configuration = this.getConfiguration();
    if (configuration.isResultComponent) {
      this.insertElementIntoResultList(searchInterface);
    } else {
      this.insertElementIntoSearchInterface(searchInterface);
    }
    return searchInterface;
  }

  public initializePreview() {
    let previewContainer = $$(document.body).find('.preview-container');
    this.showButton = $$('button', {className: 'preview-toggle'}, `Show a live example of ${this.getComponentName()}`);
    this.hideButton = $$('button', {className: 'preview-toggle'}, 'Hide example');
    this.componentContainer = $$('div', {className: 'component-container'});
    this.componentContainer.hide();
    this.hideButton.hide();
    this.showButton.on('click', ()=> {
      this.show();
    });

    this.hideButton.on('click', ()=> {
      this.hide();
    });
    previewContainer.appendChild(this.showButton.el);
    previewContainer.appendChild(this.hideButton.el);
    previewContainer.appendChild(this.componentContainer.el);
  }

  public insertElementIntoResultList(searchInterface: Dom) {
    let resultListElement = $$('div', {className: 'CoveoResultList'});
    let scriptElement = $$('script', {
      type: 'text/underscore',
      className: 'result-template'
    });
    let resultContainer = $$('div');
    resultContainer.el.innerHTML = this.getComponentElement().el.outerHTML;
    scriptElement.el.innerHTML = resultContainer.el.outerHTML;
    resultListElement.append(scriptElement.el);
    searchInterface.append(resultListElement.el);
  }

  public insertElementIntoSearchInterface(searchInterface: Dom) {
    searchInterface.append(this.getComponentElement().el);
  }

  public getComponentElement(): Dom {
    if (this.getConfiguration().element) {
      return this.getConfiguration().element;
    }
    return $$('div', {className: `Coveo${Coveo[this.getComponentName()].ID}`});

  }

  public triggerQuery(configuration: IComponentPlaygroundConfiguration, searchInterface: HTMLElement) {
    if (configuration.basicExpression || configuration.advancedExpression) {
      $$(searchInterface).on(QueryEvents.buildingQuery, (e: Event, args: IBuildingQueryEventArgs)=> {
        if (configuration.basicExpression) {
          args.queryBuilder.expression.add(configuration.basicExpression);
        }
        if (configuration.advancedExpression) {
          args.queryBuilder.advancedExpression.add(configuration.advancedExpression);
        }
      });
      let messageAboutBasic = configuration.basicExpression ? `the basic query expression is "<span class='preview-info-emphasis'>${configuration.basicExpression}"</span>` : '';
      let messageAboutAdvanced = configuration.advancedExpression ? `the advanced query expression is "<span class='preview-info-emphasis'>${configuration.advancedExpression}"</span>` : '';
      if (configuration.basicExpression && configuration.advancedExpression) {
        messageAboutBasic += ' and ';
      }
      let messageAboutQuery = $$('div', {className: 'preview-info'}, `Currently showing an example where ${messageAboutBasic}${messageAboutAdvanced}.`)

      $$(searchInterface).prepend(messageAboutQuery.el);
    }
    Coveo['executeQuery'](searchInterface);
  }
}

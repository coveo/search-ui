import {$$, Dom} from "../../../src/utils/Dom";
import {Component} from "../../../src/ui/Base/Component";
import {SearchEndpoint} from "../../../src/rest/SearchEndpoint";
import {init, executeQuery} from "../../../src/ui/Base/RegisteredNamedMethods";
import {IComponentPlaygroundConfiguration, PlaygroundConfiguration} from "./PlaygroundConfiguration";
import {ResultList} from "../../../src/ui/ResultList/ResultList";
import {QueryEvents, IBuildingQueryEventArgs} from "../../../src/events/QueryEvents";

declare var Coveo;

export class Playground {
  private componentContainer: Dom;
  private showButton: Dom;
  private hideButton: Dom;
  private editButton: Dom;
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
    this.editButton.hide();
    $(this.componentContainer.el).slideUp();
  }

  public show() {
    this.showButton.hide();
    this.hideButton.show();
    this.editButton.show();
    $(this.componentContainer.el).slideDown(undefined, ()=> {
      if (!this.initialized) {
        this.initializeComponent();
      }
    });
  }

  public initializeComponent() {
    let configuration = this.getConfiguration()
    SearchEndpoint.configureSampleEndpoint();
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
      className: Component.computeCssClassName(Coveo.SearchInterface),
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
    this.editButton = $$('button', {className: 'preview-edit'}, `Edit`);
    this.componentContainer = $$('div', {className: 'component-container'});
    this.componentContainer.hide();
    this.hideButton.hide();
    this.editButton.hide();
    this.showButton.on('click', ()=> {
      this.show();
    });

    this.hideButton.on('click', ()=> {
      this.hide();
    });
    this.editButton.on('click', ()=> {
      let editDiv = $$('div', {id: 'editor'});
      Coveo.ModalBox['open'](editDiv.el, {
        fullscreen: true,
        overlayClose: true
      });
      let load = ()=> {
        let deferred = $.Deferred();
        let head =
            `<script src="../assets/gen/js/CoveoJsSearch.js"></script>
            <script src="../assets/gen/js/templates/templatesNew.js"></script>
            <link rel="stylesheet" href="../assets/gen/css/CoveoFullSearchNewDesign.css" />
            <script>
              document.addEventListener("DOMContentLoaded", function() {
                Coveo.SearchEndpoint.configureSampleEndpoint();
                Coveo.init(document.querySelector(".CoveoSearchInterface"));
              
              })
            </script>`
        setTimeout(()=> {
          let searchInterface = this.getSearchInterface();
          deferred.resolve({root: '.', body: searchInterface.el.outerHTML, head: head})
        }, 100);
        return deferred;
      };
      let close = ()=> {
        Coveo.ModalBox.close();
      };
      var editor = new Coveo.InterfaceEditor.Editor('#editor', {
        namespace: window.location.pathname,
        basicMode: true,
        load: load,
        save: undefined,
        close: close,
        delete: undefined,
        mobile: false,
        resultCss: 'assets/gen/css/CoveoFullSearchNewDesign.css',
        iconsUrl: 'assets/gen/image/normal-icon-list-new.json',
        repositories: undefined
      });
    });
    previewContainer.appendChild(this.showButton.el);
    previewContainer.appendChild(this.hideButton.el);
    previewContainer.appendChild(this.editButton.el);

    previewContainer.appendChild(this.componentContainer.el);
  }

  public insertElementIntoResultList(searchInterface: Dom) {
    let resultListElement = $$('div', {className: Component.computeCssClassName(ResultList)});
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
    return $$('div', {className: Component.computeCssClassName(Coveo[this.getComponentName()])});

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
    executeQuery(searchInterface);
  }
}

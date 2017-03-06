import { ComponentOptions } from '../Base/ComponentOptions';
import { LocalStorageUtils } from '../../utils/LocalStorageUtils';
import { IFieldDescription } from '../../rest/FieldDescription';
import { IBuildingQueryEventArgs, IQuerySuccessEventArgs, QueryEvents } from '../../events/QueryEvents';
import { ResultListEvents, IDisplayedNewResultEventArgs } from '../../events/ResultListEvents';
import { DebugEvents } from '../../events/DebugEvents';
import { IQueryResults } from '../../rest/QueryResults';
import { IQueryResult } from '../../rest/QueryResult';
import { $$, Dom } from '../../utils/Dom';
import { StringUtils } from '../../utils/StringUtils';
import { SearchEndpoint } from '../../rest/SearchEndpoint';
import { Template } from '../Templates/Template';
import { Promise } from 'es6-promise';
import { RootComponent } from '../Base/RootComponent';
import { QueryController } from '../../controllers/QueryController';
import { BaseComponent } from '../Base/BaseComponent';
import { ModalBox } from '../../ExternalModulesShim';
import Globalize = require('globalize');
import { KEYBOARD } from '../../utils/KeyboardUtils';
import { InitializationEvents } from '../../events/InitializationEvents';
import { IStringMap } from '../../rest/GenericParam';
import _ = require('underscore');

export interface IDebugOptions {
  enableDebug?: boolean;
}

export class Debug extends RootComponent {
  static ID = 'Debug';
  static options: IDebugOptions = {
    enableDebug: ComponentOptions.buildBooleanOption({ defaultValue: false })
  };

  static customOrder = ['error', 'queryDuration', 'result', 'fields', 'rankingInfo', 'template', 'query', 'results', 'state'];

  static durationKeys = ['indexDuration', 'proxyDuration', 'clientDuration', 'duration'];
  static maxDepth = 10;

  public localStorageDebug: LocalStorageUtils<string[]>;
  public collapsedSections: string[];

  private debug = false;
  private highlightRecommendation = false;
  private fields: { [field: string]: IFieldDescription };

  private stackDebug: any;
  private boundEscapeKey: (evt: Event, arg?: any) => void;

  constructor(public element: HTMLElement, public queryController: QueryController, public options?: IDebugOptions, public modalBox = ModalBox) {
    super(element, Debug.ID);
    this.options = ComponentOptions.initComponentOptions(element, Debug, options);
    $$(this.element).on(QueryEvents.buildingQuery, (e, args: IBuildingQueryEventArgs) => {
      args.queryBuilder.enableDebug = this.debug || args.queryBuilder.enableDebug;
    });
    $$(this.element).on(ResultListEvents.newResultDisplayed, (e, args: IDisplayedNewResultEventArgs) => this.handleNewResultDisplayed(args));
    $$(this.element).on(DebugEvents.showDebugPanel, (e, args) => {
      this.handleShowDebugPanel(args);
    });
    $$(this.element).on(InitializationEvents.nuke, () => {
      this.unbindEscapeEvent();
    });

    this.localStorageDebug = new LocalStorageUtils<string[]>('DebugPanel');
    this.collapsedSections = this.localStorageDebug.load() || [];
  }

  public buildFieldsSection(result: IQueryResult) {
    return this.fetchFields()
      .then((fieldDescriptions: IStringMap<IFieldDescription>) => {
        let fields = {};
        _.each(result.raw, (value: any, key: string) => {
          let fieldDescription = fieldDescriptions['@' + key];
          if (fieldDescription == null && key.match(/^sys/)) {
            fieldDescription = fieldDescriptions['@' + key.substr(3)];
          }
          if (fieldDescription == null) {
            fields['@' + key] = value;
          } else if (fieldDescription.fieldType == 'Date') {
            fields['@' + key] = new Date(value);
          } else if (fieldDescription.splitGroupByField && _.isString(value)) {
            fields['@' + key] = value.split(/\s*;\s*/);
          } else {
            fields['@' + key] = value;
          }
        });
        return fields;
      });
  }

  public parseRankingInfo(value: string) {
    let rankingInfo = {};
    if (value) {
      let documentWeights = /Document weights:\n((?:.)*?)\n+/g.exec(value);
      let termsWeight = /Terms weights:\n((?:.|\n)*)\n+/g.exec(value);
      let totalWeight = /Total weight: ([0-9]+)/g.exec(value);

      if (documentWeights && documentWeights[1]) {
        rankingInfo['Document weights'] = this.parseWeights(documentWeights[1]);
      }

      if (totalWeight && totalWeight[1]) {
        rankingInfo['Total weight'] = Number(totalWeight[1]);
      }

      if (termsWeight && termsWeight[1]) {
        let terms = StringUtils.match(termsWeight[1], /((?:[^:]+: [0-9]+, [0-9]+; )+)\n((?:\w+: [0-9]+; )+)/g);
        rankingInfo['Terms weights'] = _.object(_.map(terms, (term) => {
          let words = _.object(_.map(StringUtils.match(term[1], /([^:]+): ([0-9]+), ([0-9]+); /g), (word) => {
            return [
              word[1],
              {
                Correlation: Number(word[2]),
                'TF-IDF': Number(word[3]),
              }
            ];
          }));
          let weights = this.parseWeights(term[2]);
          return [
            _.keys(words).join(', '),
            {
              terms: words,
              Weights: weights
            }];
        }));
      }
    }

    return rankingInfo;
  }

  public buildStackPanel(stackDebug: any, results?: IQueryResults): { body: HTMLElement; json: any; } {
    let body = Dom.createElement('div', { className: 'coveo-debug' });

    let keys: any[][] = _.pairs(_.keys(stackDebug));

    keys = keys.sort((a: any[], b: any[]) => {
      let indexA = _.indexOf(Debug.customOrder, a[1]);
      let indexB = _.indexOf(Debug.customOrder, b[1]);
      if (indexA != -1 && indexB != -1) {
        return indexA - indexB;
      }
      if (indexA != -1) {
        return -1;
      }
      if (indexB != -1) {
        return 1;
      }
      return a[0] - b[0];
    });

    let json = {};

    _.forEach(keys, (key: string[]) => {
      let section = this.buildSection(key[1]);
      let build = this.buildStackPanelSection(stackDebug[key[1]], results);
      section.container.appendChild(build.section);
      if (build.json != null) {
        json[key[1]] = build.json;
      }
      body.appendChild(section.dom);
    });

    return { body: body, json: json };
  }

  public debugInfo() {
    return null;
  }

  private showDebugPanel(builder: (results?: IQueryResults) => { body: HTMLElement; json: any; }) {
    let build = builder();

    let modalbox = this.modalBox.open(build.body, {
      title: '',
      className: 'coveo-debug',
      titleClose: true,
      overlayClose: true,
      validation: () => {
        this.unbindEscapeEvent();
        return true;
      }
    });
    this.bindEscapeEvent();

    let title = $$(modalbox.wrapper).find('.coveo-title');
    let search = this.buildSearchBox(build.body);
    let downloadLink = $$('a', { download: 'debug.json', 'href': this.downloadHref(build.json) }, 'Download');
    let bodyBuilder = (results?: IQueryResults) => {
      let build = builder(results);
      downloadLink.el.setAttribute('href', this.downloadHref(build.json));
      return build.body;
    };
    title.appendChild(this.buildEnabledHighlightRecommendation());
    title.appendChild(this.buildEnableDebugCheckbox(build.body, search, bodyBuilder));
    title.appendChild(search);
    title.appendChild(downloadLink.el);
  }

  private handleEscapeEvent(e: KeyboardEvent) {
    if (e.keyCode == KEYBOARD.ESCAPE) {
      if (this.modalBox) {
        this.modalBox.close();
      }
    }
  }

  private bindEscapeEvent() {
    this.boundEscapeKey = this.handleEscapeEvent.bind(this);
    $$(document.body).on('keyup', this.boundEscapeKey);
  }

  private unbindEscapeEvent() {
    if (this.boundEscapeKey) {
      $$(document.body).off('keyup', this.boundEscapeKey);
    }
    this.boundEscapeKey = null;
  }

  private handleShowDebugPanel(info: any) {
    if (this.stackDebug == null) {
      setTimeout(() => {
        let stackDebug = this.stackDebug;
        this.showDebugPanel((results?: IQueryResults) => this.buildStackPanel(stackDebug, results));
        this.stackDebug = null;
      });
      this.stackDebug = {};
    }
    _.extend(this.stackDebug, info);
  }

  private handleNewResultDisplayed(args: IDisplayedNewResultEventArgs) {
    if (args.item != null) {
      if (this.highlightRecommendation && args.result.isRecommendation) {
        $$(args.item).addClass('coveo-is-recommendation');
      }
      $$(args.item).on('dblclick', (e: MouseEvent) => {
        this.handleResultDoubleClick(e, args);
      });
    }
  }

  private handleResultDoubleClick(e: MouseEvent, args: IDisplayedNewResultEventArgs) {
    if (e.altKey) {
      let index = args.result.index;
      let findResult = (results?: IQueryResults) => results != null ? _.find(results.results, (result: IQueryResult) => result.index == index) : args.result;
      let template = args.item['template'];

      let debugPanel = {
        result: findResult,
        fields: (results?: IQueryResults) => this.buildFieldsSection(findResult(results)),
        rankingInfo: (results?: IQueryResults) => this.buildRankingInfoSection(findResult(results)),
        template: this.templateToJson(template),
      };
      this.handleShowDebugPanel(debugPanel);
    }
  }

  private downloadHref(info: any) {
    return 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(info));
  }

  private buildStackPanelSection(value: any, results: IQueryResults): { section: HTMLElement; json?: any; } {
    if (value instanceof HTMLElement) {
      return { section: value };
    } else if (_.isFunction(value)) {
      return this.buildStackPanelSection(value(results), results);
    }
    let json = this.toJson(value);
    return { section: this.buildProperty(json), json: json };
  }

  private buildSearchBox(body: HTMLElement) {
    let dom = Dom.createElement('div', { className: 'coveo-debug-search' }, '<input type=\'text\'/>');
    dom.onclick = (e) => {
      e.stopPropagation();
    };
    let lastSearch = '';
    let input = dom.querySelector('input') as HTMLInputElement;
    input.setAttribute('placeholder', 'Search in debug');
    input.onkeyup = (e) => {
      if (e == null || e.keyCode == 13) {
        let value = input.value.toLowerCase();
        if (lastSearch != value) {
          lastSearch = value;
          this.search(value, body);
        }
      }
    };
    input.onchange = () => {
      let value = input.value.toLowerCase();
      if (lastSearch != value) {
        lastSearch = value;
        this.search(value, body);
      }
    };
    return dom;
  }

  private search(value: string, body: HTMLElement) {
    if (_.isEmpty(value)) {
      $$(body).findAll('.coveo-search-match, .coveo-search-submatch').forEach((el) => {
        $$(el).removeClass('coveo-search-match, coveo-search-submatch');
      });
      $$(body).removeClass('coveo-searching');
    } else {
      $$(body).addClass('coveo-searching-loading');
      setTimeout(() => {
        let rootProperties = $$(body).findAll('.coveo-section .coveo-section-container > .coveo-property');
        _.each(rootProperties, (element: HTMLElement) => {
          this.findInProperty(element, value);
        });
        $$(body).addClass('coveo-searching');
        $$(body).removeClass('coveo-searching-loading');
      });
    }
  }

  private findInProperty(element: HTMLElement, value: string): boolean {
    let jElement = $$(element);
    let match = element['label'].indexOf(value) != -1;
    if (match) {
      this.highlightSearch(element['labelDom'], value);
    } else {
      this.removeHighlightSearch(element['labelDom']);
    }
    if (jElement.hasClass('coveo-property-object')) {
      jElement.toggleClass('coveo-search-match', match);
      let children = element['buildKeys']();
      let submatch = false;
      _.each(children, (child: HTMLElement) => {
        submatch = this.findInProperty(child, value) || submatch;
      });
      jElement.toggleClass('coveo-search-submatch', submatch);
      return match || submatch;
    } else {
      if (element['values'].indexOf(value) != -1) {
        this.highlightSearch(element['valueDom'], value);
        match = true;
      } else {
        this.removeHighlightSearch(element['valueDom']);
      }
      jElement.toggleClass('coveo-search-match', match);
    }
    return match;
  }

  private buildEnableDebugCheckbox(body: HTMLElement, search: HTMLElement, bodyBuilder: (results: IQueryResults) => HTMLElement) {
    let dom = Dom.createElement('div', { className: 'coveo-enabled-debug' }, '<label>Enable query debug <input type=\'checkbox\'/></label>');
    $$(dom).on('click', (e) => {
      e.stopPropagation();
    });
    let checkbox = $$(dom).find('input');
    if (this.debug) {
      checkbox.setAttribute('checked', 'checked');
    }
    checkbox.onchange = () => {
      this.debug = !this.debug;
      $$(this.element).one([QueryEvents.querySuccess, QueryEvents.queryError], (e: Event, args: IQuerySuccessEventArgs) => {
        $$(body).removeClass('coveo-debug-loading');
        $$(body).empty();
        $$(bodyBuilder(args.results)).children().forEach((child) => {
          body.appendChild(child);
        });
      });
      this.queryController.executeQuery({ closeModalBox: false });
      $$(body).addClass('coveo-debug-loading');
      let input = search.querySelector('input') as HTMLInputElement;
      input.value = '';
      input.onkeyup(null);
    };
    return dom;
  }

  private buildEnabledHighlightRecommendation() {
    let dom = Dom.createElement('div', { className: 'coveo-enabled-highlight-recommendation' }, '<label>Highlight recommendation <input type=\'checkbox\'/></label>');
    dom.onclick = (e) => {
      e.stopPropagation();
    };
    let checkbox = $$(dom).find('input');
    if (this.highlightRecommendation) {
      checkbox.setAttribute('checked', 'checked');
    }
    checkbox.onchange = () => {
      this.highlightRecommendation = !this.highlightRecommendation;
      this.queryController.executeQuery({ closeModalBox: false });
    };
    return dom;
  }

  private buildSection(id: string) {
    let dom = Dom.createElement('div', { className: 'coveo-section coveo-' + id + '-section' });
    let header = Dom.createElement('div', { className: 'coveo-section-header' });
    $$(header).text(id);
    dom.appendChild(header);

    let container = Dom.createElement('div', { className: 'coveo-section-container' });
    dom.appendChild(container);

    if (_.contains(this.collapsedSections, id)) {
      $$(dom).addClass('coveo-debug-collapsed');
    }

    header.onclick = () => {
      $$(dom).toggleClass('coveo-debug-collapsed');
      if (_.contains(this.collapsedSections, id)) {
        this.collapsedSections = _.without(this.collapsedSections, id);
      } else {
        this.collapsedSections.push(id);
      }
      this.localStorageDebug.save(this.collapsedSections);
    };

    return {
      dom: dom,
      header: header,
      container: container
    };
  }

  private fetchFields(): Promise<{ [field: string]: IFieldDescription }> {
    if (this.fields == null) {
      return this.queryController.getEndpoint().listFields().then((fields: IFieldDescription[]) => {
        this.fields = {};
        fields.forEach((field) => {
          this.fields[field.name] = field;
        });
        return this.fields;
      });
    } else {
      return Promise.resolve(this.fields);
    }
  }

  private buildRankingInfoSection(result: IQueryResult) {
    return result.rankingInfo && this.parseRankingInfo(result.rankingInfo);
  }

  private parseWeights(value: string) {
    let listOfWeight = value.match(/(\w+(?:\s\w+)*): ([-0-9]+)/g);
    return _.object(_.map(listOfWeight, (weight) => {
      let weightGroup = weight.match(/^(\w+(?:\s\w+)*): ([-0-9]+)$/);
      return [weightGroup[1], Number(weightGroup[2])];
    }));
  }

  private buildProperty(value: any, label?: string): HTMLElement {
    if (value instanceof Promise) {
      return this.buildPromise(value, label);
    } else if ((_.isArray(value) || (_.isObject(value))) && !_.isString(value)) {
      return this.buildObjectProperty(value, label);
    } else {
      return this.buildBasicProperty(value, label);
    }
  }

  private buildPromise(promise: Promise<any>, label?: string): HTMLElement {
    let dom: HTMLElement = document.createElement('div');
    dom.className = 'coveo-property coveo-property-promise';
    promise.then((value) => {
      let resolvedDom = this.buildProperty(value, label);
      $$(dom).replaceWith(resolvedDom);
    });
    return dom;
  }

  private buildObjectProperty(object: any, label?: string): HTMLElement {
    let dom: HTMLElement = document.createElement('div');
    dom.className = 'coveo-property coveo-property-object';

    let valueContainer: HTMLElement = document.createElement('div');
    valueContainer.className = 'coveo-property-value';

    let keys = _.keys(object);
    if (!_.isArray(object)) {
      keys.sort();
    }

    let children: HTMLElement[];
    let buildKeys = () => {
      if (children == null) {
        children = [];
        _.each(keys, (key: string) => {
          let property = this.buildProperty(object[key], key);
          if (property != null) {
            children.push(property);
            valueContainer.appendChild(property);
          }
        });
      }
      return children;
    };
    dom['buildKeys'] = buildKeys;

    if (label != null) {
      let labelDom = document.createElement('div');
      labelDom.className = 'coveo-property-label';
      labelDom.appendChild(document.createTextNode(label));
      dom['labelDom'] = labelDom;

      dom.appendChild(labelDom);
      if (keys.length != 0) {
        dom.className += ' coveo-collapsible';
        labelDom.onclick = () => {
          buildKeys();
          let className = dom.className.split(/\s+/);
          if (_.contains(className, 'coveo-expanded')) {
            className = _.without(className, 'coveo-expanded');
          } else {
            className.push('coveo-expanded');
          }
          dom.className = className.join(' ');
        };
      }
    } else {
      buildKeys();
    }
    if (keys.length == 0) {
      let className = _.without(dom.className.split(/\s+/), 'coveo-property-object');
      className.push('coveo-property-basic');
      dom.className = className.join(' ');
      if (_.isArray(object)) {
        valueContainer.innerHTML = '[]';
      } else {
        valueContainer.innerHTML = '{}';
      }
      dom['values'] = '';
    }
    dom['label'] = label != null ? label.toLowerCase() : '';
    dom.appendChild(valueContainer);
    return dom;
  }

  private buildBasicProperty(value: string, label?: string): HTMLElement {
    let dom: HTMLElement = document.createElement('div');
    dom.className = 'coveo-property coveo-property-basic';

    if (label != null) {
      let labelDom = document.createElement('div');
      labelDom.className = 'coveo-property-label';
      labelDom.appendChild(document.createTextNode(label));
      dom.appendChild(labelDom);
      dom['labelDom'] = labelDom;
    }
    let stringValue = value != null ? value.toString() : String(value);
    if (value != null && value['ref'] != null) {
      value = value['ref'];
    }
    let valueDom = document.createElement('div');
    valueDom.appendChild(document.createTextNode(stringValue));
    valueDom.ondblclick = () => {
      this.selectElementText(valueDom);
    };
    dom.appendChild(valueDom);
    dom['valueDom'] = valueDom;

    let className: string[] = ['coveo-property-value'];
    if (_.isString(value)) {
      className.push('coveo-property-value-string');
    }
    if (_.isNull(value) || _.isUndefined(value)) {
      className.push('coveo-property-value-null');
    }
    if (_.isNumber(value)) {
      className.push('coveo-property-value-number');
    }
    if (_.isBoolean(value)) {
      className.push('coveo-property-value-boolean');
    }
    if (_.isDate(value)) {
      className.push('coveo-property-value-date');
    }
    if (_.isObject(value)) {
      className.push('coveo-property-value-object');
    }
    if (_.isArray(value)) {
      className.push('coveo-property-value-array');
    }
    valueDom.className = className.join(' ');

    dom['label'] = label != null ? label.toLowerCase() : '';
    dom['values'] = stringValue.toLowerCase();
    return dom;
  }

  private toJson(value: any, depth = 0, done: any[] = []) {
    if (value instanceof BaseComponent || value instanceof SearchEndpoint) {
      return this.componentToJson(value, depth);
    }
    if (value instanceof HTMLElement) {
      return this.htmlToJson(value);
    }
    if (value instanceof Template) {
      return this.templateToJson(value);
    }
    if (value instanceof Promise) {
      return value.then((value) => {
        return this.toJson(value, depth, done);
      });
    }
    if (value == window) {
      return this.toJsonRef(value);
    }
    if (_.isArray(value) || _.isObject(value)) {
      if (_.contains(done, value)) {
        return this.toJsonRef(value, '< RECURSIVE >');
      } else if (depth >= Debug.maxDepth) {
        return this.toJsonRef(value);
      } else if (_.isArray(value)) {
        return _.map(value, (subValue, key) => this.toJson(subValue, depth + 1, done.concat([value])));
      } else if (_.isDate(value)) {
        return this.toJsonRef(value, Globalize.format(value, 'F'));
      } else {
        let result = {};
        _.each(value, (subValue, key) => {
          result[key] = this.toJson(subValue, depth + 1, done.concat([value]));
        });
        result['ref'];
        return result;
      }
    }
    return value;
  }

  private toJsonRef(value: any, stringValue?: String): String {
    stringValue = new String(stringValue || value);
    stringValue['ref'] = value;
    return stringValue;
  }

  private componentToJson(value: BaseComponent | SearchEndpoint, depth = 0): any {
    let options = _.keys(value['options']);
    if (options.length > 0) {
      return this.toJson(value['options'], depth);
    } else {
      return this.toJsonRef(value['options'], new String('No options'));
    }
  }

  private htmlToJson(value: HTMLElement): any {
    if (value == null) {
      return undefined;
    }
    return {
      tagName: value.tagName,
      id: value.id,
      classList: value.className.split(/\s+/)
    };
  }

  private templateToJson(template: Template) {
    if (template == null) {
      return null;
    }
    let element: HTMLElement = template['element'];
    let templateObject: any = {
      type: template.getType(),
    };
    if (element != null) {
      templateObject.id = element.id;
      templateObject.condition = element.attributes['data-condition'];
      templateObject.content = element.innerText;
    }
    return templateObject;
  }

  private selectElementText(el: HTMLElement) {
    if (window.getSelection && document.createRange) {
      let selection = window.getSelection();
      let range = document.createRange();
      range.selectNodeContents(el);
      selection.removeAllRanges();
      selection.addRange(range);
    } else if ('createTextRange' in document.body) {
      let textRange = document.body['createTextRange']();
      textRange.moveToElementText(el);
      textRange.select();
    }
  }

  private highlightSearch(element: HTMLElement, search: string) {
    if (element != null) {
      let match = element.innerText.split(new RegExp('(?=' + StringUtils.regexEncode(search) + ')', 'gi'));
      element.innerHTML = '';
      match.forEach((value) => {
        let regex = new RegExp('(' + StringUtils.regexEncode(search) + ')', 'i');
        let group = value.match(regex);
        let span: HTMLSpanElement;
        if (group != null) {
          span = Dom.createElement('span', { className: 'coveo-debug-highlight' });
          span.appendChild(document.createTextNode(group[1]));
          element.appendChild(span);
          span = Dom.createElement('span');
          span.appendChild(document.createTextNode(value.substr(group[1].length)));
          element.appendChild(span);
        } else {
          span = Dom.createElement('span');
          span.appendChild(document.createTextNode(value));
          element.appendChild(span);
        }
      });
    }
  }

  private removeHighlightSearch(element: HTMLElement) {
    if (element != null) {
      element.innerHTML = element.innerText;
    }
  }
}

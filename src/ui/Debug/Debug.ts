import { ComponentOptions } from '../Base/ComponentOptions';
import { LocalStorageUtils } from '../../utils/LocalStorageUtils';
import { ResultListEvents, IDisplayedNewResultEventArgs } from '../../events/ResultListEvents';
import { DebugEvents } from '../../events/DebugEvents';
import { IQueryResults } from '../../rest/QueryResults';
import { IQueryResult } from '../../rest/QueryResult';
import { $$, Dom } from '../../utils/Dom';
import { StringUtils } from '../../utils/StringUtils';
import { SearchEndpoint } from '../../rest/SearchEndpoint';
import { Template } from '../Templates/Template';
import { RootComponent } from '../Base/RootComponent';
import { BaseComponent } from '../Base/BaseComponent';
import { ModalBox as ModalBoxModule } from '../../ExternalModulesShim';
import Globalize = require('globalize');
import * as _ from 'underscore';
import 'styling/_Debug';
import { l } from '../../strings/Strings';
import { IComponentBindings } from '../Base/ComponentBindings';
import { DebugHeader } from './DebugHeader';
import { QueryEvents, IQuerySuccessEventArgs } from '../../events/QueryEvents';
import { DebugForResult } from './DebugForResult';

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
  private modalBox: Coveo.ModalBox.ModalBox;
  private opened = false;
  private stackDebug: any;
  private debugHeader: DebugHeader;

  public showDebugPanel: () => void;

  constructor(
    public element: HTMLElement,
    public bindings: IComponentBindings,
    public options?: IDebugOptions,
    public ModalBox = ModalBoxModule
  ) {
    super(element, Debug.ID);
    this.options = ComponentOptions.initComponentOptions(element, Debug, options);

    // This gets debounced so the following logic works correctly :
    // When you alt dbl click on a component, it's possible to add/merge multiple debug info source together
    // They will be merged together in this.addInfoToDebugPanel
    // Then, openModalBox, even if it's called from multiple different caller will be opened only once all the info has been merged together correctly
    this.showDebugPanel = _.debounce(() => this.openModalBox(), 100);

    $$(this.element).on(ResultListEvents.newResultDisplayed, (e, args: IDisplayedNewResultEventArgs) =>
      this.handleNewResultDisplayed(args)
    );
    $$(this.element).on(DebugEvents.showDebugPanel, (e, args) => this.handleShowDebugPanel(args));
    $$(this.element).on(QueryEvents.querySuccess, (e, args: IQuerySuccessEventArgs) => this.handleQuerySuccess(args));
    $$(this.element).on(QueryEvents.newQuery, () => this.handleNewQuery());

    this.localStorageDebug = new LocalStorageUtils<string[]>('DebugPanel');
    this.collapsedSections = this.localStorageDebug.load() || [];
  }

  public debugInfo() {
    return null;
  }

  public addInfoToDebugPanel(info: any) {
    if (this.stackDebug == null) {
      this.stackDebug = {};
    }
    this.stackDebug = _.extend({}, this.stackDebug, info);
  }

  private handleNewResultDisplayed(args: IDisplayedNewResultEventArgs) {
    $$(args.item).on('dblclick', (e: MouseEvent) => {
      this.handleResultDoubleClick(e, args);
    });
  }

  private handleResultDoubleClick(e: MouseEvent, args: IDisplayedNewResultEventArgs) {
    if (e.altKey) {
      const index = args.result.index;

      const template = args.item['template'];

      const findResult = (results?: IQueryResults) =>
        results != null ? _.find(results.results, (result: IQueryResult) => result.index == index) : args.result;

      const debugInfo = _.extend(new DebugForResult(this.bindings).generateDebugInfoForResult(args.result), {
        findResult: findResult,
        template: this.templateToJson(template)
      });

      this.addInfoToDebugPanel(debugInfo);
      this.showDebugPanel();
    }
  }

  private handleQuerySuccess(args: IQuerySuccessEventArgs) {
    if (this.opened) {
      if (this.stackDebug && this.stackDebug.findResult) {
        this.addInfoToDebugPanel(new DebugForResult(this.bindings).generateDebugInfoForResult(this.stackDebug.findResult(args.results)));
      }
      this.redrawDebugPanel();
      this.hideAnimationDuringQuery();
    }
  }

  private handleNewQuery() {
    if (this.opened) {
      this.showAnimationDuringQuery();
    }
  }

  private handleShowDebugPanel(args: any) {
    this.addInfoToDebugPanel(args);
    this.showDebugPanel();
  }

  private buildStackPanel(): { body: HTMLElement; json: any } {
    const body = $$('div', {
      className: 'coveo-debug'
    });

    const keys = _.chain(this.stackDebug)
      .omit('findResult') // findResult is a duplicate of the simpler "result" key used to retrieve the results only
      .keys()
      .value();

    // TODO Can't chain this properly due to a bug in underscore js definition file.
    // Yep, A PR is opened to DefinitelyTyped.
    let keysPaired = _.pairs(keys);

    keysPaired = keysPaired.sort((a: any[], b: any[]) => {
      const indexA = _.indexOf(Debug.customOrder, a[1]);
      const indexB = _.indexOf(Debug.customOrder, b[1]);
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

    const json = {};

    _.forEach(keysPaired, (key: string[]) => {
      const section = this.buildSection(key[1]);
      const build = this.buildStackPanelSection(this.stackDebug[key[1]], this.stackDebug['result']);
      section.container.append(build.section);
      if (build.json != null) {
        json[key[1]] = build.json;
      }
      body.append(section.dom.el);
    });

    return {
      body: body.el,
      json: json
    };
  }

  private getModalBody() {
    if (this.modalBox && this.modalBox.content) {
      return $$(this.modalBox.content).find('.coveo-modal-body');
    }
    return null;
  }

  private redrawDebugPanel() {
    const build = this.buildStackPanel();
    const body = this.getModalBody();
    if (body) {
      $$(body).empty();
      $$(body).append(build.body);
    }
    this.updateSearchFunctionnality(build);
  }

  private openModalBox() {
    const build = this.buildStackPanel();
    this.opened = true;

    this.modalBox = this.ModalBox.open(build.body, {
      title: l('Debug'),
      className: 'coveo-debug',
      titleClose: true,
      overlayClose: true,
      validation: () => {
        this.onCloseModalBox();
        return true;
      },
      sizeMod: 'big'
    });

    const title = $$(this.modalBox.wrapper).find('.coveo-modal-header');
    if (title) {
      if (!this.debugHeader) {
        this.debugHeader = new DebugHeader(
          this.element,
          title,
          this.bindings,
          (value: string) => this.search(value, build.body),
          this.stackDebug
        );
      } else {
        this.debugHeader.moveTo(title);
        this.updateSearchFunctionnality(build);
      }
    } else {
      this.logger.warn('No title found in modal box.');
    }
  }

  private updateSearchFunctionnality(build: { body: HTMLElement; json: any }) {
    if (this.debugHeader) {
      this.debugHeader.setNewInfoToDebug(this.stackDebug);
      this.debugHeader.setSearch((value: string) => this.search(value, build.body));
    }
  }

  private onCloseModalBox() {
    this.stackDebug = null;
    this.opened = false;
  }

  private buildStackPanelSection(value: any, results: IQueryResults): { section: HTMLElement; json?: any } {
    if (value instanceof HTMLElement) {
      return { section: value };
    } else if (_.isFunction(value)) {
      return this.buildStackPanelSection(value(results), results);
    }
    const json = this.toJson(value);
    return { section: this.buildProperty(json), json: json };
  }

  private findInProperty(element: HTMLElement, value: string): boolean {
    const wrappedElement = $$(element);
    let match = element['label'].indexOf(value) != -1;
    if (match) {
      this.highlightSearch(element['labelDom'], value);
    } else {
      this.removeHighlightSearch(element['labelDom']);
    }
    if (wrappedElement.hasClass('coveo-property-object')) {
      wrappedElement.toggleClass('coveo-search-match', match);
      const children = element['buildKeys']();
      let submatch = false;
      _.each(children, (child: HTMLElement) => {
        submatch = this.findInProperty(child, value) || submatch;
      });
      wrappedElement.toggleClass('coveo-search-submatch', submatch);
      return match || submatch;
    } else {
      if (element['values'].indexOf(value) != -1) {
        this.highlightSearch(element['valueDom'], value);
        match = true;
      } else {
        this.removeHighlightSearch(element['valueDom']);
      }
      wrappedElement.toggleClass('coveo-search-match', match);
    }
    return match;
  }

  private buildSection(id: string) {
    const dom = $$('div', {
      className: `coveo-section coveo-${id}-section`
    });

    const header = $$('div', {
      className: 'coveo-section-header'
    });

    $$(header).text(id);
    dom.append(header.el);

    const container = $$('div', {
      className: 'coveo-section-container'
    });

    dom.append(container.el);

    if (_.contains(this.collapsedSections, id)) {
      $$(dom).addClass('coveo-debug-collapsed');
    }

    header.on('click', () => {
      $$(dom).toggleClass('coveo-debug-collapsed');
      if (_.contains(this.collapsedSections, id)) {
        this.collapsedSections = _.without(this.collapsedSections, id);
      } else {
        this.collapsedSections.push(id);
      }
      this.localStorageDebug.save(this.collapsedSections);
    });

    return {
      dom: dom,
      header: header,
      container: container
    };
  }

  private buildProperty(value: any, label?: string): HTMLElement {
    if (value instanceof Promise) {
      return this.buildPromise(value, label);
    } else if ((_.isArray(value) || _.isObject(value)) && !_.isString(value)) {
      return this.buildObjectProperty(value, label);
    } else {
      return this.buildBasicProperty(value, label);
    }
  }

  private buildPromise(promise: Promise<any>, label?: string): HTMLElement {
    const dom = $$('div', {
      className: 'coveo-property coveo-property-promise'
    });

    promise.then(value => {
      const resolvedDom = this.buildProperty(value, label);
      dom.replaceWith(resolvedDom);
    });

    return dom.el;
  }

  private buildObjectProperty(object: any, label?: string): HTMLElement {
    const dom = $$('div', {
      className: 'coveo-property coveo-property-object'
    });

    const valueContainer = $$('div', {
      className: 'coveo-property-value'
    });

    const keys = _.keys(object);
    if (!_.isArray(object)) {
      keys.sort();
    }

    let children: HTMLElement[];
    const buildKeys = () => {
      if (children == null) {
        children = [];
        _.each(keys, (key: string) => {
          const property = this.buildProperty(object[key], key);
          if (property != null) {
            children.push(property);
            valueContainer.append(property);
          }
        });
      }
      return children;
    };
    dom.el['buildKeys'] = buildKeys;

    if (label != null) {
      const labelDom = $$('div', {
        className: 'coveo-property-label'
      });

      labelDom.text(label);
      dom.el['labelDom'] = labelDom.el;

      dom.append(labelDom.el);
      if (keys.length != 0) {
        dom.addClass('coveo-collapsible');

        labelDom.on('click', () => {
          buildKeys();
          let className = dom.el.className.split(/\s+/);
          if (_.contains(className, 'coveo-expanded')) {
            className = _.without(className, 'coveo-expanded');
          } else {
            className.push('coveo-expanded');
          }
          dom.el.className = className.join(' ');
        });
      }
    } else {
      buildKeys();
    }
    if (keys.length == 0) {
      const className = _.without(dom.el.className.split(/\s+/), 'coveo-property-object');
      className.push('coveo-property-basic');
      dom.el.className = className.join(' ');
      if (_.isArray(object)) {
        valueContainer.setHtml('[]');
      } else {
        valueContainer.setHtml('{}');
      }
      dom.el['values'] = '';
    }
    dom.el['label'] = label != null ? label.toLowerCase() : '';
    dom.append(valueContainer.el);
    return dom.el;
  }

  private buildBasicProperty(value: string, label?: string): HTMLElement {
    const dom = $$('div', {
      className: 'coveo-property coveo-property-basic'
    });

    if (label != null) {
      const labelDom = $$('div', {
        className: 'coveo-property-label'
      });
      labelDom.text(label);
      dom.append(labelDom.el);
      dom.el['labelDom'] = labelDom.el;
    }
    const stringValue = value != null ? value.toString() : String(value);
    if (value != null && value['ref'] != null) {
      value = value['ref'];
    }
    const valueDom = $$('div');
    valueDom.text(stringValue);
    valueDom.on('dblclick', () => {
      this.selectElementText(valueDom.el);
    });

    dom.append(valueDom.el);
    dom.el['valueDom'] = valueDom;

    const className: string[] = ['coveo-property-value'];
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
    valueDom.el.className = className.join(' ');

    dom.el['label'] = label != null ? label.toLowerCase() : '';
    dom.el['values'] = stringValue.toLowerCase();
    return dom.el;
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
      return value.then(value => {
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
        const result = {};
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
    const options = _.keys(value['options']);
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
    const element: HTMLElement = template['element'];
    const templateObject: any = {
      type: template.getType()
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
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(el);
      selection.removeAllRanges();
      selection.addRange(range);
    } else if ('createTextRange' in document.body) {
      const textRange = document.body['createTextRange']();
      textRange.moveToElementText(el);
      textRange.select();
    }
  }

  private search(value: string, body: HTMLElement) {
    if (_.isEmpty(value)) {
      $$(body)
        .findAll('.coveo-search-match, .coveo-search-submatch')
        .forEach(el => {
          $$(el).removeClass('coveo-search-match, coveo-search-submatch');
        });
      $$(body).removeClass('coveo-searching');
    } else {
      $$(body).addClass('coveo-searching-loading');
      setTimeout(() => {
        const rootProperties = $$(body).findAll('.coveo-section .coveo-section-container > .coveo-property');
        _.each(rootProperties, (element: HTMLElement) => {
          this.findInProperty(element, value);
        });
        $$(body).addClass('coveo-searching');
        $$(body).removeClass('coveo-searching-loading');
      });
    }
  }

  private highlightSearch(elementToSearch: HTMLElement | Dom, search: string) {
    let asHTMLElement: HTMLElement;
    if (elementToSearch instanceof HTMLElement) {
      asHTMLElement = elementToSearch;
    } else if (elementToSearch instanceof Dom) {
      asHTMLElement = elementToSearch.el;
    }
    if (asHTMLElement != null && asHTMLElement.innerText != null) {
      const match = asHTMLElement.innerText.split(new RegExp('(?=' + StringUtils.regexEncode(search) + ')', 'gi'));
      asHTMLElement.innerHTML = '';
      match.forEach(value => {
        const regex = new RegExp('(' + StringUtils.regexEncode(search) + ')', 'i');
        const group = value.match(regex);
        let span;

        if (group != null) {
          span = $$('span', {
            className: 'coveo-debug-highlight'
          });
          span.text(group[1]);
          asHTMLElement.appendChild(span.el);
          span = $$('span');
          span.text(value.substr(group[1].length));
          asHTMLElement.appendChild(span.el);
        } else {
          span = $$('span');
          span.text(value);
          asHTMLElement.appendChild(span.el);
        }
      });
    }
  }

  private removeHighlightSearch(element: HTMLElement) {
    if (element != null) {
      element.innerHTML = element.innerText;
    }
  }

  private showAnimationDuringQuery() {
    $$(this.modalBox.content).addClass('coveo-debug-loading');
  }

  private hideAnimationDuringQuery() {
    $$(this.modalBox.content).removeClass('coveo-debug-loading');
  }
}

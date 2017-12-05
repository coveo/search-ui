import { IComponentBindings } from '../Base/ComponentBindings';
import { Checkbox } from '../FormWidgets/Checkbox';
import { COMPONENT_OPTIONS_ATTRIBUTES } from '../../models/ComponentOptionsModel';
import { TextInput } from '../FormWidgets/TextInput';
import { $$, Dom } from '../../utils/Dom';
import { ResultListEvents, IDisplayedNewResultEventArgs } from '../../events/ResultListEvents';
import { QueryEvents, IDoneBuildingQueryEventArgs } from '../../events/QueryEvents';
import { stringify } from 'circular-json';
import * as _ from 'underscore';
import { Utils } from '../../utils/Utils';

export class DebugHeader {
  private debug = false;
  private enableQuerySyntax = false;
  private highlightRecommendation = false;
  private requestAllFields = false;
  private search: HTMLElement;
  private downloadLink: Dom;
  private widgets: HTMLElement[] = [];

  constructor(
    public root: HTMLElement,
    public element: HTMLElement,
    public bindings: IComponentBindings,
    public onSearch: (value: string) => void,
    public infoToDebug: any
  ) {
    this.widgets.push(this.buildEnabledHighlightRecommendation());
    this.widgets.push(this.buildEnableDebugCheckbox());
    this.widgets.push(this.buildEnableQuerySyntaxCheckbox());
    this.widgets.push(this.buildRequestAllFieldsCheckbox());
    this.widgets.push(this.buildSearch());
    this.widgets.push(this.buildDownloadLink());
    this.moveTo(element);

    $$(this.root).on(ResultListEvents.newResultDisplayed, (e, args: IDisplayedNewResultEventArgs) => this.handleNewResultDisplayed(args));
    $$(this.root).on(QueryEvents.doneBuildingQuery, (e, args: IDoneBuildingQueryEventArgs) => this.handleDoneBuildingQuery(args));
  }

  public moveTo(newElement: HTMLElement) {
    _.each(this.widgets, (widget: HTMLElement) => newElement.appendChild(widget));
    this.element = newElement;
  }

  public setSearch(onSearch: (value: string) => void) {
    this.onSearch = onSearch;
  }

  public setNewInfoToDebug(newInfoToDebug) {
    this.infoToDebug = newInfoToDebug;
    this.rebuildDownloadLink();
  }

  private rebuildDownloadLink() {
    if (this.downloadLink) {
      this.downloadLink.setAttribute('href', this.buildDownloadHref());
    }
  }

  private handleNewResultDisplayed(args: IDisplayedNewResultEventArgs) {
    if (args.item != null && args.result.isRecommendation && this.highlightRecommendation) {
      $$(args.item).addClass('coveo-is-recommendation');
    }
  }

  private handleDoneBuildingQuery(args: IDoneBuildingQueryEventArgs) {
    args.queryBuilder.enableDebug = this.debug || args.queryBuilder.enableDebug;
    if (this.requestAllFields) {
      args.queryBuilder.fieldsToInclude = undefined;
      args.queryBuilder.includeRequiredFields = false;
    }
  }

  private buildSearch() {
    const txtInput = new TextInput(txtInputInstance => {
      const value = txtInputInstance.getValue().toLowerCase();
      this.onSearch(value);
    }, 'Search in debug');
    this.search = txtInput.build();
    return this.search;
  }

  private buildDownloadLink() {
    const downloadLink = $$(
      'a',
      {
        download: 'debug.json',
        href: this.buildDownloadHref()
      },
      'Download'
    );
    this.downloadLink = downloadLink;
    return downloadLink.el;
  }

  private buildEnableDebugCheckbox() {
    const checkbox = new Checkbox(checkboxInstance => {
      this.debug = checkboxInstance.isSelected();

      this.bindings.queryController.executeQuery({
        closeModalBox: false
      });
      let input = this.search.querySelector('input') as HTMLInputElement;
      input.value = '';
    }, 'Enable query debug');
    if (this.debug) {
      checkbox.select();
    }
    return checkbox.build();
  }

  private buildEnableQuerySyntaxCheckbox() {
    const checkbox = new Checkbox(checkboxInstance => {
      this.enableQuerySyntax = checkboxInstance.isSelected();

      this.bindings.componentOptionsModel.set(COMPONENT_OPTIONS_ATTRIBUTES.SEARCH_BOX, {
        enableQuerySyntax: this.enableQuerySyntax
      });

      this.bindings.queryController.executeQuery({
        closeModalBox: false
      });
    }, 'Enable query syntax in search box');
    if (this.enableQuerySyntax) {
      checkbox.select();
    }
    return checkbox.build();
  }

  private buildRequestAllFieldsCheckbox() {
    const checkbox = new Checkbox(checkboxInstance => {
      this.requestAllFields = checkboxInstance.isSelected();
      this.bindings.queryController.executeQuery({
        closeModalBox: false
      });
    }, 'Request all fields available');
    if (this.requestAllFields) {
      checkbox.select();
    }
    return checkbox.build();
  }

  private buildEnabledHighlightRecommendation() {
    const checkbox = new Checkbox(checkboxInstance => {
      this.highlightRecommendation = checkboxInstance.isSelected();
      this.bindings.queryController.executeQuery({
        closeModalBox: false
      });
    }, 'Highlight recommendation');
    if (this.highlightRecommendation) {
      checkbox.select();
    }
    return checkbox.build();
  }

  private buildDownloadHref() {
    const toDownload = {};
    _.each(this.infoToDebug, (info, key) => {
      if (info['bindings']) {
        toDownload[key] = info['options'];
      } else {
        toDownload[key] = _.omit(info, 'state', 'searchInterface');
      }
    });
    return 'data:text/json;charset=utf-8,' + Utils.safeEncodeURIComponent(stringify(toDownload));
  }
}

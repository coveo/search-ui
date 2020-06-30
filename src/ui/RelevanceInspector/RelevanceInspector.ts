import { RankingInfoTable } from './RankingInfoTable';
import { MetaDataTable } from './MetaDataTable';
import { IComponentBindings } from '../Base/ComponentBindings';
import { IAttributeChangedEventArg } from '../../models/Model';
import { $$ } from '../../utils/Dom';
import { ModalBox } from '../../ExternalModulesShim';
import { QueryStateModel, ResultListEvents, DomUtils, Logger } from '../../Core';
import { RelevanceInspectorTabs } from './RelevanceInspectorTabs';
import 'styling/_RelevanceInspector';
import { ExecutionReport } from './ExecutionReport';
import { AvailableFieldsTable } from './AvailableFieldsTable';
import agGridModule = require('ag-grid/main');
import { debounce } from 'underscore';
import { IDisplayedNewResultEventArgs } from '../../events/ResultListEvents';
import { InlineRankingInfo } from './InlineRankingInfo';

export interface IRelevanceInspectorConstructor {
  new (element: HTMLElement, bindings: IComponentBindings): RelevanceInspector;
}

export interface IRelevanceInspectorTab {
  gridOptions: agGridModule.GridOptions;
}

export class RelevanceInspector {
  private opened = false;
  private activeTab: string;
  private tabs: Record<string, IRelevanceInspectorTab>;
  private modalBoxModule = ModalBox;

  constructor(public element: HTMLElement, public bindings: IComponentBindings) {
    $$(this.element).text('Relevance Inspector');
    $$(this.element).addClass('coveo-button coveo-relevance-inspector');
    $$(this.bindings.root).on(
      this.bindings.queryStateModel.getEventName(QueryStateModel.eventTypes.changeOne + QueryStateModel.attributesEnum.debug),
      (e, args: IAttributeChangedEventArg) => this.toggleFromState(args.value)
    );
    $$(this.element).on('click', () => this.open());
    $$(this.bindings.root).on(ResultListEvents.newResultDisplayed, (e, args: IDisplayedNewResultEventArgs) =>
      this.handleNewResultDisplayed(args)
    );
    this.bindings.queryStateModel.get(QueryStateModel.attributesEnum.debug) ? this.show() : this.hide();
  }

  public get modalBox() {
    return this.modalBoxModule;
  }

  public set modalBox(modalBoxModule) {
    this.modalBoxModule = modalBoxModule;
  }

  public hide() {
    $$(this.element).addClass('coveo-hidden');
  }

  public show() {
    $$(this.element).removeClass('coveo-hidden');
  }

  public async open() {
    if (this.opened) {
      return;
    }
    this.opened = true;

    const content = $$('div');
    const animation = DomUtils.getBasicLoadingAnimation();
    content.append(animation);
    this.modalBox.open(content.el, this.modalBoxOptions);
    const rows = await this.buildTabs();
    if (rows) {
      animation.remove();
      content.append(rows.el);
    } else {
      this.modalBox.close();
    }
  }

  private handleNewResultDisplayed(args: IDisplayedNewResultEventArgs) {
    if (this.bindings.queryStateModel.get(QueryStateModel.attributesEnum.debug)) {
      $$(args.item).addClass('coveo-with-inline-ranking-info');
      if ($$(args.item).hasClass('coveo-table-layout')) {
        $$(args.item).append(new InlineRankingInfo(args.result).build().el);
      } else {
        $$(args.item).prepend(new InlineRankingInfo(args.result).build().el);
      }
    }
  }

  private get modalBoxOptions() {
    return {
      title: 'Relevance Inspector',
      titleClose: false,
      overlayClose: true,
      sizeMod: 'big',
      className: 'relevance-inspector-modal',
      validation: () => {
        this.opened = false;
        return true;
      },
      body: document.getElementsByClassName('CoveoSearchInterface')[0] // Will return undefined if no CoveoSearchInterface is present
    };
  }

  private toggleFromState(stateValue: number) {
    stateValue != 0 ? this.show() : this.hide();
    this.modalBox.close();
  }

  private async buildTabs() {
    const lastResults = this.bindings.queryController.getLastResults().results;
    if (!lastResults || lastResults.length == 0) {
      new Logger(this).error(
        'Could not open Relevance Inspector because there is no results to display. Please execute a query beforehand',
        lastResults
      );
      return;
    }
    if (!lastResults[0].rankingInfo) {
      new Logger(this).error(
        'Could not open Relevance Inspector because there is no ranking info returned on the results. Please execute a query in debug mode beforehad',
        lastResults
      );
      return;
    }

    const container = $$('div');

    const rankingInfoTable = new RankingInfoTable(lastResults, this.bindings);
    const metadataTable = new MetaDataTable(lastResults, this.bindings);
    const executionReport = new ExecutionReport(this.bindings.queryController.getLastResults(), this.bindings);
    const availableFields = new AvailableFieldsTable(this.bindings);

    this.tabs = {
      relevanceInspectorRankingInfo: rankingInfoTable,
      relevanceInspectorMetadata: metadataTable,
      relevanceInspectorExecutionReport: executionReport,
      relevanceInspectorAvailableFields: availableFields
    };

    const inspectorTabs = new RelevanceInspectorTabs(tabChangedTo => {
      this.activeTab = tabChangedTo;
      this.resize();
    });

    const debouncedResize = debounce(() => this.resize(), 100);

    window.addEventListener('resize', debouncedResize);

    inspectorTabs.addSection('Ranking Information', await rankingInfoTable.build(), 'relevanceInspectorRankingInfo');
    inspectorTabs.addSection('Metadata', await metadataTable.build(), 'relevanceInspectorMetadata');
    inspectorTabs.addSection('Execution Report', await executionReport.build(), 'relevanceInspectorExecutionReport');
    inspectorTabs.addSection('Available Fields', await availableFields.build(), 'relevanceInspectorAvailableFields');
    inspectorTabs.select('relevanceInspectorRankingInfo');

    container.append(inspectorTabs.navigationSection.el);
    container.append(inspectorTabs.tabContentSection.el);

    return container;
  }

  private resize() {
    if (!this.activeTab) {
      return;
    }
    if (!this.tabs[this.activeTab]) {
      return;
    }
    this.tabs[this.activeTab].gridOptions.api.sizeColumnsToFit();
  }
}

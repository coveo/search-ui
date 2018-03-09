import { RankingInfoTable } from './RankingInfoTable';
import { MetaDataTable } from './MetaDataTable';
import { IComponentBindings } from '../Base/ComponentBindings';
import { IAttributeChangedEventArg } from '../../models/Model';
import { $$ } from '../../utils/Dom';
import { ModalBox } from '../../ExternalModulesShim';
import { QueryStateModel } from '../../Core';
import { RelevanceInspectorTabs } from './RelevanceInspectorTabs';

import 'styling/_RelevanceInspector';
import { ExecutionReport } from './ExecutionReport';
import { AvailableFieldsTable } from './AvailableFieldsTable';
import agGridModule = require('ag-grid/main');
import { debounce } from 'underscore';

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

  constructor(public element: HTMLElement, public bindings: IComponentBindings) {
    $$(this.element).text('Relevance Inspector');
    $$(this.element).addClass('coveo-button coveo-relevance-inspector');
    $$(this.bindings.root).on(
      this.bindings.queryStateModel.getEventName(QueryStateModel.eventTypes.changeOne + QueryStateModel.attributesEnum.debug),
      (e, args: IAttributeChangedEventArg) => this.toggleFromState(args.value)
    );
    $$(this.element).on('click', () => this.open());
    this.bindings.queryStateModel.get(QueryStateModel.attributesEnum.debug) ? this.show() : this.hide();
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
    const rows = await this.buildTabs();
    ModalBox.open(rows.el, this.modalBoxOptions);
    this.opened = true;
  }

  private get modalBoxOptions() {
    return {
      title: 'Relevance Inspector',
      titleClose: false,
      overlayClose: true,
      sizeMod: 'big',
      validation: () => {
        this.opened = false;
        return true;
      }
    };
  }

  private toggleFromState(stateValue: number) {
    stateValue != 0 ? this.show() : this.hide();
    ModalBox.close();
  }

  private async buildTabs() {
    const container = $$('div');

    const rankingInfoTable = await new RankingInfoTable(this.bindings.queryController.getLastResults().results, this.bindings);
    const metadataTable = await new MetaDataTable(this.bindings.queryController.getLastResults().results, this.bindings);
    const executionReport = await new ExecutionReport(this.bindings.queryController.getLastResults(), this.bindings);
    const availableFields = await new AvailableFieldsTable(this.bindings);

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

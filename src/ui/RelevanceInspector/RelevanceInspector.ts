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

export interface IRelevanceInspectorConstructor {
  new (element: HTMLElement, bindings: IComponentBindings): RelevanceInspector;
}

export interface IRelevanceInspectorTab {
  gridOptions: agGridModule.GridOptions;
}

export class RelevanceInspector {
  private opened = false;

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
      className: 'coveo-debug',
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

    const tabs = new RelevanceInspectorTabs(tabChangedTo => {
      const resize = (tab: IRelevanceInspectorTab) => {
        tab.gridOptions && tab.gridOptions.api ? tab.gridOptions.api.sizeColumnsToFit() : null;
      };
      switch (tabChangedTo) {
        case 'relevanceInspectorRankingInfo':
          resize(rankingInfoTable);
          break;
        case 'relevanceInspectorMetadata':
          resize(metadataTable);
          break;
        case 'relevanceInspectorExecutionReport':
          resize(executionReport);
          break;
        case 'relevanceInspectorAvailableFields':
          resize(availableFields);
          break;
      }
    });
    tabs.addSection('Ranking Information', await rankingInfoTable.build(), 'relevanceInspectorRankingInfo');
    tabs.addSection('Metadata', await metadataTable.build(), 'relevanceInspectorMetadata');
    tabs.addSection('Execution Report', await executionReport.build(), 'relevanceInspectorExecutionReport');
    tabs.addSection('Available Fields', await availableFields.build(), 'relevanceInspectorAvailableFields');
    tabs.select('relevanceInspectorRankingInfo');

    container.append(tabs.navigationSection.el);
    container.append(tabs.tabContentSection.el);

    return container;
  }
}

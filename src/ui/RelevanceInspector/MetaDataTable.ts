import { TableBuilder, ITableDataSource } from './TableBuilder';
import { map, each } from 'underscore';
import agGridModule = require('ag-grid/main');
import { IQueryResult } from '../../rest/QueryResult';
import { IComponentBindings } from '../Base/ComponentBindings';
import { $$, StringUtils } from '../../UtilsModules';
import { IResultsComponentBindings } from '../Base/ResultsComponentBindings';
import { IRelevanceInspectorTab } from './RelevanceInspector';

export class MetaDataTable implements IRelevanceInspectorTab {
  public gridOptions: agGridModule.GridOptions;

  constructor(public results: IQueryResult[], public bindings: IComponentBindings) {}

  public async build() {
    if (!this.bindings.queryController) {
      return;
    }

    const container = $$('div', {
      className: 'metadata-table'
    });

    const builders = this.results.map(async result => {
      const nestedContainer = $$('div');
      container.append(nestedContainer.el);

      const nestedAgGrid = $$('div', {
        className: 'ag-theme-fresh'
      });

      nestedContainer.append(nestedAgGrid.el);

      const thumbnail = TableBuilder.thumbnailCell(result, this.bindings as IResultsComponentBindings);
      const fields: Record<string, ITableDataSource> = {};

      fields[`Fields Values`] = {
        content: { result },
        cellRenderer: FieldValuesRenderer,
        width: 1000,
        getQuickFilterText: (params: agGridModule.GetQuickFilterTextParams) => {
          const allValues = map(params.value.result.raw, val => val.toString());
          return Object.keys(params.value.result.raw)
            .concat(allValues)
            .join(' ');
        },
        onCellDoubleClicked: (params: agGridModule.CellDoubleClickedEvent) => {
          const el = params.event ? (params.event.target as Node) : null;
          if (el && window.getSelection && document.createRange) {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(el);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }
      };

      return await new TableBuilder().build(
        [
          {
            ...thumbnail,
            ...fields
          }
        ],
        nestedAgGrid,
        {
          rowHeight: 400
        }
      );
    });

    const builtTables = await Promise.all(builders);
    const { inputGroup, inputSearch } = this.buildSearchInput();
    container.prepend(inputGroup.el);

    this.gridOptions = {
      api: {
        sizeColumnsToFit: () => {
          builtTables.forEach(built => (built.gridOptions.api ? built.gridOptions.api.sizeColumnsToFit : null));
        }
      }
    } as any;

    inputSearch.on('change', () => {
      builtTables.forEach(built => {
        const api = built.gridOptions && built.gridOptions.api;
        if (api) {
          api.setQuickFilter((inputSearch.el as HTMLInputElement).value);
          api.onRowHeightChanged();
        }
      });
    });

    return container;
  }

  private buildSearchInput() {
    const inputSearch = $$('input', {
      type: 'search',
      className: 'form-control'
    });

    const inputGroup = $$(
      'div',
      {
        className: 'input-group py-3 w-50'
      },
      $$(
        'div',
        {
          className: 'input-group-prepend'
        },
        $$('span', { className: 'input-group-text' }, 'Filter')
      )
    );

    inputGroup.append(inputSearch.el);

    return { inputGroup, inputSearch };
  }
}

export class FieldValuesRenderer implements agGridModule.ICellRendererComp {
  private element: any | undefined;
  private currentFilter: string | undefined;
  private params: any;

  public init(params: any) {
    this.element = params.value;
    this.params = params;
    params.value.el = this.listAsInput(this.element.result);
    this.currentFilter = params.api.filterManager.quickFilter;
  }

  public getGui(): HTMLElement {
    if (this.element) {
      const list = this.listAsInput(this.element.result);
      this.params.eParentOfValue.append(list.el);
      const height = Math.max(list.height() + 50, 200);
      const maxHeight = Math.min(height, 5000);
      this.params.node.setRowHeight(maxHeight);
      return $$('div', undefined, list).el;
    }
    return $$('div', undefined, 'N.A').el;
  }

  private listAsInput(result: IQueryResult) {
    const container = $$('div', {
      className: 'container'
    });

    each(result.raw, (value: string, fieldInResult: string) => {
      if (fieldInResult == 'allmetadatavalues' || fieldInResult.indexOf('sys') == 0) {
        return;
      }
      if (this.currentFilter) {
        const matchInFieldName = fieldInResult.toLowerCase().indexOf(this.currentFilter.toLowerCase()) != -1;
        const matchInFieldValue = value
          ? value
              .toString()
              .toLowerCase()
              .indexOf(this.currentFilter.toLowerCase()) != -1
          : false;

        if (!matchInFieldName && !matchInFieldValue) {
          return;
        }
      }

      const inputGroup = $$('div', {
        className: 'input-group row'
      });
      const fieldName = $$(
        'div',
        {
          readonly: 'readonly',
          type: 'text',
          className: 'form-control col-sm-3'
        },
        fieldInResult
      );

      const fieldValue = $$(
        'div',
        {
          readonly: 'readonly',
          type: 'text',
          className: 'form-control'
        },
        result.raw[fieldInResult].toString()
      );
      if (this.currentFilter) {
        this.highlightSearch(fieldName.el, this.currentFilter);
        this.highlightSearch(fieldValue.el, this.currentFilter);
      }

      inputGroup.append(fieldName.el);
      inputGroup.append(fieldValue.el);

      container.append(inputGroup.el);
    });

    return container;
  }

  private highlightSearch(elementToSearch: HTMLElement, search: string) {
    let asHTMLElement: HTMLElement = elementToSearch;

    if (asHTMLElement != null && asHTMLElement.innerText != null) {
      const match = asHTMLElement.innerText.split(new RegExp('(?=' + StringUtils.regexEncode(search) + ')', 'gi'));
      asHTMLElement.innerHTML = '';
      match.forEach(value => {
        const regex = new RegExp('(' + StringUtils.regexEncode(search) + ')', 'i');
        const group = value.match(regex);
        let span;

        if (group != null) {
          span = $$('span', {
            className: 'coveo-relevance-inspector-highlight'
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

  public refresh(params: any): boolean {
    return true;
  }
}

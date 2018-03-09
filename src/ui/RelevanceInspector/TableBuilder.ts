import { loadAgGridLibrary } from './AgGrid';
import { first, map, each, flatten, find } from 'underscore';

import agGridModule = require('ag-grid/main');
import { Dom, $$, DomUtils, StringUtils, StreamHighlightUtils } from '../../UtilsModules';
import { IQueryResult } from '../../rest/QueryResult';
import { IResultsComponentBindings } from '../Base/ResultsComponentBindings';
import ResultListModule = require('../ResultList/ResultList');
import { ResultLink } from '../ResultLink/ResultLink';
import { Logger } from '../../MiscModules';
declare const agGrid: typeof agGridModule;

export interface ITableDataSource extends agGridModule.ColDef {
  content?: any;
  width?: number;
  children?: Record<string, ITableDataSource>[];
  cellRenderer?: new () => agGridModule.ICellRendererComp;
}

export const defaultGridOptions: agGridModule.GridOptions = {
  domLayout: 'autoHeight',
  enableColResize: true,
  rowHeight: 100,
  enableRangeSelection: true,
  suppressRowClickSelection: true,
  suppressCellSelection: true,
  defaultColDef: {
    width: 100
  },
  enableSorting: true,
  autoSizePadding: 10
};

export class TableBuilder {
  private inputGroup: Dom | undefined;
  private inputSearch: Dom | undefined;
  private resizeButton: Dom | undefined;
  private gridOptions: agGridModule.GridOptions | undefined;

  public withSearch() {
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

    this.inputGroup = inputGroup;
    this.inputSearch = inputSearch;

    return this;
  }

  public async build(sources: Record<string, ITableDataSource>[], table: Dom, gridOptions = defaultGridOptions) {
    const firstData = first(sources) || {};
    const mapToAgGridFormat = (value: agGridModule.ColDef & agGridModule.ColGroupDef, key: string): any => {
      if (value.children) {
        return {
          field: key,
          headerName: key,
          marryChildren: true,
          children: flatten(
            value.children.map((child: any) => {
              return map(child, mapToAgGridFormat);
            })
          )
        };
      } else {
        return {
          field: key,
          headerName: key,
          ...value
        };
      }
    };

    const columnDefs = map(firstData as any, mapToAgGridFormat) as agGridModule.ColDef[];

    const rowData = map(sources, source => {
      const merged: any = {};

      const extractContent = (value: ITableDataSource & agGridModule.ColGroupDef, key: string) => {
        if (value.content) {
          merged[key] = value.content;
        } else if (value.children) {
          each(value.children, (child: any) => {
            each(child, extractContent);
          });
        }
      };

      each(source, extractContent as any);
      return merged;
    });

    this.gridOptions = {
      ...defaultGridOptions,
      columnDefs,
      rowData,
      ...gridOptions
    };

    if (this.resizeButton) {
      table.prepend(this.resizeButton.el);
    }

    if (this.inputSearch && this.inputGroup) {
      this.inputSearch.on('change', () => {
        this.gridOptions && this.gridOptions.api && this.inputSearch
          ? this.gridOptions.api.setQuickFilter((this.inputSearch.el as HTMLInputElement).value)
          : '';
      });
      table.prepend(this.inputGroup.el);
    }

    const loading = DomUtils.getBasicLoadingAnimation();
    table.append(loading);

    await loadAgGridLibrary();
    const grid = new agGrid.Grid(table.el, this.gridOptions);
    $$(loading).remove();

    return { grid, gridOptions: this.gridOptions };
  }

  public static thumbnailCell(result: IQueryResult, bindings: IResultsComponentBindings): Record<string, ITableDataSource> {
    return {
      Document: {
        content: { result, bindings },
        cellRenderer: ThumbnailHtmlRenderer,
        width: 300,
        getQuickFilterText: (params: agGridModule.GetQuickFilterTextParams) => {
          return '';
        }
      }
    };
  }
}

export class ThumbnailHtmlRenderer implements agGridModule.ICellRendererComp {
  private element: any | undefined;
  private currentFilter: string | undefined;

  public init(params: any) {
    this.element = params.value;
    this.currentFilter = params.api.filterManager.quickFilter;
  }

  public getGui(): HTMLElement {
    const cell = $$('div', { className: 'coveo-relevance-inspector-thumbnail-cell' });
    if (this.element) {
      const thumbnail = this.thumbnail(this.element.result, this.element.bindings);
      cell.append(thumbnail.el);
    } else {
      cell.append($$('p', undefined, 'N.A').el);
    }
    return cell.el;
  }

  private thumbnail(result: IQueryResult, bindings: IResultsComponentBindings) {
    let dom: Dom;

    if (bindings && result) {
      const resultLists = bindings.searchInterface.getComponents('ResultList') as ResultListModule.ResultList[];
      const firstActiveResultList = find(resultLists, resultList => !resultList.disabled);

      if (firstActiveResultList) {
        dom = $$('div', {
          className: 'coveo-relevance-inspector-result-thumbnail'
        });
        firstActiveResultList.buildResult(result).then(builtResult => {
          dom.append(builtResult);
        });
      } else {
        dom = $$('a', {
          className: 'CoveoResultLink'
        });
        new ResultLink(dom.el, { alwaysOpenInNewWindow: true }, bindings, result);
      }

      if (this.currentFilter) {
        this.highlightSearch(dom.el, this.currentFilter);
      }
    } else {
      new Logger(this).error('No result available to render thumbnail');
      dom = $$('div');
    }

    return dom;
  }

  public refresh(params: any): boolean {
    return true;
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
}

export class GenericHtmlRenderer implements agGridModule.ICellRendererComp {
  private element: string | undefined;
  private currentFilter: string | undefined;

  public init(params: any) {
    this.element = params.value;
    this.currentFilter = params.api.filterManager.quickFilter;
  }
  public getGui(): HTMLElement {
    if (this.element && this.currentFilter) {
      return $$('div', undefined, StreamHighlightUtils.highlightStreamHTML(this.element, { Precision: ['precision'] }, {})).el;
    } else if (this.element) {
      return $$('div', undefined, this.element).el;
    } else {
      return $$('div', undefined, 'N.A').el;
    }
  }

  public refresh(params: any): boolean {
    return true;
  }
}

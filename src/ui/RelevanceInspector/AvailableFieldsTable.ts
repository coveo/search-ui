import { TableBuilder, ITableDataSource } from './TableBuilder';
import { map, each, where, reject, filter } from 'underscore';
import agGridModule = require('ag-grid/main');
import { GenericValueOutput } from './GenericValueOutput';
import { IComponentBindings } from '../Base/ComponentBindings';
import { $$, Dom, Utils, PopupUtils } from '../../UtilsModules';
import { IFieldDescription } from '../../rest/FieldDescription';
import { QueryBuilder } from '../Base/QueryBuilder';
import { IIndexFieldValue } from '../../rest/FieldValue';
import { PopupHorizontalAlignment, PopupVerticalAlignment } from '../../utils/PopupUtils';
import { IRelevanceInspectorTab } from './RelevanceInspector';

export class AvailableFieldsTable implements IRelevanceInspectorTab {
  public gridOptions: agGridModule.GridOptions;

  public constructor(public bindings: IComponentBindings) {}

  public async build() {
    const container = $$('div');

    const agGridElement = $$('div', {
      className: 'ag-theme-fresh'
    });
    container.append(agGridElement.el);

    const allFieldsDescription = this.bindings.queryController ? await this.bindings.queryController.getEndpoint().listFields() : null;

    if (allFieldsDescription) {
      const dataSource: Record<string, ITableDataSource>[] = map(allFieldsDescription, description => {
        return {
          Name: new GenericValueOutput().output(description.name),
          Description: { ...new GenericValueOutput().output(description.description), width: 150 },
          'Default Value': new GenericValueOutput().output(description.defaultValue),
          'Field Type': new GenericValueOutput().output(description.fieldType),
          'Field Source Type': new GenericValueOutput().output(description.fieldSourceType),
          'Include In Query': new GenericValueOutput().output(description.includeInQuery),
          'Include In Results': new GenericValueOutput().output(description.includeInResults),
          'Group By Field': new GenericValueOutput().output(description.groupByField),
          'Split Group By Field': new GenericValueOutput().output(description.splitGroupByField),
          'Sort By Field': new GenericValueOutput().output(description.sortByField),
          'Sample Of Available Values': {
            content: {
              content: {
                description,
                bindings: this.bindings,
                container
              }
            },
            width: 200,
            suppressSorting: true,
            suppressFilter: true,
            cellRenderer: AvailableFieldsSampleValue
          }
        };
      });

      const { gridOptions } = await new TableBuilder().build(dataSource, agGridElement, {
        enableFilter: true,
        rowModelType: 'infinite',
        pagination: true,
        paginationPageSize: 25,
        rowHeight: 100,
        enableServerSideFilter: true,
        enableServerSideSorting: true,
        datasource: new AvailableFieldsDatasource(dataSource)
      });

      this.gridOptions = gridOptions;
    }

    return container;
  }
}

export class AvailableFieldsSampleValue implements agGridModule.ICellRendererComp {
  private description: IFieldDescription | undefined;
  private bindings: IComponentBindings | undefined;
  private container: Dom | undefined;

  public init(params: any) {
    if (params.value && params.value.content) {
      this.description = params.value.content.description;
      this.bindings = params.value.content.bindings;
      this.container = params.value.content.container;
    }
  }

  public getGui() {
    const btn = $$(
      'button',
      {
        className: 'coveo-button coveo-available-fields-table-button',
        type: 'button'
      },
      'Hover For Sample Values'
    );

    let popperElement: Dom | undefined;
    let userHoveringButtonWithHisMouse = false;

    btn.on('mouseover', async () => {
      userHoveringButtonWithHisMouse = true;
      if (this.description && this.container && userHoveringButtonWithHisMouse) {
        const values = await this.getFieldsValues(this.description);
        if (userHoveringButtonWithHisMouse) {
          popperElement = this.renderFieldValues(values);
          this.container.append(popperElement.el);
          PopupUtils.positionPopup(popperElement.el, btn.el, document.body, {
            horizontal: PopupHorizontalAlignment.LEFT,
            vertical: PopupVerticalAlignment.MIDDLE
          });
        }
        userHoveringButtonWithHisMouse = false;
      }
    });

    btn.on('mouseout', () => {
      if (popperElement) {
        popperElement.remove();
      }
      userHoveringButtonWithHisMouse = false;
    });

    return btn.el;
  }

  private async getFieldsValues(fieldDesciption: IFieldDescription) {
    if (!this.bindings || !this.description || !this.bindings.queryController || !this.container) {
      return [];
    }

    if (fieldDesciption.groupByField) {
      return await this.bindings.queryController.getEndpoint().listFieldValues({
        field: this.description.name
      });
    } else {
      const queryBuilder = new QueryBuilder();
      queryBuilder.advancedExpression.add(fieldDesciption.name);
      const queryResults = this.bindings ? await this.bindings.queryController.getEndpoint().search(queryBuilder.build()) : null;
      if (queryResults) {
        return map(queryResults.results, result => {
          return { value: Utils.getFieldValue(result, fieldDesciption.name) } as IIndexFieldValue;
        });
      } else {
        return [];
      }
    }
  }

  private renderFieldValues(fieldValues: IIndexFieldValue[]) {
    const list = $$('ul', { className: 'coveo-relevance-inspector-available-fields-popup' });
    list.el.style.background = 'white';
    if (fieldValues.length == 0) {
      list.append($$('li', undefined, 'No Values Available ...').el);
    } else {
      fieldValues.forEach(fieldValue => {
        const listItem = $$(
          'li',
          {
            className: 'coveo-relevance-inspector-available-fields-popup-value'
          },
          new GenericValueOutput().output(fieldValue.value).content
        );

        list.append(listItem.el);
      });
    }

    return list;
  }

  public refresh() {
    return true;
  }
}

interface IFilterModel {
  type: 'equals' | 'notEqual' | 'startsWith' | 'endsWith' | 'contains' | 'notContains';
  filter: string;
}

interface ISortModel {
  colId: string;
  sort: 'asc' | 'desc';
}

export class AvailableFieldsDatasource implements agGridModule.IDatasource {
  private rowsData: any[] = [];
  constructor(public dataSource: Record<string, ITableDataSource>[]) {
    this.rowsData = map(this.dataSource, source => {
      const merged: any = {};

      const extractContent = (value: ITableDataSource & agGridModule.ColGroupDef, key: string) => {
        if (value.content != null) {
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
  }

  public getRows(params: agGridModule.IGetRowsParams) {
    const filtered = this.filter(this.rowsData, params.filterModel);
    const filteredAndSorted = this.sort(filtered, params.sortModel);

    params.successCallback(filteredAndSorted.slice(params.startRow, params.endRow), filteredAndSorted.length);
  }

  private filter(rows: any[], filterModel: Record<string, IFilterModel>) {
    each(filterModel, (value, key) => {
      switch (value.type) {
        case 'equals':
          rows = where(rows, { [key]: value.filter });
          break;

        case 'notEqual':
          rows = reject(rows, possibleReturn => {
            return possibleReturn[key] == value.filter;
          });
          break;

        case 'startsWith':
          rows = filter(rows, possibleReturn => {
            return possibleReturn[key].toLowerCase().indexOf(value.filter) == 0;
          });
          break;

        case 'endsWith':
          rows = filter(rows, possibleReturn => {
            return possibleReturn[key].toLowerCase().indexOf(value.filter) == possibleReturn[key].length - value.filter.length;
          });
          break;

        case 'contains':
          rows = filter(rows, possibleReturn => {
            return possibleReturn[key].toLowerCase().indexOf(value.filter) != -1;
          });
          break;

        case 'notContains':
          rows = filter(rows, possibleReturn => {
            return possibleReturn[key].toLowerCase().indexOf(value.filter) == -1;
          });
          break;
      }
    });

    return rows;
  }

  private sort(rows: any[], sortModels: ISortModel[]) {
    if (sortModels && sortModels[0]) {
      const sortModel = sortModels[0];
      return rows.sort((first, second) => {
        const firstValue = first[sortModel.colId];
        const secondValue = second[sortModel.colId];

        const ascendingOrDescendingMultiplier = sortModel.sort == 'asc' ? 1 : -1;

        if (Utils.isNullOrEmptyString(firstValue) && Utils.isNullOrEmptyString(secondValue)) {
          return 0;
        }

        if (Utils.isNullOrEmptyString(firstValue)) {
          return -1 * ascendingOrDescendingMultiplier;
        }

        if (Utils.isNullOrEmptyString(secondValue)) {
          return 1 * ascendingOrDescendingMultiplier;
        }

        if (isNaN(firstValue) || isNaN(secondValue)) {
          return firstValue.localeCompare(secondValue) * ascendingOrDescendingMultiplier;
        } else {
          return (Number(firstValue) - Number(secondValue)) * ascendingOrDescendingMultiplier;
        }
      });
    }
    return rows;
  }
}

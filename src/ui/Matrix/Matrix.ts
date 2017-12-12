import { Template } from '../Templates/Template';
import { Component } from '../Base/Component';
import { ComponentOptions, IFieldOption } from '../Base/ComponentOptions';
import { Cell } from './Cell';
import { IComponentBindings } from '../Base/ComponentBindings';
import { DefaultMatrixResultPreviewTemplate } from './DefaultMatrixResultPreviewTemplate';
import { $$ } from '../../utils/Dom';
import { QueryEvents, IBuildingQueryEventArgs, IDoneBuildingQueryEventArgs, IQuerySuccessEventArgs } from '../../events/QueryEvents';
import { QueryStateModel } from '../../models/QueryStateModel';
import { QueryBuilder } from '../Base/QueryBuilder';
import { Utils } from '../../utils/Utils';
import { IGroupByRequest } from '../../rest/GroupByRequest';
import { IQueryResults } from '../../rest/QueryResults';
import { IQueryResult } from '../../rest/QueryResult';
import { Initialization, IInitializationParameters } from '../Base/Initialization';
import { QueryUtils } from '../../utils/QueryUtils';
import { IQuery } from '../../rest/Query';
import * as Globalize from 'globalize';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';
import 'styling/_Matrix';

export interface IMatrixOptions {
  title?: string;

  rowField: IFieldOption;
  sortCriteria?: string;
  maximumNumberOfRows?: number;
  enableRowTotals?: boolean;

  columnField: IFieldOption;
  columnFieldValues?: string[];
  columnLabels?: string[];
  columnHeader?: string;
  maximumNumberOfValuesInGroupBy?: number;
  enableColumnTotals?: boolean;

  computedField: IFieldOption;
  computedFieldOperation?: string;
  computedFieldFormat?: string;
  cellFontSize?: string;

  enableHoverPreview?: boolean;
  previewSortCriteria?: string;
  previewSortField?: IFieldOption;
  previewMaxWidth?: string;
  previewMinWidth?: string;
  previewDelay?: number;
  previewTemplate?: Template;
}

/**
 * The Matrix component uses the values of two fields (row and column) to display the results of the specified computed
 * field in a table.
 *
 * The user specifies the values to use for the columns. An {@link IGroupByRequest} operation performed at the same time
 * as the main query retrieves the values to use for the rows.
 *
 * In a way that is similar to the {@link Facet} component, selecting a Matrix cell allows the end user to drill down
 * inside the results by restricting the row field and the column field to match the values of the selected cell.
 *
 * @notSupportedIn salesforcefree
 */
export class Matrix extends Component {
  static ID = 'Matrix';

  static doExport = () => {
    exportGlobally({
      Matrix: Matrix
    });
  };

  /**
   * The possible options for the component
   * @componentOptions
   */
  static options: IMatrixOptions = {
    /**
     * Specifies the text to display at the top of the Matrix.
     */
    title: ComponentOptions.buildStringOption(),

    /**
     * Specifies the field to use for the rows.
     *
     * Specifying a value for this options is required for this component to work.
     */
    rowField: ComponentOptions.buildFieldOption({ required: true }),

    /**
     * Specifies the field to use for the columns.
     *
     * Specifying a value for this options is required for this component to work.
     */
    columnField: ComponentOptions.buildFieldOption({ required: true }),

    /**
     * Specifies the criteria to use for sorting the rows.
     *
     * See {@link IGroupByRequest.sortCriteria} for the list of possible values.
     *
     * Default value is `ComputedFieldDescending`.
     */
    sortCriteria: ComponentOptions.buildStringOption({ defaultValue: 'ComputedFieldDescending' }),

    /**
     * Specifies the maximum number of rows to display in the Matrix.
     *
     * Default value is `10`. Minimum value is `0`.
     */
    maximumNumberOfRows: ComponentOptions.buildNumberOption({ defaultValue: 10, min: 0 }),

    /**
     * Specifies whether to display a **Total** column containing the sum of each row.
     *
     * Default value is `true`.
     */
    enableRowTotals: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * Specifies the field values to use for each column.
     *
     * See also {@link Matrix.options.columnLabels}.
     *
     * Default value is `[]`, which means that the Matrix will not generate any column (except the **Total** column, if
     * {@link Matrix.options.enableRowTotals} is `true`).
     */
    columnFieldValues: ComponentOptions.buildListOption<string>({ defaultValue: [] }),

    /**
     * Specifies the label values to use for each column.
     *
     * Default value is `[]`. The array set for this options should match the {@link Matrix.options.columnFieldValues}.
     */
    columnLabels: ComponentOptions.buildListOption<string>({ defaultValue: [] }),

    /**
     * Specifies the label for the first column on the left as a description of the {@link Matrix.options.columnField}.
     *
     * Default value is `undefined`.
     */
    columnHeader: ComponentOptions.buildStringOption(),

    /**
     * Specifies the maximum number of results to include in the {@link IGroupByRequest} for the columns.
     *
     * This value should always be greater than the {@link Matrix.options.maximumNumberOfRows}. If it is too small, some
     * of the results will not be displayed in the Matrix.
     *
     * Default value is `100`. Minimum value is `0`.
     */
    maximumNumberOfValuesInGroupBy: ComponentOptions.buildNumberOption({ defaultValue: 100, min: 0 }),

    /**
     * Specifies whether to add a **Total** row containing the total of each column.
     *
     * Default value is `true`
     */
    enableColumnTotals: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * Specifies the field whose computed values you want to display in the cells.
     *
     * Specifying a value for this options is required for this component to work.
     */
    computedField: ComponentOptions.buildFieldOption({ required: true }),

    /**
     * Specifies the type of aggregate operation to perform on the {@link Matrix.options.computedField}.
     *
     * The possible values are:
     * - `sum` - Computes the sum of the computed field values.
     * - `average` - Computes the average of the computed field values.
     * - `minimum` - Finds the minimum value of the computed field values.
     * - `maximum` - Finds the maximum value of the computed field values.
     *
     * Default value is `sum`.
     */
    computedFieldOperation: ComponentOptions.buildStringOption({ defaultValue: 'sum' }),

    /**
     * Specifies how to format the values resulting from a {@link Matrix.options.computedFieldOperation}.
     *
     * The Globalize library defines all available formats (see
     * [Globalize](https://github.com/klaaspieter/jquery-global#globalizeformat-value-format-culture-)).
     *
     * The most commonly used formats are:
     * - `c0` - Formats the value as a currency.
     * - `n0` - Formats the value as an integer.
     * - `n2` - Formats the value as a floating point with 2 decimal digits.
     *
     * Default value is `c0`.
     */
    computedFieldFormat: ComponentOptions.buildStringOption({ defaultValue: 'c0' }),

    /**
     * Specifies the font-size to use for displaying text inside the cells.
     *
     * This option is mainly useful to prevent a Matrix containing many columns from cropping some of its values.
     *
     * However, instead of using this option to solve this kind of issue, you could also remove some of the less
     * important columns from your Matrix or modify the CSS of your page to allow the Matrix to occupy a larger space.
     *
     * Default value is `''`.
     */
    cellFontSize: ComponentOptions.buildStringOption({ defaultValue: '' }),

    /**
     * Specifies whether to show a preview popup of cell results when hovering over a cell.
     *
     * See also {@link Matrix.options.previewSortCriteria}, {@link Matrix.options.previewMaxWidth},
     * {@link Matrix.options.previewMinWidth}, {@link Matrix.options.previewDelay} and
     * {@link Matrix.options.previewTemplate}.
     *
     * Default value is `true`.
     */
    enableHoverPreview: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * If {@link Matrix.options.enableHoverPreview} is `true`, specifies the criteria to use for sorting the results of
     * the hover preview.
     *
     * The available sort criteria values are the same as those of the {@link IQuery}.
     *
     * The possible values are:
     * - `relevancy`: Uses all configured ranking weights and any specified ranking expressions to sort the results.
     * - `dateascending` / `datedescending`: Sorts the results using the `@date` field value, which is typically the
     * last modification date of an item in the index.
     * - `qre`: Sorts the results using only the weights applied by ranking expressions. Using `qre` is much like using
     * `relevancy`, except that `qre` does not compute automatic weights, such as weights based on keyword proximity.
     * - `nosort`: Does not sort the results. Using `nosort` returns the items in an essentially random order.
     * - `fieldascending` / `fielddescending`: Sorts the results using the value of a custom field.
     * - `fieldascending` / `fielddescending`: Sorts the results using the value of a custom field.
     *
     * See also {@link Matrix.options.previewSortField}.
     *
     * Default value is `FieldDescending`.
     */
    previewSortCriteria: ComponentOptions.buildStringOption({ defaultValue: 'FieldDescending' }),

    /**
     * If {@link Matrix.options.previewSortCriteria} is `fieldascending` or `fielddescending`, specifies the field to
     * use for sorting the results of the hover preview.
     *
     * Default value is the value of {@link Matrix.options.computedField}.
     */
    previewSortField: ComponentOptions.buildFieldOption(),

    /**
     * If {@link Matrix.options.enableHoverPreview} is `true`, specifies the maximum width (in pixels) of the preview
     * popup.
     *
     * Default value is `500px`.
     */
    previewMaxWidth: ComponentOptions.buildStringOption({ defaultValue: '500px' }),

    /**
     * If {@link Matrix.options.enableHoverPreview} is `true`, specifies the minimum width (in pixels) of the preview
     * popup.
     *
     * Default value is `0`.
     */
    previewMinWidth: ComponentOptions.buildStringOption({ defaultValue: '0' }),

    /**
     * If {@link Matrix.options.enableHoverPreview} is `true`, specifies the delay (in milliseconds) before sending the
     * query to get the preview results.
     *
     * Default value is `500`.
     */
    previewDelay: ComponentOptions.buildNumberOption({ defaultValue: 500 }),

    /**
     * If {@link Matrix.options.enableHoverPreview} is `true`, specifies the template ID or CSS selector of the template
     * to use to render the results of the hover preview.
     *
     * You must use either `data-template-id` or `data-template-selector` in the markup to specify a value for this
     * option.
     *
     * **Examples:**
     *
     * Specifying what template to use by referring to its template ID:
     * ```html
     * <div class='CoveoMatrix' data-template-id='TemplateId'></div>
     * ```
     *
     * Specifying what template to use by referring to its CSS selector:
     * ```html
     * <div class='CoveoMatrix' data-template-selector='.templateSelector'></div>
     * ```
     */
    previewTemplate: ComponentOptions.buildTemplateOption()
  };

  /**
   * Holds the data for the Matrix.
   */
  public data: Cell[][];
  public groupByIndex = [];
  public rowId = '';
  public columnId = '';

  /**
   * The currently selected row value, or `undefined` if nothing is selected.
   */
  public selectedRowValue: string = undefined;

  /**
   * The currently selected column value, or `undefined` if nothing is selected.
   */
  public selectedColumnValue = undefined;

  private numberOfRows = 0;
  private numberOfColumns = 0;
  private previewTimeout: number;

  /**
   * Creates a new Matrix. Also verifies whether options are valid and coherent. Binds query events.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the Matrix component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options?: IMatrixOptions, bindings?: IComponentBindings) {
    super(element, Matrix.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, Matrix, options);

    if (!this.options.previewTemplate) {
      this.options.previewTemplate = new DefaultMatrixResultPreviewTemplate(
        <string>this.options.computedField,
        this.options.computedFieldFormat
      );
    }

    if (!this.options.previewSortField) {
      this.options.previewSortField = <string>this.options.computedField;
    }

    if (this.options.columnFieldValues.length != this.options.columnLabels.length) {
      this.options.columnLabels = this.options.columnFieldValues;
    }

    this.buildMatrix();
    if (this.options.rowField == null) {
      this.logger.error("'rowField' option is required in the Matrix component");
    } else if (this.options.columnField == null) {
      this.logger.error("'columnField' option is required in the Matrix component");
    } else if (this.options.computedField == null) {
      this.logger.error("'computedField' option is required in the Matrix component");
    } else {
      this.bindEvents();
      this.initQueryState();
    }
  }

  /**
   * Selects a cell by its row and column number. Does not execute a query.
   * @param rowNumber The row number of the cell to select.
   * @param columnNumber The column number of the cell to select.
   */
  public selectCell(rowNumber: number, columnNumber: number): void {
    let rowValue, columnValue;
    if (rowNumber !== 0 && rowNumber !== this.numberOfRows - 1) {
      rowValue = this.getRowValue(rowNumber);
    }

    if (columnNumber !== 0 && columnNumber !== this.numberOfColumns - 1) {
      columnValue = this.getColumnValue(columnNumber);
    }

    if (rowValue && this.isRowFacetPresent()) {
      this.queryStateModel.set(this.rowId, [rowValue]);
    } else {
      this.selectedRowValue = rowValue;
      this.queryStateModel.set(this.rowId, []);
    }

    if (columnValue && this.isColumnFacetPresent()) {
      this.queryStateModel.set(this.columnId, [columnValue]);
    } else {
      this.selectedColumnValue = columnValue;
      this.queryStateModel.set(this.columnId, []);
    }
  }

  /**
   * Returns the currently selected column value.
   */
  public getSelectedColumnValue(): string {
    return this.selectedColumnValue;
  }

  /**
   * Returns the currently selected row value.
   */
  public getSelectedRowValue(): string {
    return this.selectedRowValue;
  }

  /**
   * Gets the HTMLElement associated to a cell.
   * @param rowNumber The row number of the cell.
   * @param columnNumber The column number of the cell.
   * @returns {HTMLElement} The associated HTMLElement.
   */
  public getCellElement(rowNumber: number, columnNumber: number): HTMLElement {
    return this.data[rowNumber][columnNumber].getHTML();
  }

  /**
   * Gets the string associated to a cell.
   * @param rowNumber The row number of the cell.
   * @param columnNumber The column number of the cell.
   * @returns {string} The associated string.
   */
  public getCellValue(rowNumber: number, columnNumber: number): string {
    let cell = this.getCellElement(rowNumber, columnNumber);
    return $$(cell).text();
  }

  public drawMatrix() {
    let headerRow = $$('div', {
      className: 'coveo-matrix-row matrix-header-row'
    });
    this.drawRow(headerRow.el, 0);
    let numberOfRowsToDraw = this.options.enableColumnTotals ? this.numberOfRows - 1 : this.numberOfRows;
    for (let i = 1; i < numberOfRowsToDraw; i++) {
      let row = $$('div', {
        className: 'coveo-matrix-row'
      }).el;
      this.drawRow(row, i);
    }

    if (this.options.enableColumnTotals) {
      let totalRow = $$('div', {
        className: 'coveo-matrix-row matrix-total-row'
      }).el;

      this.drawRow(totalRow, this.numberOfRows - 1);
    }

    if (this.options.cellFontSize !== '') {
      let cells = $$(this.element).findAll('.coveo-matrix-cell');
      _.each(cells, (c: HTMLElement) => {
        c.style.fontSize = this.options.cellFontSize;
      });
    }
  }

  private bindEvents() {
    this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => this.handleBuildingQuery(args));
    this.bind.onRootElement(QueryEvents.doneBuildingQuery, (args: IDoneBuildingQueryEventArgs) => this.handleDoneBuildingQuery(args));
    this.bind.onRootElement(QueryEvents.deferredQuerySuccess, (args: IQuerySuccessEventArgs) => this.handleDeferredQuerySuccess(args));
  }

  private initQueryState() {
    this.rowId = QueryStateModel.getFacetId(<string>this.options.rowField);
    this.columnId = QueryStateModel.getFacetId(<string>this.options.columnField);

    this.queryStateModel.registerNewAttribute(this.rowId, []);
    this.queryStateModel.registerNewAttribute(this.columnId, []);
  }

  private buildMatrix() {
    this.buildTitle();
    this.buildBody();
    this.data = new Array<Array<Cell>>();
    this.addHeaderRow();
  }

  private buildTitle() {
    let title = this.options.title ? this.options.title : '';
    let titleHtml = $$(
      'div',
      {
        className: 'coveo-matrix-title'
      },
      title
    ).el;
    this.element.appendChild(titleHtml);
  }

  private buildBody() {
    let body = $$('div', {
      className: 'coveo-matrix'
    }).el;
    this.element.appendChild(body);
  }

  private handleBuildingQuery(args: IBuildingQueryEventArgs) {
    if (!this.areFacetsPresent()) {
      if (this.selectedRowValue && !this.isRowFacetPresent()) {
        args.queryBuilder.advancedExpression.addFieldExpression(<string>this.options.rowField, '=', [this.selectedRowValue]);
      }
      if (this.selectedColumnValue && !this.isColumnFacetPresent()) {
        args.queryBuilder.advancedExpression.addFieldExpression(<string>this.options.columnField, '=', [this.selectedColumnValue]);
      }
    }
  }

  private handleDoneBuildingQuery(args: IDoneBuildingQueryEventArgs) {
    this.groupByIndex = [];
    this.addMainGroubByRequest(args.queryBuilder);
    this.addColumnsGroupByRequests(args.queryBuilder);
  }

  private handleDeferredQuerySuccess(args: IQuerySuccessEventArgs) {
    this.reset();
    this.parseResults(args.results);
    this.addTotals();
    this.drawMatrix();
    this.formatCells();
    this.selectedRowValue = undefined;
    this.selectedColumnValue = undefined;
  }

  private addMainGroubByRequest(queryBuilder: QueryBuilder) {
    let groupBy: IGroupByRequest = {
      field: <string>this.options.rowField,
      sortCriteria: this.options.sortCriteria,
      computedFields: this.getComputedFields(),
      maximumNumberOfValues: this.options.maximumNumberOfRows
    };

    this.groupByIndex.push(queryBuilder.groupByRequests.length);
    queryBuilder.groupByRequests.push(groupBy);
  }

  private addColumnsGroupByRequests(queryBuilder: QueryBuilder) {
    for (let i = 0; i < this.options.columnFieldValues.length; i++) {
      let groupBy = {
        field: <string>this.options.rowField,
        sortCriteria: this.options.sortCriteria,
        computedFields: this.getComputedFields(),
        queryOverride:
          '(' + this.buildExpression(queryBuilder) + ')' + '(' + this.options.columnField + "='" + this.options.columnFieldValues[i] + "')",
        maximumNumberOfValues: this.options.maximumNumberOfValuesInGroupBy
      };

      this.groupByIndex.push(queryBuilder.groupByRequests.length);
      queryBuilder.groupByRequests.push(groupBy);
    }
  }

  private buildExpression(queryBuilder: QueryBuilder) {
    let expression = queryBuilder.expression.build();
    let advancedExpression = queryBuilder.advancedExpression.build();
    let constantExpression = queryBuilder.constantExpression.build();
    let totalQuery = '';
    if (expression) {
      totalQuery += ' ' + expression;
    }
    if (advancedExpression) {
      totalQuery += ' ' + advancedExpression;
    }
    if (constantExpression) {
      totalQuery += ' ' + constantExpression;
    }
    return totalQuery;
  }

  private getComputedFields() {
    let computedFields = [
      {
        field: <string>this.options.computedField,
        operation: this.options.computedFieldOperation
      }
    ];
    return computedFields;
  }

  private getCellResult(results, rowNumber: number, columnNumber: number) {
    let rowValue = this.getRowValue(rowNumber);
    let columnValue = this.getColumnValue(columnNumber);
    let cellResult = 0;

    for (let i = 0; i < results.values.length; i++) {
      if (results.values[i].value === rowValue) {
        cellResult = results.values[i].computedFieldResults[0];
        break;
      }
    }

    if (this.isAColumnSelected() && !this.isColumnSelected(columnValue)) {
      cellResult = 0;
    }

    return cellResult;
  }

  private addTotals() {
    if (this.options.enableRowTotals) {
      this.addRowTotals();
    }
    if (this.options.enableColumnTotals) {
      this.addColumnTotals();
    }
  }

  private addRowTotals() {
    this.addColumn();
    this.setValue('Total', 0, this.numberOfColumns - 1);
    for (let i = 1; i < this.numberOfRows; i++) {
      let rowTotal = this.computeRowTotal(i);
      this.setValue(rowTotal, i, this.numberOfColumns - 1);
    }

    // Fix sort ordering when not all columns field values are present.
    if (this.options.sortCriteria.toLowerCase() == 'computedfielddescending') {
      this.data.sort((a: Cell[], b: Cell[]): number => {
        return b[this.numberOfColumns - 1].getValue() - a[this.numberOfColumns - 1].getValue();
      });
    }

    if (this.options.sortCriteria.toLowerCase() == 'computedfieldascending') {
      this.data.sort((a: Cell[], b: Cell[]): number => {
        return a[this.numberOfColumns - 1].getValue() - b[this.numberOfColumns - 1].getValue();
      });
    }
  }

  private addColumnTotals() {
    this.addRow();
    this.setValue('Total', this.numberOfRows - 1, 0);
    for (let i = 1; i < this.numberOfColumns; i++) {
      let columnTotal = this.computeColumnTotal(i);
      this.setValue(columnTotal, this.numberOfRows - 1, i);
    }
  }

  private computeRowTotal(rowNumber: number): number {
    let total = 0;
    for (let columnNumber = 1; columnNumber < this.numberOfColumns - 1; columnNumber++) {
      total += parseInt(this.getCellValue(rowNumber, columnNumber));
    }
    return total;
  }

  private computeColumnTotal(columnNumber: number): number {
    let total = 0;
    for (let rowNumber = 1; rowNumber < this.numberOfRows - 1; rowNumber++) {
      total += parseInt(this.getCellValue(rowNumber, columnNumber));
    }
    return total;
  }

  private formatCells() {
    for (let i = 1; i < this.numberOfRows; i++) {
      for (let j = 1; j < this.numberOfColumns; j++) {
        let cellValue = this.getCellValue(i, j);
        cellValue = Globalize.format(parseInt(cellValue), this.options.computedFieldFormat);
        this.setValue(cellValue, i, j);
      }
    }
  }

  private addHeaderRow() {
    this.addRow();
    this.addColumn();
    this.setValue(this.options.columnHeader, 0, 0);
    for (let i = 0; i < this.options.columnLabels.length; i++) {
      this.addColumn();
      this.setValue(this.options.columnLabels[i], 0, i + 1);
    }
  }

  private addRow() {
    this.data.push(new Array<Cell>());

    for (let i = 0; i < this.numberOfColumns; i++) {
      this.addCellToRow(this.numberOfRows, i);
    }
    this.numberOfRows++;
  }

  private addColumn() {
    for (let i = 0; i < this.numberOfRows; i++) {
      this.addCellToRow(i, this.numberOfColumns);
    }

    this.numberOfColumns++;
  }

  private addCellToRow(rowNumber: number, columnNumber: number) {
    let column = $$('div', {
      className: 'coveo-matrix-cell'
    });

    if (columnNumber == 0) {
      column.addClass('matrix-first-column');
    }
    this.data[rowNumber].push(new Cell(0, column.el));
  }

  private setValue(value: any, rowNumber: number, columnNumber: number) {
    let cell = this.getCellElement(rowNumber, columnNumber);
    if (!Utils.isNullOrUndefined(value)) {
      $$(cell).text(value.toString());
    }

    if (this.isCellSelected(this.getRowValue(rowNumber), this.getColumnValue(columnNumber))) {
      $$(cell).addClass('coveo-matrix-selected');
    }

    if (this.isAColumnSelected() && !this.isColumnSelected(this.getColumnValue(columnNumber))) {
      if (columnNumber != 0 && rowNumber != 0) {
        $$(cell).addClass('coveo-matrix-unimportant');
      }
    }

    this.data[rowNumber][columnNumber].setValue(value);
  }

  private handleClick(rowNumber: number, columnNumber: number) {
    this.selectCell(rowNumber, columnNumber);
    this.queryController.executeQuery();
  }

  private getRowValue(rowNumber: number): string {
    return this.data[rowNumber][0].getValue();
  }

  private getColumnValue(columnNumber: number): string {
    return this.options.columnFieldValues[columnNumber - 1];
  }

  private isAColumnSelected(): boolean {
    let selectedColumnValues = this.queryStateModel.get(this.columnId) || [];
    return selectedColumnValues.length !== 0 || this.selectedColumnValue != undefined;
  }

  private isColumnSelected(columnValue: string): boolean {
    if (this.isAColumnSelected() && columnValue) {
      let selectedColumnValues = this.queryStateModel.attributes[this.columnId] || [];
      for (let i = 0; i < selectedColumnValues.length; i++) {
        if (selectedColumnValues[i].toLowerCase() === columnValue.toLowerCase()) {
          return true;
        }
      }
    }
    return this.selectedColumnValue == columnValue;
  }

  private isARowSelected(): boolean {
    let selectedRowValues = this.queryStateModel.get(this.rowId) || [];
    return selectedRowValues.length !== 0 || this.selectedRowValue !== undefined;
  }

  private isRowSelected(rowValue: string): boolean {
    if (this.isARowSelected() && rowValue) {
      let selectedRowValues = this.queryStateModel.get(this.rowId) || [];
      for (let i = 0; i < selectedRowValues.length; i++) {
        if (selectedRowValues[i].toLowerCase() === rowValue.toLowerCase()) {
          return true;
        }
      }
    }
    return this.selectedRowValue == rowValue;
  }

  private isCellSelected(rowValue: string, columnValue: string): boolean {
    if (this.isAColumnSelected() && this.isARowSelected()) {
      return this.isRowSelected(rowValue) && this.isColumnSelected(columnValue);
    } else if (this.isAColumnSelected()) {
      return this.isColumnSelected(columnValue);
    }

    return false;
  }

  private areFacetsPresent() {
    return this.isRowFacetPresent() && this.isColumnFacetPresent();
  }

  private isRowFacetPresent() {
    let facet = this.componentStateModel.get(this.rowId);
    return facet && !facet[0].disabled;
  }

  private isColumnFacetPresent() {
    let facet = this.componentStateModel.get(this.columnId);
    return facet && !facet[0].disabled;
  }

  private reset() {
    $$(this.element).empty();
    this.numberOfRows = 0;
    this.numberOfColumns = 0;
    this.data = new Array<Array<Cell>>();

    this.buildMatrix();
  }

  private parseResults(results: IQueryResults) {
    if (results) {
      let mainResults = results.groupByResults[this.groupByIndex[0]];
      if (mainResults) {
        for (let i = 0; i < mainResults.values.length; i++) {
          let value = mainResults.values[i].value;
          this.addRow();
          this.setValue(value, i + 1, 0);
        }
      }

      for (let i = 1; i < this.numberOfRows; i++) {
        for (let j = 1; j < this.numberOfColumns; j++) {
          let columnResult = results.groupByResults[this.groupByIndex[j]];
          let cellValue = this.getCellResult(columnResult, i, j);
          this.setValue(cellValue, i, j);
        }
      }
    }
  }

  private drawRow(row: HTMLElement, rowNumber: number) {
    let body = $$(this.element).find('.coveo-matrix');
    for (let i = 0; i < this.numberOfColumns; i++) {
      let cell = this.data[rowNumber][i].getHTML();
      $$(cell).on('click', () => {
        let handler = num => {
          this.handleClick(rowNumber, num);
        };
        handler(i);
      });

      if (this.options.enableHoverPreview) {
        ((num: number) => {
          $$(cell).on('mouseover', () => this.handleHoverIn(rowNumber, num));
          $$(cell).on('mouseout', () => this.handleHoverOut(rowNumber, num));
        })(i);
      }
      row.appendChild(cell);
    }
    body.appendChild(row);
  }

  private handleHoverIn(rowNumber: number, columnNumber: number) {
    if (this.isHoverWorkingOnRow(rowNumber) && this.isHoverWorkingOnColumn(columnNumber)) {
      this.previewTimeout = setTimeout(() => {
        this.displayResultsPreview(rowNumber, columnNumber);
      }, this.options.previewDelay);
    }
  }

  private handleHoverOut(rowNumber: number, columnNumber: number) {
    clearTimeout(this.previewTimeout);
    let cell = this.data[rowNumber][columnNumber];
    cell.removePreview();
  }

  private displayResultsPreview(rowNumber: number, columnNumber: number) {
    let query = this.createPreviewQuery(rowNumber, columnNumber);
    let cell = this.data[rowNumber][columnNumber];
    cell.addPreview(this.options.previewMinWidth, this.options.previewMaxWidth);

    let endpoint = this.queryController.getEndpoint();
    endpoint.search(query).then((data: IQueryResults) => {
      // During the time it take for the query to return, the matrix can change size depending
      // on if another query was performed : Need to check for undefined before accessing the data
      // we're trying to render;
      if (!this.isDataAvailable(rowNumber, columnNumber)) {
        return;
      }
      let cell = this.data[rowNumber][columnNumber];
      let instantiatedResults = _.map(data.results, (r: IQueryResult) => {
        return this.instantiateTemplate(r);
      });
      let html = '';
      _.each(instantiatedResults, result => {
        result.then((builtResultElement: HTMLElement) => {
          html += builtResultElement.outerHTML;
        });
      });
      Promise.all(instantiatedResults).then(() => {
        cell.updatePreview(html);
      });
    });
  }

  private instantiateTemplate(result: IQueryResult): Promise<HTMLElement> {
    return this.options.previewTemplate
      .instantiateToElement(result, {
        checkCondition: false,
        responsiveComponents: this.searchInterface.responsiveComponents
      })
      .then((content: HTMLElement) => {
        let initParameters: IInitializationParameters = {
          options: this.options,
          bindings: this.getBindings(),
          result: result
        };

        return Initialization.automaticallyCreateComponentsInside(content, initParameters).initResult.then(() => {
          return content;
        });
      });
  }

  private createPreviewQuery(rowNumber: number, columnNumber: number): IQuery {
    let rowFieldExpression = '(' + QueryUtils.buildFieldExpression(<string>this.options.rowField, '=', [this.getRowValue(rowNumber)]) + ')';
    let columnFieldExpression =
      '(' + QueryUtils.buildFieldExpression(<string>this.options.columnField, '=', [this.getColumnValue(columnNumber)]) + ')';
    let query = this.queryController.getLastQuery();
    query.aq = rowFieldExpression;
    query.aq += columnFieldExpression;
    query.sortCriteria = this.options.previewSortCriteria;
    query.sortField = <string>this.options.previewSortField;
    let fieldSliced = this.options.computedField.slice(1);
    let fieldExists = _.find(query.fieldsToInclude, (field: string) => {
      return field == fieldSliced;
    });
    if (!fieldExists && query.fieldsToInclude) {
      query.fieldsToInclude.push(fieldSliced);
    }
    return query;
  }

  private isHoverWorkingOnRow(rowNumber: number) {
    if (this.options.enableColumnTotals) {
      return rowNumber !== 0 && rowNumber !== this.numberOfRows - 1;
    }
    return rowNumber !== 0;
  }

  private isHoverWorkingOnColumn(columnNumber: number) {
    if (this.options.enableRowTotals) {
      return columnNumber !== 0 && columnNumber !== this.numberOfColumns - 1;
    }
    return columnNumber !== 0;
  }

  private isDataAvailable(row: number, column: number) {
    return this.data[row] !== undefined && this.data[row][column] !== undefined;
  }
}

Initialization.registerAutoCreateComponent(Matrix);

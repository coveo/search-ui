import {Template} from '../Templates/Template';
import {Component} from '../Base/Component';
import {ComponentOptions} from '../Base/ComponentOptions';
import {Cell} from './Cell';
import {IComponentBindings} from '../Base/ComponentBindings';
import {DefaultMatrixResultPreviewTemplate} from './DefaultMatrixResultPreviewTemplate';
import {$$} from '../../utils/Dom';
import {QueryEvents, IBuildingQueryEventArgs, IDoneBuildingQueryEventArgs, IQuerySuccessEventArgs} from '../../events/QueryEvents';
import {QueryStateModel} from '../../models/QueryStateModel';
import {QueryBuilder} from '../Base/QueryBuilder';
import {Utils} from '../../utils/Utils';
import {IGroupByRequest} from '../../rest/GroupByRequest';
import {IQueryResults} from '../../rest/QueryResults';
import {IQueryResult} from '../../rest/QueryResult';
import {Initialization, IInitializationParameters} from '../Base/Initialization';
import {QueryUtils} from '../../utils/QueryUtils';
import {IQuery} from '../../rest/Query';

declare const Globalize;

export interface IMatrixOptions {
  title?: string;

  rowField: string;
  sortCriteria?: string;
  maximumNumberOfRows?: number;
  enableRowTotals?: boolean;

  columnField: string;
  columnFieldValues?: string[];
  columnLabels?: string[];
  columnHeader?: string;
  maximumNumberOfValuesInGroupBy?: number;
  enableColumnTotals?: boolean;

  computedField: string;
  computedFieldOperation?: string;
  computedFieldFormat?: string;
  cellFontSize?: string;

  enableHoverPreview?: boolean;
  previewSortCriteria?: string;
  previewSortField?: string;
  previewMaxWidth?: string;
  previewMinWidth?: string;
  previewDelay?: number;
  previewTemplate?: Template;
}

/**
 * This component uses the values of two fields (row and column) to display the results of the specified computed field in a table.<br/>
 * The values to use for the columns are specified by the user while those for the rows are obtained by a groupBy operation performed at the same time as the main query (see {@link IGroupByRequest}).<br/>
 * Like a {@link Facet}, selecting a cell allows the user to drill down inside results by restricting the row field and the column field to match the values of the selected cell.
 */
export class Matrix extends Component {
  static ID = 'Matrix';

  /**
   * The possible options for the component
   * @componentOptions
   */
  static options: IMatrixOptions = {
    /**
     * Specifies the text to display at the top of the matrix.
     */
    title: ComponentOptions.buildStringOption(),
    /**
     * Specifies the field to use for the rows.<br/>
     * Required options, otherwise the component will not work
     */
    rowField: ComponentOptions.buildFieldOption({ required: true }),
    /**
     * Specifies the field to use for the columns.<br/>
     * Required options, otherwise the component will not work
     */
    columnField: ComponentOptions.buildFieldOption({ required: true }),
    /**
     * Specifies the criteria used to sort the rows. The available sort criteria are the same as those for the Group By parameter (see Group By Parameters - sortCriteria).<br/>
     * The default value is 'ComputedFieldDescending'.
     */
    sortCriteria: ComponentOptions.buildStringOption({ defaultValue: 'ComputedFieldDescending' }),
    /**
     * Specifies the maximum number of rows to display in the matrix.<br/>
     * The default value is 10.
     */
    maximumNumberOfRows: ComponentOptions.buildNumberOption({ defaultValue: 10, min: 0 }),
    /**
     * Specifies whether to add a total column which contains the total for each row.<br/>
     * The default value is true.
     */
    enableRowTotals: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    /**
     * Specifies the field values to use for each column.<br/>
     * If not specified, you won't generate any column except one for the 'Total' column.
     */
    columnFieldValues: ComponentOptions.buildListOption({ defaultValue: [] }),
    /**
     * Specifies the labels values to use for each column.<br/>
     * The array should match the {@link Matrix.options.columnFieldValues}.
     */
    columnLabels: ComponentOptions.buildListOption({ defaultValue: [] }),
    /**
     * Specifies the label for the first column on the left, as a description of the columnField.
     */
    columnHeader: ComponentOptions.buildStringOption(),
    /**
     * Specifies the maximum number of results to include in the group by requests for the columns.<br/>
     * This value should always be greater than {@link Matrix.options.maximumNumberOfRows}. If it is too small, some results won't be displayed in the matrix.<br/>
     * The default value is 100.
     */
    maximumNumberOfValuesInGroupBy: ComponentOptions.buildNumberOption({ defaultValue: 100, min: 0 }),
    /**
     * Specifies whether to add a total row which contains the total for each column.<br/>
     * The default value is true.
     */
    enableColumnTotals: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    /**
     * Specifies the field whose computed values are displayed in the cells.
     */
    computedField: ComponentOptions.buildFieldOption({ required: true }),
    /**
     * Specifies the type of aggregate operation to use on the computed field.<br/>
     * The available values are the same as those for the {@link Facet.options.computedFieldOperation}.<br/>
     * The available values are:
     * <ul>
     *   <li>sum - Computes the sum of the computed field values.</li>
     *   <li>average - Computes the average of the computed field values.</li>
     *   <li>minimum - Finds the minimum value of the computed field values.</li>
     *   <li>maximum - Finds the maximum value of the computed field values.</li>
     * </ul>
     * The default value is sum.
     */
    computedFieldOperation: ComponentOptions.buildStringOption({ defaultValue: 'sum' }),
    /**
     * Specifies how to format the values resulting from a computed field operation.<br/>
     * The available formats are the same as those for the {@link Facet.options.computedFieldFormat}.<br/>
     * The formats available are defined by the Globalize library. The most common used formats are:
     * <ul>
     *   <li>c0 - Formats the value as a currency.</li>
     *   <li>n0 - Formats the value as an integer.</li>
     *   <li>n2 - Formats the value as a floating point with 2 decimal digits.</li>
     * </ul>
     * The default value is c0.
     */
    computedFieldFormat: ComponentOptions.buildStringOption({ defaultValue: 'c0' }),
    /**
     * Specifies the font-size of the cells.<br/>
     * This option is mainly used to reduce the cell font-size when some values are cropped because there are too many columns in the matrix.<br/>
     * Other options to fix this problem are to remove less important columns or modify the CSS to give more place to the matrix.
     */
    cellFontSize: ComponentOptions.buildStringOption({ defaultValue: '' }),
    /**
     * Specifies whether to show a preview popup of cell results on hover. The default value is true.
     */
    enableHoverPreview: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    /**
     * Specifies the criteria to use to sort the results of the hover preview.<br/>
     * The available sort criteria values are the same as those of the {@link Query}.
     * Possible values are :
     * <ul>
     *    <li> relevancy :  This uses all the configured ranking weights as well as any specified ranking expressions to rank results.</li>
     *    <li> dateascending / datedescending : Sort using the value of the @date field, which is typically the last modification date of an item in the index.</li>
     *    <li> qre : Sort using only the weights applied through ranking expressions. This is much like using Relevancy except that automatic weights based on keyword proximity etc, are not computed.<li/>
     *    <li> nosort : Do not sort the results. The order in which items are returned is essentially random.</li>
     *    <li> fieldascending / fielddescending : Sort using the value of a custom field.</li>
     * </ul>
     * The default value is 'FieldDescending'.
     */
    previewSortCriteria: ComponentOptions.buildStringOption({ defaultValue: 'FieldDescending' }),
    /**
     * Specifies the field to use when the previewSortCriteria option is FieldDescending or FieldAscending.<br/>
     * By default, the value of the computedField option is used.
     */
    previewSortField: ComponentOptions.buildFieldOption(),
    /**
     * Specifies the maximum width of the preview pop-up.<br/>
     * The default value is 500px.
     */
    previewMaxWidth: ComponentOptions.buildStringOption({ defaultValue: '500px' }),
    /**
     * Specifies the minimum width of the preview pop-up.<br/>
     * The default value is 0.
     */
    previewMinWidth: ComponentOptions.buildStringOption({ defaultValue: '0' }),
    /**
     * Specifies the delay (in milliseconds) before the query used to get the preview results is sent.<br/>
     * The default value is 500.
     */
    previewDelay: ComponentOptions.buildNumberOption({ defaultValue: 500 }),
    /**
     * Specifies the ID or CSS selector of the template to use to render the results of the hover preview.<br/>
     * Eg : <code>data-template-id='TemplateId'</code> , <code>data-template-selector='.templateSelector'</code><br/>
     *
     */
    previewTemplate: ComponentOptions.buildTemplateOption()
  }

  /**
   * Holds the data for the matrix
   */
  public data: Cell[][];
  public groupByIndex = [];
  public rowId = '';
  public columnId = '';
  /**
   * The currently selected row value, or undefined if nothing is selected
   */
  public selectedRowValue: string = undefined;
  /**
   * The currently selected column value, or undefined if nothing is selected
   */
  public selectedColumnValue = undefined;

  private numberOfRows = 0;
  private numberOfColumns = 0;
  private previewTimeout: number;

  /**
   * Create a new matrix, check if the options are valid and makes sense. Bind query events.
   * @param element
   * @param options
   * @param bindings
   */
  constructor(public element: HTMLElement, public options?: IMatrixOptions, bindings?: IComponentBindings) {
    super(element, Matrix.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, Matrix, options);

    if (!this.options.previewTemplate) {
      this.options.previewTemplate = new DefaultMatrixResultPreviewTemplate(this.options.computedField, this.options.computedFieldFormat);
    }

    if (!this.options.previewSortField) {
      this.options.previewSortField = this.options.computedField
    }

    if (this.options.columnFieldValues.length != this.options.columnLabels.length) {
      this.options.columnLabels = this.options.columnFieldValues;
    }

    this.buildMatrix();
    if (this.options.rowField == null) {
      this.logger.error('\'rowField\' option is required in the Matrix component')
    } else if (this.options.columnField == null) {
      this.logger.error('\'columnField\' option is required in the Matrix component')
    } else if (this.options.computedField == null) {
      this.logger.error('\'computedField\' option is required in the Matrix component')
    } else {
      this.bindEvents();
      this.initQueryState();
    }
  }

  /**
   * Select a cell by it's row and column number. Does not execute a query.
   * @param rowNumber
   * @param columnNumber
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
      this.selectedColumnValue = columnValue
      this.queryStateModel.set(this.columnId, []);
    }
  }

  /**
   * Return the currently selected column value
   */
  public getSelectedColumnValue(): string {
    return this.selectedColumnValue;
  }

  /**
   * Return the currently selected row value
   */
  public getSelectedRowValue(): string {
    return this.selectedRowValue;
  }

  /**
   * Get the HTMLElement associated to the desired cell
   * @param rowNumber
   * @param columnNumber
   * @returns {HTMLElement}
   */
  public getCellElement(rowNumber: number, columnNumber: number): HTMLElement {
    return this.data[rowNumber][columnNumber].getHTML();
  }

  /**
   * Get the string associated to the desired cell
   * @param rowNumber
   * @param columnNumber
   * @returns {string}
   */
  public getCellValue(rowNumber: number, columnNumber: number): string {
    let cell = this.getCellElement(rowNumber, columnNumber);
    return $$(cell).text();
  }

  public drawMatrix() {
    let headerRow = $$('div', {
      className: 'coveo-matrix-row matrix-header-row'
    })
    this.drawRow(headerRow.el, 0);
    let numberOfRowsToDraw = this.options.enableColumnTotals ? this.numberOfRows - 1 : this.numberOfRows
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
      })
    }
  }

  private bindEvents() {
    this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => this.handleBuildingQuery(args));
    this.bind.onRootElement(QueryEvents.doneBuildingQuery, (args: IDoneBuildingQueryEventArgs) => this.handleDoneBuildingQuery(args));
    this.bind.onRootElement(QueryEvents.deferredQuerySuccess, (args: IQuerySuccessEventArgs) => this.handleDeferredQuerySuccess(args));
  }

  private initQueryState() {
    this.rowId = QueryStateModel.getFacetId(this.options.rowField);
    this.columnId = QueryStateModel.getFacetId(this.options.columnField);

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
    let titleHtml = $$('div', {
      className: 'coveo-matrix-title'
    }, title).el;
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
        args.queryBuilder.advancedExpression.addFieldExpression(this.options.rowField, '=', [this.selectedRowValue])
      }
      if (this.selectedColumnValue && !this.isColumnFacetPresent()) {
        args.queryBuilder.advancedExpression.addFieldExpression(this.options.columnField, '=', [this.selectedColumnValue])
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
      field: this.options.rowField,
      sortCriteria: this.options.sortCriteria,
      computedFields: this.getComputedFields(),
      maximumNumberOfValues: this.options.maximumNumberOfRows
    }

    this.groupByIndex.push(queryBuilder.groupByRequests.length);
    queryBuilder.groupByRequests.push(groupBy);
  }

  private addColumnsGroupByRequests(queryBuilder: QueryBuilder) {
    for (let i = 0; i < this.options.columnFieldValues.length; i++) {
      let groupBy = {
        field: this.options.rowField,
        sortCriteria: this.options.sortCriteria,
        computedFields: this.getComputedFields(),
        queryOverride: '(' + this.buildExpression(queryBuilder) + ')' + '(' + this.options.columnField + '=\'' + this.options.columnFieldValues[i] + '\')',
        maximumNumberOfValues: this.options.maximumNumberOfValuesInGroupBy
      }

      this.groupByIndex.push(queryBuilder.groupByRequests.length)
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
    let computedFields = [{
      field: this.options.computedField,
      operation: this.options.computedFieldOperation
    }];
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
    this.setValue('Total', 0, this.numberOfColumns - 1)
    for (let i = 1; i < this.numberOfRows; i++) {
      let rowTotal = this.computeRowTotal(i);
      this.setValue(rowTotal, i, this.numberOfColumns - 1)
    }

    // Fix sort ordering when not all columns field values are present.
    if (this.options.sortCriteria.toLowerCase() == 'computedfielddescending') {
      this.data.sort((a: Cell[], b: Cell[]): number => {
        return b[this.numberOfColumns - 1].getValue() - a[this.numberOfColumns - 1].getValue()
      })
    }

    if (this.options.sortCriteria.toLowerCase() == 'computedfieldascending') {
      this.data.sort((a: Cell[], b: Cell[]): number => {
        return a[this.numberOfColumns - 1].getValue() - b[this.numberOfColumns - 1].getValue()
      })
    }
  }

  private addColumnTotals() {
    this.addRow();
    this.setValue('Total', this.numberOfRows - 1, 0)
    for (let i = 1; i < this.numberOfColumns; i++) {
      let columnTotal = this.computeColumnTotal(i);
      this.setValue(columnTotal, this.numberOfRows - 1, i)
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
        cellValue = Globalize.format(parseInt(cellValue), this.options.computedFieldFormat)
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
      this.addCellToRow(this.numberOfRows, i)
    }
    this.numberOfRows++;
  }

  private addColumn() {
    for (let i = 0; i < this.numberOfRows; i++) {
      this.addCellToRow(i, this.numberOfColumns)
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
      $$(cell).addClass('coveo-matrix-selected')
    }

    if (this.isAColumnSelected() && !this.isColumnSelected(this.getColumnValue(columnNumber))) {
      if (columnNumber != 0 && rowNumber != 0) {
        $$(cell).addClass('coveo-matrix-unimportant')
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
    return selectedColumnValues.length !== 0 || this.selectedColumnValue != undefined
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
    return facet && !facet[0].disabled
  }

  private isColumnFacetPresent() {
    let facet = this.componentStateModel.get(this.columnId);
    return facet && !facet[0].disabled
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
    let body = $$(this.element).find('.coveo-matrix')
    for (let i = 0; i < this.numberOfColumns; i++) {
      let cell = this.data[rowNumber][i].getHTML();
      $$(cell).on('click', () => {
        let handler = (num) => {
          this.handleClick(rowNumber, num);
        }
        handler(i);
      })

      if (this.options.enableHoverPreview) {
        ((num: number) => {
          $$(cell).on('mouseover', () => this.handleHoverIn(rowNumber, num));
          $$(cell).on('mouseout', () => this.handleHoverOut(rowNumber, num));
        })(i)
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
        return this.instantiateTemplate(r)
      })
      let html = '';
      _.each(instantiatedResults, (result) => {
        html += result.outerHTML;
      });
      cell.updatePreview(html);
    })
  }

  private instantiateTemplate(result: IQueryResult): HTMLElement {
    let content = this.options.previewTemplate.instantiateToElement(result, false);
    let initParameters: IInitializationParameters = {
      options: this.options,
      bindings: this.getBindings(),
      result: result
    }

    Initialization.automaticallyCreateComponentsInside(content, initParameters)

    return content;
  }

  private createPreviewQuery(rowNumber: number, columnNumber: number): IQuery {
    let rowFieldExpression = '(' + QueryUtils.buildFieldExpression(this.options.rowField, '=', [this.getRowValue(rowNumber)]) + ')';
    let columnFieldExpression = '(' + QueryUtils.buildFieldExpression(this.options.columnField, '=', [this.getColumnValue(columnNumber)]) + ')';
    let query = this.queryController.getLastQuery();
    query.aq = rowFieldExpression;
    query.aq += columnFieldExpression;
    query.sortCriteria = this.options.previewSortCriteria;
    query.sortField = this.options.previewSortField;
    let fieldSliced = this.options.computedField.slice(1);
    let fieldExists = _.find(query.fieldsToInclude, (field: string) => {
      return field == fieldSliced
    })
    if (!fieldExists) {
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

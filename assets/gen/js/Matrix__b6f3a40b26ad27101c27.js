webpackJsonpCoveo__temporary([36],{

/***/ 258:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Globalize = __webpack_require__(23);
__webpack_require__(627);
var _ = __webpack_require__(0);
var QueryEvents_1 = __webpack_require__(11);
var GlobalExports_1 = __webpack_require__(3);
var QueryStateModel_1 = __webpack_require__(13);
var Dom_1 = __webpack_require__(1);
var QueryUtils_1 = __webpack_require__(21);
var Utils_1 = __webpack_require__(4);
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
var TemplateComponentOptions_1 = __webpack_require__(61);
var Cell_1 = __webpack_require__(628);
var DefaultMatrixResultPreviewTemplate_1 = __webpack_require__(629);
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
var Matrix = /** @class */ (function (_super) {
    __extends(Matrix, _super);
    /**
     * Creates a new Matrix. Also verifies whether options are valid and coherent. Binds query events.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the Matrix component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function Matrix(element, options, bindings) {
        var _this = _super.call(this, element, Matrix.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.groupByIndex = [];
        _this.rowId = '';
        _this.columnId = '';
        /**
         * The currently selected row value, or `undefined` if nothing is selected.
         */
        _this.selectedRowValue = undefined;
        /**
         * The currently selected column value, or `undefined` if nothing is selected.
         */
        _this.selectedColumnValue = undefined;
        _this.numberOfRows = 0;
        _this.numberOfColumns = 0;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, Matrix, options);
        if (!_this.options.previewTemplate) {
            _this.options.previewTemplate = new DefaultMatrixResultPreviewTemplate_1.DefaultMatrixResultPreviewTemplate(_this.options.computedField, _this.options.computedFieldFormat);
        }
        if (!_this.options.previewSortField) {
            _this.options.previewSortField = _this.options.computedField;
        }
        if (_this.options.columnFieldValues.length != _this.options.columnLabels.length) {
            _this.options.columnLabels = _this.options.columnFieldValues;
        }
        _this.buildMatrix();
        if (_this.options.rowField == null) {
            _this.logger.error("'rowField' option is required in the Matrix component");
        }
        else if (_this.options.columnField == null) {
            _this.logger.error("'columnField' option is required in the Matrix component");
        }
        else if (_this.options.computedField == null) {
            _this.logger.error("'computedField' option is required in the Matrix component");
        }
        else {
            _this.bindEvents();
            _this.initQueryState();
        }
        return _this;
    }
    /**
     * Selects a cell by its row and column number. Does not execute a query.
     * @param rowNumber The row number of the cell to select.
     * @param columnNumber The column number of the cell to select.
     */
    Matrix.prototype.selectCell = function (rowNumber, columnNumber) {
        var rowValue, columnValue;
        if (rowNumber !== 0 && rowNumber !== this.numberOfRows - 1) {
            rowValue = this.getRowValue(rowNumber);
        }
        if (columnNumber !== 0 && columnNumber !== this.numberOfColumns - 1) {
            columnValue = this.getColumnValue(columnNumber);
        }
        if (rowValue && this.isRowFacetPresent()) {
            this.queryStateModel.set(this.rowId, [rowValue]);
        }
        else {
            this.selectedRowValue = rowValue;
            this.queryStateModel.set(this.rowId, []);
        }
        if (columnValue && this.isColumnFacetPresent()) {
            this.queryStateModel.set(this.columnId, [columnValue]);
        }
        else {
            this.selectedColumnValue = columnValue;
            this.queryStateModel.set(this.columnId, []);
        }
    };
    /**
     * Returns the currently selected column value.
     */
    Matrix.prototype.getSelectedColumnValue = function () {
        return this.selectedColumnValue;
    };
    /**
     * Returns the currently selected row value.
     */
    Matrix.prototype.getSelectedRowValue = function () {
        return this.selectedRowValue;
    };
    /**
     * Gets the HTMLElement associated to a cell.
     * @param rowNumber The row number of the cell.
     * @param columnNumber The column number of the cell.
     * @returns {HTMLElement} The associated HTMLElement.
     */
    Matrix.prototype.getCellElement = function (rowNumber, columnNumber) {
        return this.data[rowNumber][columnNumber].getHTML();
    };
    /**
     * Gets the string associated to a cell.
     * @param rowNumber The row number of the cell.
     * @param columnNumber The column number of the cell.
     * @returns {string} The associated string.
     */
    Matrix.prototype.getCellValue = function (rowNumber, columnNumber) {
        var cell = this.getCellElement(rowNumber, columnNumber);
        return Dom_1.$$(cell).text();
    };
    Matrix.prototype.drawMatrix = function () {
        var _this = this;
        var headerRow = Dom_1.$$('div', {
            className: 'coveo-matrix-row matrix-header-row'
        });
        this.drawRow(headerRow.el, 0);
        var numberOfRowsToDraw = this.options.enableColumnTotals ? this.numberOfRows - 1 : this.numberOfRows;
        for (var i = 1; i < numberOfRowsToDraw; i++) {
            var row = Dom_1.$$('div', {
                className: 'coveo-matrix-row'
            }).el;
            this.drawRow(row, i);
        }
        if (this.options.enableColumnTotals) {
            var totalRow = Dom_1.$$('div', {
                className: 'coveo-matrix-row matrix-total-row'
            }).el;
            this.drawRow(totalRow, this.numberOfRows - 1);
        }
        if (this.options.cellFontSize !== '') {
            var cells = Dom_1.$$(this.element).findAll('.coveo-matrix-cell');
            _.each(cells, function (c) {
                c.style.fontSize = _this.options.cellFontSize;
            });
        }
    };
    Matrix.prototype.bindEvents = function () {
        var _this = this;
        this.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, function (args) { return _this.handleBuildingQuery(args); });
        this.bind.onRootElement(QueryEvents_1.QueryEvents.doneBuildingQuery, function (args) { return _this.handleDoneBuildingQuery(args); });
        this.bind.onRootElement(QueryEvents_1.QueryEvents.deferredQuerySuccess, function (args) { return _this.handleDeferredQuerySuccess(args); });
    };
    Matrix.prototype.initQueryState = function () {
        this.rowId = QueryStateModel_1.QueryStateModel.getFacetId(this.options.rowField);
        this.columnId = QueryStateModel_1.QueryStateModel.getFacetId(this.options.columnField);
        this.queryStateModel.registerNewAttribute(this.rowId, []);
        this.queryStateModel.registerNewAttribute(this.columnId, []);
    };
    Matrix.prototype.buildMatrix = function () {
        this.buildTitle();
        this.buildBody();
        this.data = new Array();
        this.addHeaderRow();
    };
    Matrix.prototype.buildTitle = function () {
        var title = this.options.title ? this.options.title : '';
        var titleHtml = Dom_1.$$('div', {
            className: 'coveo-matrix-title'
        }, title).el;
        this.element.appendChild(titleHtml);
    };
    Matrix.prototype.buildBody = function () {
        var body = Dom_1.$$('div', {
            className: 'coveo-matrix'
        }).el;
        this.element.appendChild(body);
    };
    Matrix.prototype.handleBuildingQuery = function (args) {
        if (!this.areFacetsPresent()) {
            if (this.selectedRowValue && !this.isRowFacetPresent()) {
                args.queryBuilder.advancedExpression.addFieldExpression(this.options.rowField, '=', [this.selectedRowValue]);
            }
            if (this.selectedColumnValue && !this.isColumnFacetPresent()) {
                args.queryBuilder.advancedExpression.addFieldExpression(this.options.columnField, '=', [this.selectedColumnValue]);
            }
        }
    };
    Matrix.prototype.handleDoneBuildingQuery = function (args) {
        this.groupByIndex = [];
        this.addMainGroubByRequest(args.queryBuilder);
        this.addColumnsGroupByRequests(args.queryBuilder);
    };
    Matrix.prototype.handleDeferredQuerySuccess = function (args) {
        this.reset();
        this.parseResults(args.results);
        this.addTotals();
        this.drawMatrix();
        this.formatCells();
        this.selectedRowValue = undefined;
        this.selectedColumnValue = undefined;
    };
    Matrix.prototype.addMainGroubByRequest = function (queryBuilder) {
        var groupBy = {
            field: this.options.rowField,
            sortCriteria: this.options.sortCriteria,
            computedFields: this.getComputedFields(),
            maximumNumberOfValues: this.options.maximumNumberOfRows
        };
        this.groupByIndex.push(queryBuilder.groupByRequests.length);
        queryBuilder.groupByRequests.push(groupBy);
    };
    Matrix.prototype.addColumnsGroupByRequests = function (queryBuilder) {
        for (var i = 0; i < this.options.columnFieldValues.length; i++) {
            var groupBy = {
                field: this.options.rowField,
                sortCriteria: this.options.sortCriteria,
                computedFields: this.getComputedFields(),
                queryOverride: '(' + this.buildExpression(queryBuilder) + ')' + '(' + this.options.columnField + "='" + this.options.columnFieldValues[i] + "')",
                maximumNumberOfValues: this.options.maximumNumberOfValuesInGroupBy
            };
            this.groupByIndex.push(queryBuilder.groupByRequests.length);
            queryBuilder.groupByRequests.push(groupBy);
        }
    };
    Matrix.prototype.buildExpression = function (queryBuilder) {
        var expression = queryBuilder.expression.build();
        var advancedExpression = queryBuilder.advancedExpression.build();
        var constantExpression = queryBuilder.constantExpression.build();
        var totalQuery = '';
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
    };
    Matrix.prototype.getComputedFields = function () {
        var computedFields = [
            {
                field: this.options.computedField,
                operation: this.options.computedFieldOperation
            }
        ];
        return computedFields;
    };
    Matrix.prototype.getCellResult = function (results, rowNumber, columnNumber) {
        var rowValue = this.getRowValue(rowNumber);
        var columnValue = this.getColumnValue(columnNumber);
        var cellResult = 0;
        for (var i = 0; i < results.values.length; i++) {
            if (results.values[i].value === rowValue) {
                cellResult = results.values[i].computedFieldResults[0];
                break;
            }
        }
        if (this.isAColumnSelected() && !this.isColumnSelected(columnValue)) {
            cellResult = 0;
        }
        return cellResult;
    };
    Matrix.prototype.addTotals = function () {
        if (this.options.enableRowTotals) {
            this.addRowTotals();
        }
        if (this.options.enableColumnTotals) {
            this.addColumnTotals();
        }
    };
    Matrix.prototype.addRowTotals = function () {
        var _this = this;
        this.addColumn();
        this.setValue('Total', 0, this.numberOfColumns - 1);
        for (var i = 1; i < this.numberOfRows; i++) {
            var rowTotal = this.computeRowTotal(i);
            this.setValue(rowTotal, i, this.numberOfColumns - 1);
        }
        // Fix sort ordering when not all columns field values are present.
        if (this.options.sortCriteria.toLowerCase() == 'computedfielddescending') {
            this.data.sort(function (a, b) {
                return b[_this.numberOfColumns - 1].getValue() - a[_this.numberOfColumns - 1].getValue();
            });
        }
        if (this.options.sortCriteria.toLowerCase() == 'computedfieldascending') {
            this.data.sort(function (a, b) {
                return a[_this.numberOfColumns - 1].getValue() - b[_this.numberOfColumns - 1].getValue();
            });
        }
    };
    Matrix.prototype.addColumnTotals = function () {
        this.addRow();
        this.setValue('Total', this.numberOfRows - 1, 0);
        for (var i = 1; i < this.numberOfColumns; i++) {
            var columnTotal = this.computeColumnTotal(i);
            this.setValue(columnTotal, this.numberOfRows - 1, i);
        }
    };
    Matrix.prototype.computeRowTotal = function (rowNumber) {
        var total = 0;
        for (var columnNumber = 1; columnNumber < this.numberOfColumns - 1; columnNumber++) {
            total += parseInt(this.getCellValue(rowNumber, columnNumber));
        }
        return total;
    };
    Matrix.prototype.computeColumnTotal = function (columnNumber) {
        var total = 0;
        for (var rowNumber = 1; rowNumber < this.numberOfRows - 1; rowNumber++) {
            total += parseInt(this.getCellValue(rowNumber, columnNumber));
        }
        return total;
    };
    Matrix.prototype.formatCells = function () {
        for (var i = 1; i < this.numberOfRows; i++) {
            for (var j = 1; j < this.numberOfColumns; j++) {
                var cellValue = this.getCellValue(i, j);
                cellValue = Globalize.format(parseInt(cellValue), this.options.computedFieldFormat);
                this.setValue(cellValue, i, j);
            }
        }
    };
    Matrix.prototype.addHeaderRow = function () {
        this.addRow();
        this.addColumn();
        this.setValue(this.options.columnHeader, 0, 0);
        for (var i = 0; i < this.options.columnLabels.length; i++) {
            this.addColumn();
            this.setValue(this.options.columnLabels[i], 0, i + 1);
        }
    };
    Matrix.prototype.addRow = function () {
        this.data.push(new Array());
        for (var i = 0; i < this.numberOfColumns; i++) {
            this.addCellToRow(this.numberOfRows, i);
        }
        this.numberOfRows++;
    };
    Matrix.prototype.addColumn = function () {
        for (var i = 0; i < this.numberOfRows; i++) {
            this.addCellToRow(i, this.numberOfColumns);
        }
        this.numberOfColumns++;
    };
    Matrix.prototype.addCellToRow = function (rowNumber, columnNumber) {
        var column = Dom_1.$$('div', {
            className: 'coveo-matrix-cell'
        });
        if (columnNumber == 0) {
            column.addClass('matrix-first-column');
        }
        this.data[rowNumber].push(new Cell_1.Cell(0, column.el));
    };
    Matrix.prototype.setValue = function (value, rowNumber, columnNumber) {
        var cell = this.getCellElement(rowNumber, columnNumber);
        if (!Utils_1.Utils.isNullOrUndefined(value)) {
            Dom_1.$$(cell).text(value.toString());
        }
        if (this.isCellSelected(this.getRowValue(rowNumber), this.getColumnValue(columnNumber))) {
            Dom_1.$$(cell).addClass('coveo-matrix-selected');
        }
        if (this.isAColumnSelected() && !this.isColumnSelected(this.getColumnValue(columnNumber))) {
            if (columnNumber != 0 && rowNumber != 0) {
                Dom_1.$$(cell).addClass('coveo-matrix-unimportant');
            }
        }
        this.data[rowNumber][columnNumber].setValue(value);
    };
    Matrix.prototype.handleClick = function (rowNumber, columnNumber) {
        this.selectCell(rowNumber, columnNumber);
        this.queryController.executeQuery();
    };
    Matrix.prototype.getRowValue = function (rowNumber) {
        return this.data[rowNumber][0].getValue();
    };
    Matrix.prototype.getColumnValue = function (columnNumber) {
        return this.options.columnFieldValues[columnNumber - 1];
    };
    Matrix.prototype.isAColumnSelected = function () {
        var selectedColumnValues = this.queryStateModel.get(this.columnId) || [];
        return selectedColumnValues.length !== 0 || this.selectedColumnValue != undefined;
    };
    Matrix.prototype.isColumnSelected = function (columnValue) {
        if (this.isAColumnSelected() && columnValue) {
            var selectedColumnValues = this.queryStateModel.attributes[this.columnId] || [];
            for (var i = 0; i < selectedColumnValues.length; i++) {
                if (selectedColumnValues[i].toLowerCase() === columnValue.toLowerCase()) {
                    return true;
                }
            }
        }
        return this.selectedColumnValue == columnValue;
    };
    Matrix.prototype.isARowSelected = function () {
        var selectedRowValues = this.queryStateModel.get(this.rowId) || [];
        return selectedRowValues.length !== 0 || this.selectedRowValue !== undefined;
    };
    Matrix.prototype.isRowSelected = function (rowValue) {
        if (this.isARowSelected() && rowValue) {
            var selectedRowValues = this.queryStateModel.get(this.rowId) || [];
            for (var i = 0; i < selectedRowValues.length; i++) {
                if (selectedRowValues[i].toLowerCase() === rowValue.toLowerCase()) {
                    return true;
                }
            }
        }
        return this.selectedRowValue == rowValue;
    };
    Matrix.prototype.isCellSelected = function (rowValue, columnValue) {
        if (this.isAColumnSelected() && this.isARowSelected()) {
            return this.isRowSelected(rowValue) && this.isColumnSelected(columnValue);
        }
        else if (this.isAColumnSelected()) {
            return this.isColumnSelected(columnValue);
        }
        return false;
    };
    Matrix.prototype.areFacetsPresent = function () {
        return this.isRowFacetPresent() && this.isColumnFacetPresent();
    };
    Matrix.prototype.isRowFacetPresent = function () {
        var facet = this.componentStateModel.get(this.rowId);
        return facet && !facet[0].disabled;
    };
    Matrix.prototype.isColumnFacetPresent = function () {
        var facet = this.componentStateModel.get(this.columnId);
        return facet && !facet[0].disabled;
    };
    Matrix.prototype.reset = function () {
        Dom_1.$$(this.element).empty();
        this.numberOfRows = 0;
        this.numberOfColumns = 0;
        this.data = new Array();
        this.buildMatrix();
    };
    Matrix.prototype.parseResults = function (results) {
        if (results) {
            var mainResults = results.groupByResults[this.groupByIndex[0]];
            if (mainResults) {
                for (var i = 0; i < mainResults.values.length; i++) {
                    var value = mainResults.values[i].value;
                    this.addRow();
                    this.setValue(value, i + 1, 0);
                }
            }
            for (var i = 1; i < this.numberOfRows; i++) {
                for (var j = 1; j < this.numberOfColumns; j++) {
                    var columnResult = results.groupByResults[this.groupByIndex[j]];
                    var cellValue = this.getCellResult(columnResult, i, j);
                    this.setValue(cellValue, i, j);
                }
            }
        }
    };
    Matrix.prototype.drawRow = function (row, rowNumber) {
        var _this = this;
        var body = Dom_1.$$(this.element).find('.coveo-matrix');
        var _loop_1 = function (i) {
            var cell = this_1.data[rowNumber][i].getHTML();
            Dom_1.$$(cell).on('click', function () {
                var handler = function (num) {
                    _this.handleClick(rowNumber, num);
                };
                handler(i);
            });
            if (this_1.options.enableHoverPreview) {
                (function (num) {
                    Dom_1.$$(cell).on('mouseover', function () { return _this.handleHoverIn(rowNumber, num); });
                    Dom_1.$$(cell).on('mouseout', function () { return _this.handleHoverOut(rowNumber, num); });
                })(i);
            }
            row.appendChild(cell);
        };
        var this_1 = this;
        for (var i = 0; i < this.numberOfColumns; i++) {
            _loop_1(i);
        }
        body.appendChild(row);
    };
    Matrix.prototype.handleHoverIn = function (rowNumber, columnNumber) {
        var _this = this;
        if (this.isHoverWorkingOnRow(rowNumber) && this.isHoverWorkingOnColumn(columnNumber)) {
            this.previewTimeout = window.setTimeout(function () {
                _this.displayResultsPreview(rowNumber, columnNumber);
            }, this.options.previewDelay);
        }
    };
    Matrix.prototype.handleHoverOut = function (rowNumber, columnNumber) {
        clearTimeout(this.previewTimeout);
        var cell = this.data[rowNumber][columnNumber];
        cell.removePreview();
    };
    Matrix.prototype.displayResultsPreview = function (rowNumber, columnNumber) {
        var _this = this;
        var query = this.createPreviewQuery(rowNumber, columnNumber);
        var cell = this.data[rowNumber][columnNumber];
        cell.addPreview(this.options.previewMinWidth, this.options.previewMaxWidth);
        var endpoint = this.queryController.getEndpoint();
        endpoint.search(query).then(function (data) {
            // During the time it take for the query to return, the matrix can change size depending
            // on if another query was performed : Need to check for undefined before accessing the data
            // we're trying to render;
            if (!_this.isDataAvailable(rowNumber, columnNumber)) {
                return;
            }
            var cell = _this.data[rowNumber][columnNumber];
            var instantiatedResults = _.map(data.results, function (r) {
                return _this.instantiateTemplate(r);
            });
            var html = '';
            _.each(instantiatedResults, function (result) {
                result.then(function (builtResultElement) {
                    html += builtResultElement.outerHTML;
                });
            });
            Promise.all(instantiatedResults).then(function () {
                cell.updatePreview(html);
            });
        });
    };
    Matrix.prototype.instantiateTemplate = function (result) {
        var _this = this;
        return this.options.previewTemplate
            .instantiateToElement(result, {
            checkCondition: false,
            responsiveComponents: this.searchInterface.responsiveComponents
        })
            .then(function (content) {
            var initParameters = {
                options: _this.options,
                bindings: _this.getBindings(),
                result: result
            };
            return Initialization_1.Initialization.automaticallyCreateComponentsInside(content, initParameters).initResult.then(function () {
                return content;
            });
        });
    };
    Matrix.prototype.createPreviewQuery = function (rowNumber, columnNumber) {
        var rowFieldExpression = '(' + QueryUtils_1.QueryUtils.buildFieldExpression(this.options.rowField, '=', [this.getRowValue(rowNumber)]) + ')';
        var columnFieldExpression = '(' + QueryUtils_1.QueryUtils.buildFieldExpression(this.options.columnField, '=', [this.getColumnValue(columnNumber)]) + ')';
        var query = this.queryController.getLastQuery();
        query.aq = rowFieldExpression;
        query.aq += columnFieldExpression;
        query.sortCriteria = this.options.previewSortCriteria;
        query.sortField = this.options.previewSortField;
        var fieldSliced = this.options.computedField.slice(1);
        var fieldExists = _.find(query.fieldsToInclude, function (field) {
            return field == fieldSliced;
        });
        if (!fieldExists && query.fieldsToInclude) {
            query.fieldsToInclude.push(fieldSliced);
        }
        return query;
    };
    Matrix.prototype.isHoverWorkingOnRow = function (rowNumber) {
        if (this.options.enableColumnTotals) {
            return rowNumber !== 0 && rowNumber !== this.numberOfRows - 1;
        }
        return rowNumber !== 0;
    };
    Matrix.prototype.isHoverWorkingOnColumn = function (columnNumber) {
        if (this.options.enableRowTotals) {
            return columnNumber !== 0 && columnNumber !== this.numberOfColumns - 1;
        }
        return columnNumber !== 0;
    };
    Matrix.prototype.isDataAvailable = function (row, column) {
        return this.data[row] !== undefined && this.data[row][column] !== undefined;
    };
    Matrix.ID = 'Matrix';
    Matrix.doExport = function () {
        GlobalExports_1.exportGlobally({
            Matrix: Matrix
        });
    };
    /**
     * The possible options for the component
     * @componentOptions
     */
    Matrix.options = {
        /**
         * Specifies the text to display at the top of the Matrix.
         */
        title: ComponentOptions_1.ComponentOptions.buildStringOption(),
        /**
         * Specifies the field to use for the rows.
         *
         * Specifying a value for this options is required for this component to work.
         */
        rowField: ComponentOptions_1.ComponentOptions.buildFieldOption({ required: true }),
        /**
         * Specifies the field to use for the columns.
         *
         * Specifying a value for this options is required for this component to work.
         */
        columnField: ComponentOptions_1.ComponentOptions.buildFieldOption({ required: true }),
        /**
         * Specifies the criteria to use for sorting the rows.
         *
         * See {@link IGroupByRequest.sortCriteria} for the list of possible values.
         *
         * Default value is `computedfielddescending`.
         */
        sortCriteria: ComponentOptions_1.ComponentOptions.buildStringOption({ defaultValue: 'computedfielddescending' }),
        /**
         * Specifies the maximum number of rows to display in the Matrix.
         *
         * Default value is `10`. Minimum value is `0`.
         */
        maximumNumberOfRows: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 10, min: 0 }),
        /**
         * Specifies whether to display a **Total** column containing the sum of each row.
         *
         * Default value is `true`.
         */
        enableRowTotals: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * Specifies the field values to use for each column.
         *
         * See also {@link Matrix.options.columnLabels}.
         *
         * Default value is `[]`, which means that the Matrix will not generate any column (except the **Total** column, if
         * {@link Matrix.options.enableRowTotals} is `true`).
         */
        columnFieldValues: ComponentOptions_1.ComponentOptions.buildListOption({ defaultValue: [] }),
        /**
         * Specifies the label values to use for each column.
         *
         * Default value is `[]`. The array set for this options should match the {@link Matrix.options.columnFieldValues}.
         */
        columnLabels: ComponentOptions_1.ComponentOptions.buildListOption({ defaultValue: [] }),
        /**
         * Specifies the label for the first column on the left as a description of the {@link Matrix.options.columnField}.
         *
         * Default value is `undefined`.
         */
        columnHeader: ComponentOptions_1.ComponentOptions.buildStringOption(),
        /**
         * Specifies the maximum number of results to include in the {@link IGroupByRequest} for the columns.
         *
         * This value should always be greater than the {@link Matrix.options.maximumNumberOfRows}. If it is too small, some
         * of the results will not be displayed in the Matrix.
         *
         * Default value is `100`. Minimum value is `0`.
         */
        maximumNumberOfValuesInGroupBy: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 100, min: 0 }),
        /**
         * Specifies whether to add a **Total** row containing the total of each column.
         *
         * Default value is `true`
         */
        enableColumnTotals: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * Specifies the field whose computed values you want to display in the cells.
         *
         * Specifying a value for this options is required for this component to work.
         */
        computedField: ComponentOptions_1.ComponentOptions.buildFieldOption({ required: true }),
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
        computedFieldOperation: ComponentOptions_1.ComponentOptions.buildStringOption({ defaultValue: 'sum' }),
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
        computedFieldFormat: ComponentOptions_1.ComponentOptions.buildStringOption({ defaultValue: 'c0' }),
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
        cellFontSize: ComponentOptions_1.ComponentOptions.buildStringOption({ defaultValue: '' }),
        /**
         * Specifies whether to show a preview popup of cell results when hovering over a cell.
         *
         * See also {@link Matrix.options.previewSortCriteria}, {@link Matrix.options.previewMaxWidth},
         * {@link Matrix.options.previewMinWidth}, {@link Matrix.options.previewDelay} and
         * {@link Matrix.options.previewTemplate}.
         *
         * Default value is `true`.
         */
        enableHoverPreview: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
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
        previewSortCriteria: ComponentOptions_1.ComponentOptions.buildStringOption({ defaultValue: 'FieldDescending' }),
        /**
         * If {@link Matrix.options.previewSortCriteria} is `fieldascending` or `fielddescending`, specifies the field to
         * use for sorting the results of the hover preview.
         *
         * Default value is the value of {@link Matrix.options.computedField}.
         */
        previewSortField: ComponentOptions_1.ComponentOptions.buildFieldOption(),
        /**
         * If {@link Matrix.options.enableHoverPreview} is `true`, specifies the maximum width (in pixels) of the preview
         * popup.
         *
         * Default value is `500px`.
         */
        previewMaxWidth: ComponentOptions_1.ComponentOptions.buildStringOption({ defaultValue: '500px' }),
        /**
         * If {@link Matrix.options.enableHoverPreview} is `true`, specifies the minimum width (in pixels) of the preview
         * popup.
         *
         * Default value is `0`.
         */
        previewMinWidth: ComponentOptions_1.ComponentOptions.buildStringOption({ defaultValue: '0' }),
        /**
         * If {@link Matrix.options.enableHoverPreview} is `true`, specifies the delay (in milliseconds) before sending the
         * query to get the preview results.
         *
         * Default value is `500`.
         */
        previewDelay: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 500 }),
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
        previewTemplate: TemplateComponentOptions_1.TemplateComponentOptions.buildTemplateOption()
    };
    return Matrix;
}(Component_1.Component));
exports.Matrix = Matrix;
Initialization_1.Initialization.registerAutoCreateComponent(Matrix);


/***/ }),

/***/ 627:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 628:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var _ = __webpack_require__(0);
/**
 * Represent a single cell of data in the {@link Matrix} component.
 */
var Cell = /** @class */ (function () {
    function Cell(value, el) {
        if (value === void 0) { value = 0; }
        this.previewActive = false;
        this.element = el;
        this.value = value;
    }
    /**
     * Return the value of the cell.
     * @returns {any}
     */
    Cell.prototype.getValue = function () {
        return this.value;
    };
    /**
     * Return the `HTMLElement` for the cell.
     * @returns {HTMLElement}
     */
    Cell.prototype.getHTML = function () {
        return this.element;
    };
    /**
     * Set the value if the cell.
     * @param value
     */
    Cell.prototype.setValue = function (value) {
        this.value = value;
    };
    /**
     * Set the `HTMLElement` for the cell.
     * @param html
     */
    Cell.prototype.setHTML = function (html) {
        this.element = html;
    };
    /**
     * Show the preview of the cell.
     * @param minWidth css minWidth property : eg 100px
     * @param maxWidth css maxWidth property : eg 100px
     */
    Cell.prototype.addPreview = function (minWidth, maxWidth) {
        this.previewActive = true;
        var previewContainer = Dom_1.$$('div', {
            className: 'matrix-results-preview-container'
        });
        previewContainer.el.style.minWidth = minWidth;
        previewContainer.el.style.maxWidth = maxWidth;
        previewContainer.on('click', function (e) {
            e.stopPropagation();
        });
        this.element.appendChild(previewContainer.el);
        var container = Dom_1.$$(this.element).findAll('.matrix-results-preview-container');
        _.each(container, function (c) {
            Dom_1.$$(c).hide();
        });
    };
    /**
     * Remove the preview of the cell
     */
    Cell.prototype.removePreview = function () {
        this.previewActive = false;
        var container = Dom_1.$$(this.element).find('.matrix-results-preview-container');
        if (container) {
            Dom_1.$$(container).detach();
        }
    };
    /**
     * Update the preview with a new template
     * @param template
     */
    Cell.prototype.updatePreview = function (template) {
        if (this.previewActive) {
            var preview = Dom_1.$$(this.element).find('.matrix-results-preview-container');
            preview.innerHTML += template;
            Dom_1.$$(preview).show();
        }
    };
    return Cell;
}());
exports.Cell = Cell;


/***/ }),

/***/ 629:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Template_1 = __webpack_require__(27);
var Dom_1 = __webpack_require__(1);
var Globalize = __webpack_require__(23);
var DefaultMatrixResultPreviewTemplate = /** @class */ (function (_super) {
    __extends(DefaultMatrixResultPreviewTemplate, _super);
    function DefaultMatrixResultPreviewTemplate(computedField, format) {
        var _this = _super.call(this) || this;
        _this.computedField = computedField;
        _this.format = format;
        return _this;
    }
    DefaultMatrixResultPreviewTemplate.prototype.instantiateToString = function (object, instantiateOptions) {
        var preview = "<div class='coveo-result-frame'>" +
            "<div class='coveo-result-row'>" +
            "<div class='coveo-result-cell' style='width: 40px; padding-right:5px;vertical-align: middle'>" +
            "<a class='CoveoIcon' data-small='true'></a>" +
            '</div>' +
            "<div class='coveo-result-cell' style='font-size:13px;vertical-align: middle'>" +
            "<a class='CoveoResultLink'></a>" +
            '</div>' +
            "<div class='coveo-result-cell' style='width:80px; text-align:right; font-size:13px; padding-right: 5px;vertical-align: middle'>" +
            Globalize.format(parseInt(object.raw[this.computedField.slice(1)]), this.format) +
            '</div>' +
            '</div>' +
            '</div>';
        return preview;
    };
    DefaultMatrixResultPreviewTemplate.prototype.instantiateToElement = function (object, instantiateOptions) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            return Dom_1.$$('div', undefined, _this.instantiateToString(object)).el;
        });
    };
    return DefaultMatrixResultPreviewTemplate;
}(Template_1.Template));
exports.DefaultMatrixResultPreviewTemplate = DefaultMatrixResultPreviewTemplate;


/***/ })

});
//# sourceMappingURL=Matrix__b6f3a40b26ad27101c27.js.map
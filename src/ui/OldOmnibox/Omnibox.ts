




module Coveo {

  export class Omnibox2 extends Querybox {
    static ID = 'Omnibox';
    static options: OmniboxOptions = {
      omniboxDelay: ComponentOptions.buildNumberOption({ defaultValue: 500, min: 0 }),
      omniboxTimeout: ComponentOptions.buildNumberOption({ defaultValue: 2000, min: 0 }),
      omniboxChangeLimit: ComponentOptions.buildNumberOption({ defaultValue: 3, min: 1 }),
      omniboxMinimumLetters: ComponentOptions.buildNumberOption({ defaultValue: 1, min: 1 })
    };

    static parent: ComponentClass = Querybox;

    private omniboxHeaderSearchForTemplate = _.template(
      "<div class='coveo-omnibox-selectable coveo-omnibox-section coveo-omnibox-header'>" +
      "<div class='coveo-text'>" + l("SearchFor", "<strong><%- data %></strong>") + "</div>" +
      "</div>");

    private omniboxIsOpen = false;
    private omniboxDiv: JQuery;
    private numberOfPendingQueries: number;
    private omniboxHeader: JQuery;
    private lastOmniboxRows: { zIndex: number; element: HTMLElement; }[];
    private lastOmniboxData: PopulateOmniboxEventArgs;
    private omniboxRows: { zIndex: number; element: HTMLElement; }[];
    private isCurrentlyBeingRendered: boolean;
    private isLoadingData: boolean = false;
    private throttledCallForOmniboxBody: Function;
    private lastNumberOfLettersInOmnibox: number;
    private headerIsCurrentlyRendered = false;
    private wasClosed: boolean;
    private handleBodyClick: (...args: any[]) => void;
    private resize: (...args: any[]) => void;

    constructor(public element: HTMLElement,
      public options: OmniboxOptions,
      bindings?: ComponentBindings) {
      super(element, options, bindings);

      this.options = ComponentOptions.initComponentOptions(element, Omnibox, options);

      $(element).keyup((event: KeyboardEvent) => this._handleKeyUp(event));

      this.renderOmniboxDiv();
      this.omniboxDiv.hide();
      this.prepareThrottledCall();

      this.handleBodyClick = (e) => {
        if (this.omniboxIsOpen && !$.contains(this.omniboxDiv.get(0), $(e.target).get(0))) {
          this.close();
        }
      };
      $("body").click(this.handleBodyClick);

      var eventName = this.queryStateModel.getEventName(Model.eventTypes.changeOne + QueryStateModel.attributesEnum.q);
      $(this.queryStateModel.element).on(eventName, $.proxy(this._handleQueryStateChanged, this));

      this.resize = (e) => {
        if (this.omniboxIsOpen && !$.contains(this.omniboxDiv.get(0), $(e.target).get(0))) {
          this.close();
        }
      };

      $(window).on("resize", this.resize);
      this.bind.onRoot(InitializationEvents.nuke, this.handleNuke);
    }

    public close() {
      this.wasClosed = true;
      this.clearLastOmniboxRows();

      $(this.root).trigger(OmniboxEvents.closeOmnibox);
      if (this.omniboxDiv) {
        this.omniboxDiv.children().remove();
        this.omniboxDiv.hide();
      }
      this.clearLastOmniboxRows();
      if (!Utils.isNullOrUndefined(this.lastOmniboxData)) {
        this.rejectAllPendingDeferred(this.lastOmniboxData)
      }
      this.resetOmniboxInternalData();
      this.omniboxIsOpen = false;
      this.removeSearchAnimation();
    }

    public open() {
      this.wasClosed = false;
      if ($(this.element).val() != "") {
        this.throttledCallForOmniboxBody();
        $(this.root).trigger(OmniboxEvents.openOmnibox);
      } else {
        this.close();
      }
    }

    private handleNuke() {
      $(window).off("resize", this.resize);
      $("body").off('click', this.handleBodyClick);
    }

    private getDataForOmniboxBody() {
      this.addSearchAnimation();
      if (!this.isCurrentlyBeingRendered) {
        var omniboxRequestObject = this.buildOmniboxRequestObject();
        var data = this.requestOmniboxData(omniboxRequestObject);
        this.processNewOmniboxData(data);
      } else {
        this.throttledCallForOmniboxBody();
      }
    }

    private buildOmniboxRequestObject() {
      var currentQueryExpression = this.getCurrentQueryExpression();
      var ret: PopulateOmniboxObject = {
        completeQueryExpression: {
          word: $(this.element).val(),
          regex: this.getRegexToSearch()
        },
        currentQueryExpression: {
          word: currentQueryExpression,
          regex: this.getRegexToSearch(currentQueryExpression)
        },
        allQueryExpressions: this.getQueryExpressionBreakDown(),
        cursorPosition: $(this.element).getCursorPosition(),
        clear: () => {
          this.clear()
        },
        clearCurrentExpression: () => {
          this.clearCurrentExpression()
        },
        replace: (searchValue: string, newValue: string) => {
          this.replace(searchValue, newValue)
        },
        replaceCurrentExpression: (newValue: string) => {
          this.replaceCurrentExpression(newValue)
        },
        insertAt: (at: number, toInsert: string) => {
          this.insertAt(at, toInsert)
        },
        closeOmnibox: () => {
          this.close();
        }
      }
      return ret;
    }

    private prepareThrottledCall() {
      this.throttledCallForOmniboxBody = Utils.throttle(this.getDataForOmniboxBody, this.options.omniboxDelay, undefined, this);
    }

    private requestOmniboxData(dataToSearch: PopulateOmniboxObject) {
      Assert.exists(dataToSearch);
      this.logger.info("Requesting omnibox data to all components");
      var eventArgs = <PopulateOmniboxEventArgs>$.extend({ rows: [] }, dataToSearch);
      $(this.root).trigger(OmniboxEvents.populateOmnibox, eventArgs);
      return eventArgs;
    }

    private getQueryExpressionBreakDown() {
      var ret = [];
      var queryWords = <string[]>$(this.element).val().split(" ");
      _.each(queryWords, (word) => {
        ret.push({
          word: word,
          regex: this.getRegexToSearch(word)
        })
      })
      return ret;
    }

    public _handleNewQuery(e: JQueryEventObject, data: INewQueryEventArgs) {
      super._handleNewQuery(e, data);
      if (this.omniboxIsOpen) {
        e.stopPropagation();
      }
    }

    public _handleKeyUp(event: KeyboardEvent) {
      //block keyup event on Querybox
      event.stopImmediatePropagation();
      var currentNumberOfLettersInOmnibox = $(this.element).val().length;
      if (!Utils.isNullOrUndefined(this.lastOmniboxData) && !Utils.isNullOrUndefined(this.lastNumberOfLettersInOmnibox) &&
        Math.abs(currentNumberOfLettersInOmnibox - this.lastNumberOfLettersInOmnibox) > this.options.omniboxChangeLimit) {
        this.rejectAllPendingDeferred(this.lastOmniboxData);
        this.prepareThrottledCall();
      }

      if (KeyboardUtils.keysEqual(event, KEYBOARD.ESCAPE) && this.omniboxIsOpen) {
        this.close();
      } else if (KeyboardUtils.keysEqual(event, KEYBOARD.ENTER)) {
        if (this.omniboxIsOpen) {
          this.selectionEvent();
        } else {
          this.close();
          this.triggerNewQuery(() => this.usageAnalytics.logSearchEvent<AnalyticsNoMeta>(AnalyticsActionCauseList.searchboxSubmit, {}));
        }
      } else if (KeyboardUtils.isArrowKeyPushed(event.keyCode) && this.omniboxIsOpen) {
        this.navigationEvent(event);
      } else if (KeyboardUtils.isAllowedKeyForOmnibox(event)) {
        if ($(this.element).val() == "") {
          this.close();
        } else {
          this.open();
        }
      }
    }

    public _handleChange(event: JQueryEventObject) {
      //block change event on Querybox
      event.stopImmediatePropagation();
      return false;
    }

    private handleHover(event: JQueryEventObject) {
      var target = this.getCorrectTarget(event);
      if (target) {
        this.toggleSelected(target);
      }
    }

    private bindHoverEvent() {
      $(this.omniboxDiv).find(".coveo-omnibox-selectable").hover((e) => {
        this.handleHover(e);
      })
    }

    private selectionEvent() {
      if (!this.isFirstValueSelected(this.findSelected())) {
        this.keyBoardSelection();
      } else {
        this.close();
        this.triggerNewQuery(() => this.usageAnalytics.logSearchEvent<AnalyticsNoMeta>(AnalyticsActionCauseList.searchboxSubmit, {}))
      }
    }

    private navigationEvent(event: KeyboardEvent) {
      var alreadySelected = this.findSelected();
      if (alreadySelected.length == 0) {
        this.navigationEventWhenNoSelection(event);
      } else {
        this.navigationEventWhenSelection(event, alreadySelected);
      }
    }

    private navigationEventWhenNoSelection(event: KeyboardEvent) {
      if (KeyboardUtils.keysEqual(event, KEYBOARD.DOWN_ARROW)) {
        this.findSelectable().first().addClass('coveo-omnibox-selected');
      } else {
        return;
      }
    }

    private navigationEventWhenSelection(event: KeyboardEvent, alreadySelected: JQuery) {
      if (!this.isLoadingData) {
        switch (event.keyCode) {
          case KEYBOARD.UP_ARROW:
            if (!this.isFirstValueSelected(alreadySelected)) {
              this.unselectValueInOmnibox(alreadySelected);
              this.selectValueBeforeAlreadySelected(alreadySelected);
            }
            break;
          case KEYBOARD.DOWN_ARROW:
            if (!this.isLastValueSelected(alreadySelected)) {
              this.unselectValueInOmnibox(alreadySelected);
              this.selectValueAfterAlreadySelected(alreadySelected);
            }
            break;
          default:
            break;
        }
      }
    }

    private keyBoardSelection() {
      this.logger.trace("Selecting facet value because of omnibox selection");
      var selectedInOmnibox = this.findSelected();
      selectedInOmnibox.trigger('keyboardSelect');
      this.close();
    }

    public triggerNewQuery(beforeExecuteQuery: () => void) {
      this.logger.info("Triggering new query because of omnibox selection");
      this.close();
      this.queryStateModel.set(QueryStateModel.attributesEnum.q, $(this.element).val());
      this.queryController.deferExecuteQuery({ beforeExecuteQuery: beforeExecuteQuery });
    }

    private processNewOmniboxData(data: PopulateOmniboxEventArgs) {

      this.logger.trace('Processing omnibox data');
      this.isCurrentlyBeingRendered = true;
      this.numberOfPendingQueries = 0;
      this.renderOmniboxBody(data);
      this.omniboxIsOpen = true;
    }

    private renderHeader() {
      this.buildHeader();
      this.setWidthOnOmniboxDiv();
      this.omniboxDiv.show();
      this.findSelectable().first().addClass('coveo-omnibox-selected')
      this.headerIsCurrentlyRendered = true;
    }

    private renderOmniboxDiv() {
      this.omniboxDiv = $("<div class='coveo-omnibox'></div>")
      $(this.element).after(this.omniboxDiv);
    }

    private setWidthOnOmniboxDiv() {
      this.omniboxDiv.width(this.getWidth())
    }

    private buildHeader() {
      if (this.omniboxHeader != undefined) {
        this.omniboxHeader.remove()
      }
      this.omniboxHeader = $(this.omniboxHeaderSearchForTemplate({ data: $(this.element).val() }))
      this.omniboxHeader.click(() => {
        this.triggerNewQuery(() => this.usageAnalytics.logSearchEvent<AnalyticsNoMeta>(AnalyticsActionCauseList.searchboxSubmit, {}));
      })
      this.omniboxDiv.prepend(this.omniboxHeader);
    }

    private renderOmniboxBody(data: PopulateOmniboxEventArgs) {
      if (!this.wasClosed) {
        this.omniboxRows = [];
        this.lastOmniboxData = data;
        this.lastNumberOfLettersInOmnibox = $(this.element).val().length;
        var atLeastOneRowCurrentlyExists = _.find(data.rows, (row: PopulateOmniboxEventRow) => {
          return !Utils.isNullOrUndefined(row.element);
        });

        _.each(data.rows, (row: PopulateOmniboxEventRow) => {
          if (!Utils.isNullOrUndefined(row.element)) {
            this.renderOmniboxForOneElement(row);
          } else if (!Utils.isNullOrUndefined(row.deferred)) {
            this.numberOfPendingQueries++;
            this.renderOmniboxForOneElementDeferred(row);
          }
        })
        if (this.numberOfPendingQueries == 0) {
          this.allDeferredHaveArrived();
        }
        setTimeout(() => {
          this.rejectAllPendingDeferred(data);
        }, this.options.omniboxTimeout)
      } else {
        this.close();
      }
    }

    private rejectAllPendingDeferred(data: PopulateOmniboxEventArgs) {
      _.each(data.rows, (row: PopulateOmniboxEventRow) => {
        if (!Utils.isNullOrUndefined(row.deferred)/* && row.deferred.state() == 'pending'*/) {
          row.deferred.reject();
        }
      })
    }

    private allDeferredHaveArrived() {
      this.appendOmniboxSections();
      this.resetOmniboxInternalData();
      this.removeSearchAnimation();
    }

    private clearLastOmniboxRows() {
      if (this.lastOmniboxRows != undefined) {
        _.each(this.lastOmniboxRows, (row) => {
          $(row.element).remove()
        })
      }
    }

    private appendOmniboxSections() {
      if (this.omniboxRows.length > 0 && $(this.element).val() != "") {
        this.renderHeader();
        this.clearLastOmniboxRows();
        this.omniboxRows = _.sortBy(this.omniboxRows, (row) => {
          return row.zIndex
        }).reverse()
        for (var i = 0; i < this.omniboxRows.length; i++) {
          this.omniboxDiv.append(this.omniboxRows[i].element)
        }
        this.bindHoverEvent();
        this.resetOmniboxInternalData();
      } else {
        this.close();
      }
    }

    private resetOmniboxInternalData() {
      this.lastOmniboxRows = this.omniboxRows;
      this.isCurrentlyBeingRendered = false;
      this.headerIsCurrentlyRendered = false;
    }

    private renderOmniboxForOneElement(row: OmniboxDataRow) {
      var zIndex = row.zIndex || -1;
      $(row.element).addClass('coveo-omnibox-section');
      this.omniboxRows.push({ zIndex: zIndex, element: row.element });
    }

    private renderOmniboxForOneElementDeferred(row: OmniboxDataRow) {
      row.deferred.done((resolved: OmniboxDataRow) => {

        if (!this.headerIsCurrentlyRendered && resolved.element != undefined) {
          this.renderHeader();
        }
        this.numberOfPendingQueries--;
        if (!Utils.isNullOrUndefined(resolved.element)) {
          this.renderOmniboxForOneElement(resolved)
        }
        if (this.numberOfPendingQueries == 0) {
          this.allDeferredHaveArrived();
        }
      })
      row.deferred.fail(() => {
        this.numberOfPendingQueries--;
        if (this.numberOfPendingQueries == 0) {
          this.allDeferredHaveArrived();
        }
      })
    }

    private isFirstValueSelected(selected: JQuery) {
      return selected.get(0) == this.findSelectable().first().get(0);
    }

    private isLastValueSelected(selected: JQuery) {
      return selected.get(0) == this.findSelectable().last().get(0);
    }

    private unselectValueInOmnibox(alreadySelected: JQuery) {
      alreadySelected.removeClass('coveo-omnibox-selected');
    }

    private selectValueBeforeAlreadySelected(alreadySelected: JQuery) {
      $(this.findSelectable().get(this.findPosOfAlreadySelected(alreadySelected) - 1)).addClass('coveo-omnibox-selected')
    }

    private selectValueAfterAlreadySelected(alreadySelected: JQuery) {
      $(this.findSelectable().get(this.findPosOfAlreadySelected(alreadySelected) + 1)).addClass('coveo-omnibox-selected')
    }

    private findPosOfAlreadySelected(alreadySelected: JQuery) {
      var alreadySelectedPos = -1;
      var allSelectable = this.findSelectable()
      _.find(allSelectable, (selectable) => {
        alreadySelectedPos++;
        return selectable == alreadySelected.get(0);
      });
      return alreadySelectedPos;
    }

    private findSelectable() {
      return this.omniboxDiv.find(".coveo-omnibox-selectable");
    }

    private findSelected() {
      return this.findSelectable().closest(".coveo-omnibox-selected")
    }

    private toggleSelected(newSelected: JQuery) {
      this.omniboxDiv.find(".coveo-omnibox-selected").removeClass('coveo-omnibox-selected')
      newSelected.addClass('coveo-omnibox-selected');
    }

    private getWidth() {
      var elem = $(this.element);
      return elem.outerWidth() + this.getSearchButtonWidth();
    }

    private getSearchButtonWidth() {
      var searchbox = $(this.element).closest("." + Component.computeCssClassNameForType(Searchbox.ID));
      if (searchbox.length != 0) {
        var searchboxComponent = <Searchbox>searchbox.coveo(Searchbox);
        if (searchboxComponent.searchButton && $(searchboxComponent.searchButton.element).css('position') != 'absolute') {
          return $(searchboxComponent.searchButton.element).outerWidth()
        }
      }
      return 0;
    }

    private getRegexToSearch(strValue: string = $(this.element).val()) {
      return new RegExp(Utils.escapeRegexCharacter(strValue), "i");
    }

    private getCorrectTarget(event: JQueryEventObject) {
      var target = $(event.target);
      return target.closest(".coveo-omnibox-selectable")
    }

    private addSearchAnimation() {
      this._hideClearElement();
      $(this.element).addClass('coveo-omnibox-loading');
      this.isLoadingData = true;
    }

    private removeSearchAnimation() {
      $(this.element).removeClass('coveo-omnibox-loading')
      this._addClearElement();
      this.isLoadingData = false;
    }
  }

  Coveo.CoveoJQuery.registerAutoCreateComponent(Omnibox);
}

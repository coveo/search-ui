



module Coveo {
  export interface OmniboxResultListOptions extends IResultListOptions {
    omniboxZIndex?: number;
    onSelect?: (result: IQueryResult, resultElement: JQuery, omniboxObject: IPopulateOmniboxEventArgs) => void;
    headerTitle?: string;
    queryOverride?: string;
  }

  export class OmniboxResultList extends ResultList {
    static ID = 'OmniboxResultList';
    static options: OmniboxResultListOptions = {
      omniboxZIndex: ComponentOptions.buildNumberOption({defaultValue: 51, min: 16}),
      headerTitle: ComponentOptions.buildStringOption(),
      queryOverride: ComponentOptions.buildStringOption()
    }

    private lastOmniboxRequest: { omniboxObject: IPopulateOmniboxEventArgs; deferred: JQueryDeferred<{ element: HTMLElement; zIndex?: number }> };
    private suggestionForOmnibox: SuggestionForOmnibox;

    constructor(public element: HTMLElement,
                public options?: OmniboxResultListOptions,
                public bindings?: IComponentBindings) {
      super(element, options, bindings, OmniboxResultList.ID);
      this.options = ComponentOptions.initComponentOptions(element, OmniboxResultList, options);
      this.setupOptions();

      this.bind.onRoot(OmniboxEvents.populateOmnibox, this.handlePopulateOmnibox);
      this.bind.onRoot(QueryEvents.buildingQuery, this.handleQueryOverride);
    }

    // TODO follow ResultList impl
    /*public buildResults(results: QueryResults) {
      if (this.lastOmniboxRequest) {
        var content = $("<div></div>");
        content.append(
            "<div class='coveo-omnibox-result-list-header'>\
              <span class='coveo-icon-omnibox-result-list'></span> \
              <span class='coveo-caption'>" + (this.options.headerTitle || l("SuggestedResults")) + "</span> \
        </div>");

        _.each(results.results, (result: QueryResult) => {
          var resultElement = this.buildResult(result);
          $(resultElement).addClass('coveo-omnibox-selectable').appendTo(content);
          $(resultElement).on("keyboardSelect", () => {
            this.options.onSelect.call(this, result, $(resultElement), this.lastOmniboxRequest.omniboxObject);
          });
          this._autoCreateComponentsInsideResult(resultElement, result);
          this.triggerNewResultDisplayed(result, resultElement);
        });
        this.lastOmniboxRequest.deferred.resolve({element: content.get(0), zIndex: this.options.omniboxZIndex});
      }
    }*/

    private setupOptions() {
      this.logger.info('Disabling infinite scroll for OmniboxResultList', this);
      this.options.enableInfiniteScroll = false;
      this.options.onSelect = this.options.onSelect || this.onRowSelection;
    }

    private handlePopulateOmnibox(e: JQueryEventObject, args: IPopulateOmniboxEventArgs) {
      var deferred = $.Deferred();
      args.rows.push({
        deferred: deferred
      });
      this.lastOmniboxRequest = {omniboxObject: args, deferred: deferred};
      this.queryController.executeQuery({
        beforeExecuteQuery: ()=> this.usageAnalytics.logSearchAsYouType<IAnalyticsNoMeta>(AnalyticsActionCauseList.searchboxSubmit, {}),
        searchAsYouType: true
      });
    }

    private handleQueryOverride(e: JQueryEventObject, args: IBuildingQueryEventArgs) {
      Assert.exists(args);
      if (Utils.isNonEmptyString(this.options.queryOverride)) {
        args.queryBuilder.constantExpression.add(this.options.queryOverride);
      }
    }

    private onRowSelection(result: IQueryResult, resultElement: JQuery, omniboxObject: IPopulateOmniboxEventArgs) {
      this.usageAnalytics.logClickEvent(AnalyticsActionCauseList.documentOpen, {author: result.raw.author}, result, this.root);
      window.location.href = result.clickUri;
    }
  }
  Initialization.registerAutoCreateComponent(OmniboxResultList);
}
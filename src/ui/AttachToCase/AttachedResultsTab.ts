/// <reference path="../../Base.ts" />

module Coveo {
  declare var attachToCaseEndpoint: AttachToCaseEndpoint;

  export class AttachedResultsTab extends Tab {

    static ID = 'AttachedResultsTab';

    private attachToCaseEndpoint: AttachToCaseEndpoint;

    constructor(public element: HTMLElement, public options?: ITabOptions, bindings?: IComponentBindings) {
      super(element, options, bindings);

      $(this.root).on(QueryEvents.buildingQuery, $.proxy(this.handleBuildingQueryForAttachedResults, this));

      if (typeof (attachToCaseEndpoint) != "undefined" && attachToCaseEndpoint != null) {
        this.setAttachToCaseEndpoint(attachToCaseEndpoint);
      }
    }

    public setAttachToCaseEndpoint(endpoint: AttachToCaseEndpoint) {
      if (endpoint != null) {
        this.attachToCaseEndpoint = endpoint;
      }
    }

    private handleBuildingQueryForAttachedResults(e: JQueryEventObject, data: IBuildingQueryEventArgs) {
      if (!this.disabled && this.isSelected()) {
        if (this.attachToCaseEndpoint != null && this.attachToCaseEndpoint.data.succeeded) {
          if (this.options.constant) {
            data.queryBuilder.constantExpression.add(this.getExpressions());
          } else {
            data.queryBuilder.advancedExpression.add(this.getExpressions());
          }
        }
      }
    }

    private getExpressions(): string {
      var builder = new ExpressionBuilder();
      var sfkbids = [];
      var sysurihashs = [];

      this.attachToCaseEndpoint.data.attachedResults.forEach(result => {
        result.indexOf("ka0") == 0 ? sfkbids.push(result) : sysurihashs.push(result);
      });

      if (sysurihashs.length > 0) {
        builder.addFieldExpression("@urihash", "=", sysurihashs);
      }

      if (sfkbids.length > 0) {
        builder.addFieldExpression("@sfkbid", "=", sfkbids);
      }
      
      // In case we don't have any attached results
      if (sfkbids.length + sysurihashs.length == 0) {
        builder.add("NOT @uri");
      }

      return builder.build(" OR ");
    }
  }

  Initialization.registerAutoCreateComponent(AttachedResultsTab);
}
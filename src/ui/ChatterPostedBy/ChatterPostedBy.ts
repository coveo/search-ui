/// <reference path="../../Base.ts" />
/// <reference path="../../utils/ChatterUtils.ts" />

module Coveo {
  export interface ChatterPostedByOption {
    enablePostedOn: boolean;
    useFromInstead: boolean;
    openInPrimaryTab: boolean;
    openInSubTab: boolean;
  }

  export class ChatterPostedBy extends Coveo.Component {
    static ID = 'ChatterPostedBy';
    static options: ChatterPostedByOption = {
      enablePostedOn: ComponentOptions.buildBooleanOption({ defaultValue: true }),
      useFromInstead: ComponentOptions.buildBooleanOption({ defaultValue: false }),
      openInPrimaryTab: ComponentOptions.buildBooleanOption({ defaultValue: false }),
      openInSubTab: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    };

    static fields = [
      'sfcreatedby', // ChatterPostedBy
      'sfcreatedbyid', // ChatterPostedBy
      'sffeeditemid', // ChatterPostedBy
      'sfuserid', // ChatterPostedBy
      'sfinsertedbyid', // ChatterPostedBy
      'sfparentid', // ChatterPostedBy
      'sfparentname' // ChatterPostedBy
    ]

    constructor(public element: HTMLElement,
      public options?: ChatterPostedByOption,
      public bindings?: IComponentBindings,
      public result?: IQueryResult) {
      super(element, ChatterPostedBy.ID, bindings);

      this.options = ComponentOptions.initComponentOptions(element, ChatterPostedBy, options);

      if (result.raw.sfcreatedby != null) {
        $('<span>').text((this.options.useFromInstead ? l("From") : l("PostedBy")) + " ").appendTo(element);
        this.renderLink(result.raw.sfcreatedby, result.raw.sfcreatedbyid).appendTo(element);

        if (this.options.enablePostedOn && !Utils.isNullOrUndefined(result.raw.sfparentname) && !Utils.isNullOrUndefined(result.raw.sfparentid)) {
          // Post on user's wall
          if (!Utils.isNullOrUndefined(result.raw.sfuserid) && result.raw.sfuserid != result.raw.sfinsertedbyid) {
            $('<span>').html(" " + l("OnFeed",
              this.renderLink(result.raw.sfparentname, result.raw.sfparentid).prop('outerHTML'))).appendTo(element);
          } else if (Utils.isNullOrUndefined(result.raw.sfuserid)) {
            $('<span>').text(" " + l("On").toLowerCase() + " ").appendTo(element);
            this.renderLink(result.raw.sfparentname, result.raw.sfparentid).appendTo(element);
          }
        }
      }
    }

    private renderLink(text: string, id: string): JQuery {
      var link = $('<a>').attr("href",
        ChatterUtils.buildURI(this.result.clickUri, this.result.raw.sffeeditemid, id))
        .text(text)

      return ChatterUtils.bindCLickEventToElement(link, this.options.openInPrimaryTab, this.options.openInSubTab);
    }
  }

  Coveo.Initialization.registerAutoCreateComponent(ChatterPostedBy);
}
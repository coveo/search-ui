





module Coveo {

  export interface SalesforceResultLinkOptions extends ResultLinkOptions {
    openInPrimaryTab: boolean;
    openInSubTab: boolean;
  }

  // This class is, as it's name implied, used only in the salesforce integration to handle
  // results link that can be opened in the console correctly.
  // When the page is created in salesforce (interface editor) all CoveoResultLink are replaced with CoveoSalesforceResultLink.
  export class SalesforceResultLink extends ResultLink {
    static ID = 'SalesforceResultLink';
    static options: SalesforceResultLinkOptions = _.extend({}, {
      openInPrimaryTab: ComponentOptions.buildBooleanOption({defaultValue: true}),
      openInSubTab: ComponentOptions.buildBooleanOption({defaultValue: false})
    }, ResultLink.options);

    constructor(public element: HTMLElement, public options?: SalesforceResultLinkOptions, bindings?: IResultsComponentBindings, public result?: IQueryResult) {
      super(element, ComponentOptions.initComponentOptions(element, SalesforceResultLink, options), bindings, result);
    }

    protected bindEventToOpen() {
      if (SalesforceUtilities.isInSalesforceConsole()) {
        var eventWasBinded = false;
        if (this.options.openInPrimaryTab) {
          $(this.element).click(()=> {
            SalesforceUtilities.focusOrOpenTab(decodeURIComponent(this.result.clickUri), this.result.title, true);
          });
          eventWasBinded = true;
        } else if (this.options.openInSubTab) {
          $(this.element).click(()=> {
            SalesforceUtilities.focusOrOpenTab(decodeURIComponent(this.result.clickUri), this.result.title, false);
          });
          eventWasBinded = true;
        }
        if (!eventWasBinded) {
          eventWasBinded = super.bindEventToOpen();
        }
        return eventWasBinded;
      } else {
        return super.bindEventToOpen();
      }
    }
  }
  Initialization.registerAutoCreateComponent(SalesforceResultLink);
}
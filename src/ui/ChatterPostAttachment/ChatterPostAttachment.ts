


module Coveo {
  export interface ChatterPostAttachmentOption {
  }

  export class ChatterPostAttachment extends Coveo.Component {
    static ID = 'ChatterPostAttachment';

    static fields = [
      'sfcontentversionid',
      'sffeeditemid',
      'sfcontentfilename'
    ]

    constructor(public element: HTMLElement,
      public options?: ChatterPostAttachmentOption,
      public bindings?: IComponentBindings,
      public result?: IQueryResult) {
      super(element, ChatterPostAttachment.ID, bindings);

      if (!Utils.isNullOrUndefined(result.raw.sfcontentversionid)) {
        var rootElement = $('<div>').addClass('coveo-chatter-result-box-row').appendTo(element);

        $('<div>').addClass('coveo-sprites-common-system')
          .addClass('coveo-chatter-result-box-icon')
          .appendTo(rootElement);

        var linkElement = $('<a>').attr('href', ChatterUtils.buildURI(result.clickUri, result.raw.sffeeditemid, result.raw.sfcontentversionid)).appendTo(rootElement);

        if (!Utils.isNullOrUndefined(result.raw.sfcontentfilename)) {
          linkElement.text(result.raw.sfcontentfilename);
        } else {
          linkElement.text(l("ShowAttachment"));
        }
      }
    }
  }

  Coveo.Initialization.registerAutoCreateComponent(ChatterPostAttachment);
}
/// <reference path="../../Base.ts" />
/// <reference path="../../utils/ChatterUtils.ts" />

module Coveo {
  export interface ChatterLikedByOption {
    nbLikesToRender: number;
    openInPrimaryTab: boolean;
    openInSubTab: boolean;
  }

  export class ChatterLikedBy extends Coveo.Component {
    static ID = 'ChatterLikedBy';
    static options: ChatterLikedByOption = {
      nbLikesToRender: ComponentOptions.buildNumberOption({ defaultValue: 2, min: 0 }),
      openInPrimaryTab: ComponentOptions.buildBooleanOption({ defaultValue: false }),
      openInSubTab: ComponentOptions.buildBooleanOption({ defaultValue: true })
    };

    static fields = [
      'sflikedby',
      'sflikedbyid',
      'clickableuri',
      'sffeeditemid'
    ]

    constructor(public element: HTMLElement,
      public options?: ChatterLikedByOption,
      public bindings?: IComponentBindings,
      public result?: IQueryResult) {
      super(element, ChatterLikedBy.ID, bindings);

      this.options = ComponentOptions.initComponentOptions(element, ChatterLikedBy, options);

      if (!Utils.isNullOrUndefined(result.raw.sflikedby) && !Utils.isNullOrUndefined(result.raw.sflikedbyid)) {
        var likeNames = result.raw.sflikedby.split(";");
        var likeIds = result.raw.sflikedbyid.split(";");

        var rootElement = $('<div>').addClass('coveo-chatter-result-box-row').appendTo(element);

        $('<div>').addClass('coveo-sprites-common-thumbup_inactive')
          .addClass('coveo-chatter-result-box-icon')
          .appendTo(rootElement);

        var fullListElement = $('<div>').addClass("coveo-chatter-result-likes").appendTo(rootElement);

        this.renderLikesList(fullListElement[0], result, likeNames, likeIds, this.options.nbLikesToRender);
      }
    }

    private renderLikesList(element: HTMLElement, result: IQueryResult, likeNames: string[], likeIds: string[], nbLikesToRender: number) {
      var tempElement = $('<div>');

      for (var i = 0; i < likeIds.length - 1 && (nbLikesToRender == 0 || i < nbLikesToRender); i++) {
        this.renderLikeLink(result, likeNames[i], likeIds[i]).appendTo(tempElement);

        if ((nbLikesToRender == 0 || i < nbLikesToRender - 1) && i < likeIds.length - 2) {
          $('<span>').text(', ').appendTo(tempElement);
        }
        else if (i < likeIds.length - 1) {
          $('<span>').text(' ' + l("And").toLowerCase() + ' ').appendTo(tempElement);
        }
      }

      if (nbLikesToRender == 0 || likeIds.length <= nbLikesToRender) {
        this.renderLikeLink(result, likeNames[likeIds.length - 1], likeIds[likeIds.length - 1]).appendTo(tempElement);
      } else {
        var othersCount = likeIds.length - nbLikesToRender;
        $('<a>').click((e) => {
          e.preventDefault();

          $(element).empty();
          this.renderLikesList(element, result, likeNames, likeIds, 0);
        }).text(' ' + l("Others", othersCount.toString(), othersCount)).appendTo(tempElement);
      }

      if (likeIds.length > 0) {
        var name = $('<span>').html(l("LikesThis", tempElement.html(), likeIds.length)).appendTo(element);
        ChatterUtils.bindCLickEventToElement(name.find("a"), this.options.openInPrimaryTab, this.options.openInSubTab);
      }
    }

    private renderLikeLink(result: IQueryResult, likeName: string, likeId: string) {
      return $('<a>').attr('href', ChatterUtils.buildURI(result.clickUri, result.raw.sffeeditemid, likeId)).text(likeName);
    }
  }

  Coveo.Initialization.registerAutoCreateComponent(ChatterLikedBy);
}

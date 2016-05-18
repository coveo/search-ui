


module Coveo {
  export interface ChatterTopicOption {
  }

  export class ChatterTopic extends Coveo.Component {
    static ID = 'ChatterTopic';

    static fields = [
      'coveochatterfeedtopics'
    ];

    constructor(public element: HTMLElement,
      public options?: ChatterTopicOption,
      public bindings?: IComponentBindings,
      public result?: IQueryResult) {
      super(element, ChatterTopic.ID, bindings);

      if (!Utils.isNullOrUndefined(result.raw.coveochatterfeedtopics)) {
        var rootElement = $('<div>').addClass('coveo-chatter-result-box-row');
        var topics = result.raw.coveochatterfeedtopics.split(";");

        $('<div>').addClass('coveo-sprites-common-tagging_tag')
          .addClass('coveo-chatter-result-box-icon')
          .appendTo(rootElement);

        for (var i = 0; i < topics.length; i++) {
          $('<span>').text(topics[i])
            .appendTo(rootElement);

          if (i < topics.length - 1)
            $('<span>').text(', ').appendTo(rootElement);
        }

        rootElement.appendTo(element);
      }

    }
  }

  Coveo.Initialization.registerAutoCreateComponent(ChatterTopic);
}

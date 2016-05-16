

module Coveo {
  export interface YouTubeThumbnailOptions {
    width: string;
    height: string;
    embed: boolean;
  }

  export class YouTubeThumbnail extends Component {
    static ID = 'YouTubeThumbnail';

    static options: YouTubeThumbnailOptions = {
      width: ComponentOptions.buildStringOption({ defaultValue: '200px' }),
      height: ComponentOptions.buildStringOption({defaultValue: '112px'}),
      embed: ComponentOptions.buildBooleanOption({ defaultValue: true })
    };

    static fields = [
      'ytthumbnailurl'
    ]

    private modalbox: ModalBox.ModalBox;

    constructor(public element: HTMLElement, public options?: YouTubeThumbnailOptions, public bindings?: IResultsComponentBindings, public result?: IQueryResult) {
      super(element, YouTubeThumbnail.ID, bindings);
      this.options = ComponentOptions.initComponentOptions(element, YouTubeThumbnail, options);
      var resultLink = $('<a class="' + Component.computeCssClassName(ResultLink) + '" />');

      var thumbnailDiv = $('<div />')
        .addClass('coveo-youtube-thumbnail-container')
        .appendTo(resultLink);

      $('<img />').css({
        'width': this.options.width,
        'height': this.options.height
      }).attr('src', result.raw['ytthumbnailurl'])
        .addClass('coveo-youtube-thumbnail-img')
        .appendTo(thumbnailDiv);

      $('<span></span>')
        .addClass('coveo-youtube-thumbnail-play-button')
        .appendTo(thumbnailDiv);


      $(this.element).append(resultLink);

      if (this.options.embed) {
        this.options = _.extend(this.options, {
          onClick: () => this.handleOnClick()
        })
      }

      var initOptions = this.searchInterface.options.originalOptionsObject;
      var resultComponentBindings: IResultsComponentBindings = _.extend({}, this.getBindings(), {
        resultElement: element
      })
      var initParameters: IInitializationParameters = {
        options: _.extend({}, { initOptions: { ResultLink: options } }, initOptions),
        bindings: resultComponentBindings,
        result: result
      }
      Initialization.automaticallyCreateComponentsInside(element, initParameters);

    }

    private handleOnClick() {
      // need to put iframe inside div : iframe with position absolute and left:0, right : 0 , bottom: 0 is not standard/supported
      var iframe = $('<iframe />'), div = $('<div></div>');
      iframe.attr({
        'src': 'https://www.youtube.com/embed/' + this.extractVideoId() + '?autoplay=1',
        'allowfullscreen': 'allowfullscreen',
        'webkitallowfullscreen': 'webkitallowfullscreen',
        'width': '100%',
        'height': '100%'
      });

      div.append(iframe);

      this.modalbox = ModalBox.open(div.get(0), {
        overlayClose: true,
        title: $$(JQueryUtils.getQuickviewHeader(this.result, { showDate: true, title: this.result.title }, this.bindings).get(0)).text(),
        className: 'coveo-quick-view coveo-youtube-player',
        validation: () => true,
        body: this.element.ownerDocument.body
      });

      $($$(this.modalbox.wrapper).find('.coveo-quickview-close-button')).click(() => {
        this.modalbox.close();
      })
    }

    private extractVideoId() {
      return this.result.clickUri.split('watch?v=')[1];
    }
  }
  Initialization.registerAutoCreateComponent(YouTubeThumbnail);
}



module Coveo {
  export enum RatingValues {Undefined, Lowest, Low, Average, Good, Best};

  export interface ResultRatingOptions {
  }

  export class ResultRating extends Coveo.Component  {
    static ID = 'ResultRating';


    constructor(public element: HTMLElement, public options?: ResultRatingOptions, public bindings?: IComponentBindings, public result?: IQueryResult) {
      super(element, ResultRating.ID, bindings);
      this.options = ComponentOptions.initComponentOptions(element, ResultRating, options);

      if (!Utils.isNullOrUndefined(result.rating)) {
        this.renderComponent(element, result.rating);
      }
    }

    private renderComponent(element: HTMLElement, rating: number) {
      for(var starNumber = 1; starNumber <= 5; starNumber++) {
        this.renderStars(element, starNumber <= rating, starNumber);
      }
    }

    private renderStars(element: HTMLElement, isChecked: boolean, value: number){
      var star = $(element).find('a[rating-value="' + value + '"]');

      if(star.length == 0) {
        star = $("<a>").appendTo(element);

        if(this.bindings.searchInterface.options.enableCollaborativeRating) {
          star.click((e) => {
            this.rateDocument(+$(e.currentTarget).attr("rating-value"));
          });

          star.mouseover((e) => {
            this.renderComponent(element, parseInt($(e.currentTarget).attr("rating-value"), 10));
          });

          star.mouseout(() => {
            this.renderComponent(element, this.result.rating);
          });
        }

        star.attr("rating-value", value);
      }

      var basePath: String = "";
      if(this.searchInterface.isNewDesign()) {
        basePath = "coveo-sprites-";
      } else {
        basePath = "coveo-sprites-common-";
      }
      star.toggleClass(basePath + "star_placeholder", !isChecked);
      star.toggleClass(basePath + "star_active", isChecked);
    }

    public rateDocument(rating: RatingValues) {
      var request: IRatingRequest = {
        rating: RatingValues[rating],
        uniqueId: this.result.uniqueId
      };

      this.queryController.getEndpoint().rateDocument(request)
          .then(() => {
            this.result.rating = rating;
            this.renderComponent(this.element, rating);
          })
          .catch(() => {
            this.logger.error("An error occurred while rating the document");
          });
    }
  }

  Coveo.Initialization.registerAutoCreateComponent(ResultRating);
}
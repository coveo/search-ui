/// <reference path="../../Base.ts" />
module Coveo {

  export class StandaloneResult {
    public element:HTMLElement;

    constructor(public searchInterface:SearchInterface, resultTemplate:Template, public result:IQueryResult) {
      this.element = resultTemplate.instantiateToElement(result);
      $(this.element).data("CoveoResult", result);
      Component.bindResultToElement(this.element, result);
    }

    private initialize() {
      var initOptions = this.searchInterface.options;
      var initParameters:IInitializationParameters = {
        options: initOptions,
        bindings: this.searchInterface.getBindings(),
        result: this.result
      }
      Initialization.automaticallyCreateComponentsInside(this.element, initParameters);
    }
  }
}
/// <reference path="../../Base.ts" />

module Coveo {
  export class DefaultQuickviewTemplate extends Template {

    constructor() {
      super();
    }

    instantiateToString(queryResult?: IQueryResult): string {
      return '<div class="coveo-quick-view-full-height"><div class="CoveoQuickviewDocument"></div></div>';
    }
  }
}
/// <reference path="../../Base.ts" />

module Coveo {
  function getCoveoAnalyticsClient(element: HTMLElement) {
    var analytics = getCoveoAnalytics(element);
    if (analytics) {
      return analytics.client;
    } else {
      return undefined;
    }
  }

  function getCoveoAnalytics(element: HTMLElement) {
    var analyticsElement = $(element).find("." + Component.computeCssClassName(Analytics));
    if (analyticsElement.length != 0) {
      return <Analytics>analyticsElement.coveo()
    } else {
      return undefined;
    }
  }
}

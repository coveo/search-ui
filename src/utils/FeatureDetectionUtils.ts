/// <reference path="../Base.ts" />
/**
* @nodoc
*/
module Coveo.FeatureDetectionUtils {
  export function supportSVG() {
    return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1")
  }
}
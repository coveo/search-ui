// Necessary because of https://github.com/Microsoft/TypeScript/issues/14062
// Introduced in typescript 2.2, should be fixed in 2.3
interface IDocument {
  implementation: {
    hasFeature: any;
  };
}

declare var document: IDocument;

export class FeatureDetectionUtils {
  static supportSVG() {
    return document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#BasicStructure', '1.1');
  }
}

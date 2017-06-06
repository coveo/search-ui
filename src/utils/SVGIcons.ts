import { $$, Dom } from './Dom';

declare var require: (svgPath: string) => string;

export class SVGIcons {
  public static search = require('svg/search');
  public static more = require('svg/more');
  public static facetLoading = require('svg/facet-loading');
  public static checkboxMoreValues = require('svg/checkbox-more-values');
  public static arrowUp = require('svg/arrow-up');
  public static arrowDown = require('svg/arrow-down');

  private static parser = new DOMParser();

  public static addClassToSVGInContainer(svgContainer: HTMLElement, classToAdd: string) {
    $$(svgContainer).find('svg').setAttribute('class', `${SVGIcons.getClass(svgContainer)} ${classToAdd}`);
  }

  public static removeClassFromSVGInContainer(svgContainer: HTMLElement, classToRemove: string) {
    $$(svgContainer).find('svg').setAttribute('class', SVGIcons.getClass(svgContainer).replace(classToRemove, ''));
  }

  public static parseSvg(svgToParse: string): SVGSVGElement {
    return <any>SVGIcons.parser.parseFromString(svgToParse, 'image/svg+xml').documentElement.cloneNode(true);
  }
  
  private static getClass(el: HTMLElement): string {
    return $$(el).getClass().join(' ');
  }
}

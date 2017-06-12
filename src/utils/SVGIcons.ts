import { $$, Dom } from './Dom';

declare var require: (svgPath: string) => string;

export class SVGIcons {
  public static search = require('svg/search');
  public static more = require('svg/more');
  public static facetLoading = require('svg/facet-loading');
  public static checkboxMoreValues = require('svg/checkbox-hook-exclusion-more');
  public static arrowUp = require('svg/arrow-up');
  public static arrowDown = require('svg/arrow-down');

  private static parser = new DOMParser();

  public static addClassToSVGInContainer(svgContainer: HTMLElement, classToAdd: string) {
    const svgElement = svgContainer.querySelector('svg');
    svgElement.setAttribute('class', `${this.getClass(svgElement)} ${classToAdd}`);
  }

  public static removeClassFromSVGInContainer(svgContainer: HTMLElement, classToRemove: string) {
    const svgElement = svgContainer.querySelector('svg');
    $$(svgContainer).find('svg').setAttribute('class', this.getClass(svgElement).replace(classToRemove, ''));
  }

  private static getClass(svgElement: SVGElement) {
    const className = svgElement.getAttribute('class');
    return className ? className : '';
  }
}

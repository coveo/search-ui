import { $$ } from './Dom';

export class SVGDom {

  public static addClassToSVGInContainer(svgContainer: HTMLElement, classToAdd: string) {
    const svgElement = svgContainer.querySelector('svg');
    svgElement.setAttribute('class', `${SVGDom.getClass(svgElement)} ${classToAdd}`);
  }

  public static removeClassFromSVGInContainer(svgContainer: HTMLElement, classToRemove: string) {
    const svgElement = svgContainer.querySelector('svg');
    svgElement.setAttribute('class', SVGDom.getClass(svgElement).replace(classToRemove, ''));
  }

  private static getClass(svgElement: SVGElement) {
    const className = svgElement.getAttribute('class');
    return className ? className : '';
  }
}

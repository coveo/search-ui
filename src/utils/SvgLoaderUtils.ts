import { $$, Dom } from './Dom';

export class SVGLoaderUtils {

  public static buildSVG(id: string, container: HTMLElement): Dom {
    let svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    
    let use = $$('use', { 'xlink:href': 'http://localhost:8080/doctype.svg#' + id });
    svg.appendChild(use.el);
    let placeholder = $$('span', { class: 'coveo-placeholder' });
    svg.appendChild(use.el);
    container.appendChild(svg);
    container.appendChild(placeholder.el);
    return $$(<any>svg);
  }
}

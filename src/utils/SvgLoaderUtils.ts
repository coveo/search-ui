import { $$, Dom } from './Dom';

export class SVGLoaderUtils {

  public static buildSVG(id: string, container: HTMLElement): Dom {
    let svg = $$('svg');
    let use = $$('use', { 'xlink:href': 'doctype.svg#' + id});
    let placeholder = $$('span', {class: 'coveo-placeholder'})
    svg.append(use.el);
    container.appendChild(svg.el);
    container.appendChild(placeholder.el);
    return svg;
  }
}
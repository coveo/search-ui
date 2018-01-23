import { ResponsiveFacetColumn } from './ResponsiveFacetColumn';
import { IResponsiveComponentOptions } from './ResponsiveComponentsManager';
import { Facet } from '../Facet/Facet';

export class ResponsiveFacets extends ResponsiveFacetColumn {
  public static init(root: HTMLElement, component, options: IResponsiveComponentOptions) {
    ResponsiveFacetColumn.init(ResponsiveFacets, root, component, options, Facet.ID);
  }
}

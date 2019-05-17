import { ResponsiveFacetColumn } from './ResponsiveFacetColumn';
import { IResponsiveComponentOptions } from './ResponsiveComponentsManager';
import { DynamicFacet } from '../DynamicFacet/DynamicFacet';

export class ResponsiveDynamicFacets extends ResponsiveFacetColumn {
  public static init(root: HTMLElement, component, options: IResponsiveComponentOptions) {
    ResponsiveFacetColumn.init(ResponsiveDynamicFacets, root, component, options, DynamicFacet.ID);
  }
}

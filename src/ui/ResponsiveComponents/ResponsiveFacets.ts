import {$$, Dom} from '../../utils/Dom';
import {ResponsiveComponent, ResponsiveComponentsManager} from './ResponsiveComponentsManager';

export class ResponsiveFacets implements ResponsiveComponent{
  
  public ID
  public coveoRoot: Dom;
  
  private facetsColumn: Dom;
  
  public static init(root: HTMLElement, ID: string) {
    if(!$$(root).find('.coveo-facet-column')) return;
    //ResponsiveComponentsManager.register(ResponsiveFacets, $$(root), ID);
  }
  
  constructor(root: Dom, ID: string) {
    this.ID = ID;
    this.coveoRoot = root;
    this.facetsColumn = $$(this.coveoRoot.find('.coveo-facet-column'));
    
  }
  
  public needSmallMode(): boolean {
    const ellipsisWidth: number = 15;
    const threshold: number = 0.40;
    _.each(this.facetsColumn.findAll('.CoveoFacet'), facetElement => {
      let facet = $$(facetElement);
      let facetValueCaption = facet.find('.coveo-facet-value-caption');
      if ((facetValueCaption.offsetWidth - ellipsisWidth) / facetValueCaption.scrollWidth < threshold) {
        return true;
      }
    });
    return false;
  }
  
  public changeToSmallMode() {
    
  }
  
  public changeToLargeMode() {
    
  }
  
  
}

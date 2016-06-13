import {$$, Dom} from '../../utils/Dom';
import {ResponsiveComponent, ResponsiveComponentsManager} from './ResponsiveComponentsManager';
import "../../../sass/_ResponsiveFacets.scss";

export class ResponsiveFacets implements ResponsiveComponent{
 
  private static ROOT_MIN_WIDTH = 800;
  
  public ID: string;
  public coveoRoot: Dom;
  
  private facetsColumn: Dom;
  private previousSibling: Dom;
  private parent: Dom;
  private dropdownHeader: Dom;
  
  public static init(root: HTMLElement, ID: string) {
    if(!$$(root).find('.coveo-facet-column')) return;
    ResponsiveComponentsManager.register(ResponsiveFacets, $$(root), ID);
  }
  
  constructor(root: Dom, ID: string) {
    this.dropdownHeader = this.buildDropdownHeader();
    this.ID = ID;
    this.coveoRoot = root;
    this.facetsColumn = $$(this.coveoRoot.find('.coveo-facet-column'));
    this.savePosition();
  }
  
  public needSmallMode(): boolean {
    return this.coveoRoot.width() <= ResponsiveFacets.ROOT_MIN_WIDTH;
  }
  
  public changeToSmallMode() {
    let tabSection = this.coveoRoot.find('.coveo-tab-section');
    tabSection.appendChild(this.dropdownHeader.el);
  }
  
  public changeToLargeMode() {
    this.dropdownHeader.detach();
  }
  
  private buildDropdownHeader() {
    let dropdownHeader = $$('div', {className: 'coveo-facet-dropdown-header-container coveo-dropdown-header'});
    dropdownHeader.text('test');
    return dropdownHeader;
  }

  private savePosition() {
    this.previousSibling = this.facetsColumn.el.previousSibling ? $$(<HTMLElement>this.facetsColumn.el.previousSibling) : null;
    this.parent = $$(this.facetsColumn.el.parentElement);
  }
}

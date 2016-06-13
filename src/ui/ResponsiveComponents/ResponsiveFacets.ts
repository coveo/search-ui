import {$$, Dom} from '../../utils/Dom';
import {IResponsiveComponent, ResponsiveComponentsManager} from './ResponsiveComponentsManager';
import {Logger} from '../../misc/Logger';
import "../../../sass/_ResponsiveFacets.scss";
import {l} from '../../strings/Strings.ts';

export class ResponsiveFacets implements IResponsiveComponent {

  private static ROOT_MIN_WIDTH = 800;
  private static FACETS_NOT_FOUND = 'Could not find element with class coveo-facet-column. Therefore, responsive facets cannot be enabled.';
  private static logger: Logger;

  public ID: string;
  public coveoRoot: Dom;

  private facetsColumn: Dom;
  private previousSibling: Dom;
  private parent: Dom;
  private dropdownHeader: Dom;

  public static init(root: HTMLElement, ID: string) {
    this.logger = new Logger(root);
    if (!$$(root).find('.coveo-facet-column')) {
      this.logger.info(this.FACETS_NOT_FOUND);
      return;
    }
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
    let dropdownHeader = $$('div', { className: 'coveo-facet-dropdown-header-container coveo-dropdown-header' });
    dropdownHeader.text(l('Facets'));
    return dropdownHeader;
  }

  private savePosition() {
    this.previousSibling = this.facetsColumn.el.previousSibling ? $$(<HTMLElement>this.facetsColumn.el.previousSibling) : null;
    this.parent = $$(this.facetsColumn.el.parentElement);
  }
}

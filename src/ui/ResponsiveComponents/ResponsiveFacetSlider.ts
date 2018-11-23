import { ResponsiveFacetColumn } from './ResponsiveFacetColumn';
import { IResponsiveComponentOptions } from './ResponsiveComponentsManager';
import { FacetSlider } from '../FacetSlider/FacetSlider';
import { Dom } from '../../utils/Dom';
import { ResponsiveDropdown } from './ResponsiveDropdown/ResponsiveDropdown';
import { Component } from '../Base/Component';
import * as _ from 'underscore';

export class ResponsiveFacetSlider extends ResponsiveFacetColumn {
  private facetSliders: FacetSlider[] = [];

  public static init(root: HTMLElement, component, options: IResponsiveComponentOptions) {
    ResponsiveFacetColumn.init(ResponsiveFacetSlider, root, component, options, FacetSlider.ID);
  }

  constructor(public coveoRoot: Dom, public ID: string, options: IResponsiveComponentOptions, responsiveDropdown?: ResponsiveDropdown) {
    super(coveoRoot, ID, options, responsiveDropdown);
    this.registerOnOpenHandler();
  }

  public registerComponent(accept: Component) {
    super.registerComponent(accept);
    if (accept instanceof FacetSlider) {
      this.facetSliders.push(accept);
      return true;
    }
    return false;
  }

  private registerOnOpenHandler() {
    this.dropdown.registerOnOpenHandler(this.drawFacetSliderGraphs, this);
  }

  public drawFacetSliderGraphs() {
    _.each(this.facetSliders, facetSlider => facetSlider.drawDelayedGraphData());
  }
}

import { ComponentOptions } from '../Base/ComponentOptions';

/**
 * ResponsiveFacets options
 */
export const ResponsiveFacetOptions = {
  /**
   * Specifies whether to enable *responsive mode* for facets. Setting this options to `false` on any `Facet`, or
   * [`FacetSlider`]{@link FacetSlider} component in a search interface disables responsive mode for all other facets
   * in the search interface.
   *
   * Responsive mode displays all facets under a single dropdown button whenever the width of the HTML element which
   * the search interface is bound to reaches or falls behind a certain threshold (see
   * {@link SearchInterface.responsiveComponents}).
   *
   * See also the [`dropdownHeaderLabel`]{@link Facet.options.dropdownHeaderLabel} option.
   *
   * Default value is `true`.
   */
  enableResponsiveMode: ComponentOptions.buildBooleanOption({ defaultValue: true, section: 'ResponsiveOptions' }),
  responsiveBreakpoint: ComponentOptions.buildNumberOption({
    deprecated:
      'This option is exposed for legacy reasons. It is not recommended to use this option. Instead, use `SearchInterface.options.responsiveMediumBreakpoint` options exposed on the `SearchInterface`.'
  }),
  /**
   * If the [`enableResponsiveMode`]{@link Facet.options.enableResponsiveMode} option is `true` for all facets and
   * {@link FacetSlider.options.enableResponsiveMode} is also `true` for all sliders, specifies the label of the
   * dropdown button that allows to display the facets when in responsive mode.
   *
   * If more than one `Facet` or {@link FacetSlider} component in the search interface specifies a value for this
   * option, the framework uses the first occurrence of the option.
   *
   * Default value is `Filters`.
   */
  dropdownHeaderLabel: ComponentOptions.buildLocalizedStringOption({ section: 'ResponsiveOptions' })
};

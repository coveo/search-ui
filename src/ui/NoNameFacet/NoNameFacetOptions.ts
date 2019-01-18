import { IResponsiveComponentOptions } from '../ResponsiveComponents/ResponsiveComponentsManager';
import { ComponentOptions } from '../Base/ComponentOptions';
import { l } from '../../strings/Strings';

export interface INoNameFacetOptions extends IResponsiveComponentOptions {
  title?: string;
  useAnd?: boolean;
  enableTogglingOperator?: boolean;
}

export const NoNameFacetOptions = {
  /**
   * Specifies the title to display at the top of the facet.
   *
   * Default value is the localized string for `NoTitle`.
   */
  title: ComponentOptions.buildLocalizedStringOption({
    defaultValue: l('NoTitle'),
    section: 'CommonOptions',
    priority: 10
  }),
  /**
   * Specifies whether to use the `AND` operator in the resulting filter when multiple values are selected in the
   * facet.
   *
   * Setting this option to `true` means that items must have all of the selected values to match the resulting
   * query.
   *
   * Default value is `false`, which means that the filter uses the `OR` operator. Thus, by default, items must
   * have at least one of the selected values to match the query.
   */
  useAnd: ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'Filtering' }),
  /**
   * Specifies whether to allow the user to toggle between the `OR` and `AND` modes in the facet.
   *
   * Setting this option to `true` displays an icon in the top right corner of the facet. The user can click this icon
   * to toggle between between the two modes.
   *
   * Default value is `false`.
   */
  enableTogglingOperator: ComponentOptions.buildBooleanOption({
    defaultValue: false,
    alias: 'allowTogglingOperator',
    section: 'Filtering'
  })
};

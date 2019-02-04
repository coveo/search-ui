import { IResponsiveComponentOptions } from '../ResponsiveComponents/ResponsiveComponentsManager';
import { ComponentOptions } from '../Base/ComponentOptions';
import { l } from '../../strings/Strings';

export interface INoNameFacetOptions extends IResponsiveComponentOptions {
  title?: string;
  useAnd?: boolean;
  enableCollapse?: boolean;
  isCollapsed?: boolean;
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
   * Specifies whether to allow the user to toggle between the **Collapse** and **Expand** modes in the facet.
   * Default value is `false`.
   */
  enableCollapse: ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'Filtering' }),
  /**
   * Specifies whether to allow the facet should be in the **Collapse** mode.
   * Default value is `false`.
   */
  isCollapsed: ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'Filtering' })
};

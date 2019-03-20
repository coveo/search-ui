import { IResponsiveComponentOptions } from '../ResponsiveComponents/ResponsiveComponentsManager';
import { ComponentOptions, IFieldOption } from '../Base/ComponentOptions';
import { l } from '../../strings/Strings';
import { IStringMap } from '../../rest/GenericParam';
import { isFacetSortCriteria } from '../../rest/Facet/FacetSortCriteria';

export interface IMLFacetOptions extends IResponsiveComponentOptions {
  id?: string;
  title?: string;
  field?: IFieldOption;
  sortCriteria?: string;
  numberOfValues?: number;
  enableCollapse?: boolean;
  collapsedByDefault?: boolean;
  valueCaption?: any;
}

export const MLFacetOptions = {
  /**
   * A unique identifier for the facet. Among other things, this identifier serves the purpose of saving
   * the facet state in the URL hash.
   *
   * If you have two facets with the same field on the same page, you should specify an `id` value for at least one of
   * those two facets. This `id` must be unique among the facets.
   *
   * Default value is the [`field`]{@link MLFacet.options.field} option value.
   */
  id: ComponentOptions.buildStringOption({
    postProcessing: (value, options: IMLFacetOptions) => value || (options.field as string)
  }),
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
   * Specifies the index field whose values the facet should use.
   *
   * This requires the given field to be configured correctly in the index as a *Facet field* (see
   * [Adding Fields to a Source](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=137)).
   *
   * Specifying a value for this option is required for the `MLFacet` component to work.
   */
  field: ComponentOptions.buildFieldOption({ required: true, section: 'CommonOptions' }),
  /**
   * Specifies the criteria to use to sort the facet values.
   *
   * See {@link FacetSortCriteria} for the list and description of possible values.
   *
   * Default value is `undefined`
   * In that case, the Search API will use the Coveo Machine Learning sorting along with Coveo's UX principles.
   */
  sortCriteria: ComponentOptions.buildStringOption({
    postProcessing: value => (isFacetSortCriteria(value) ? value : undefined),
    section: 'Sorting'
  }),
  /**
   * Specifies the maximum number of field values to display by default in the facet before the user
   * clicks to show more.
   *
   * Default value is `undefined`
   * In that case, the Search API will define the number of field values which follows Coveo's UX principles.
   * Minimum value is `0`.
   */
  numberOfValues: ComponentOptions.buildNumberOption({ min: 0, section: 'CommonOptions' }),
  /**
   * Specifies whether to allow the user to toggle between the **Collapse** and **Expand** modes in the facet.
   * Default value is `false`.
   */
  enableCollapse: ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'Filtering' }),
  /**
   * Specifies whether to allow the facet should be in the **Collapse** mode.
   *
   * See also the [`enableCollapse`]{@link MLFacet.options.enableCollapse}
   *
   * Default value is `false`.
   */
  collapsedByDefault: ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'Filtering' }),
  /**
   * Specifies a JSON object describing a mapping of facet values to their desired captions. See
   * [Normalizing Facet Value Captions](https://developers.coveo.com/x/jBsvAg).
   *
   * **Examples:**
   *
   * You can set the option in the ['init']{@link init} call:
   * ```javascript
   * var myValueCaptions = {
   *   "txt" : "Text files",
   *   "html" : "Web page",
   *   [ ... ]
   * };
   *
   * Coveo.init(document.querySelector("#search"), {
   *   MLFacet : {
   *     valueCaption : myValueCaptions
   *   }
   * });
   * ```
   *
   * Or before the `init` call, using the ['options']{@link options} top-level function:
   * ```javascript
   * Coveo.options(document.querySelector("#search"), {
   *   MLFacet : {
   *     valueCaption : myValueCaptions
   *   }
   * });
   * ```
   *
   * Or directly in the markup:
   * ```html
   * <!-- Ensure that the double quotes are properly handled in data-value-caption. -->
   * <div class='CoveoMLFacet' data-field='@myotherfield' data-value-caption='{"txt":"Text files","html":"Web page"}'></div>
   * ```
   *
   */
  valueCaption: ComponentOptions.buildJsonOption<IStringMap<string>>()
};

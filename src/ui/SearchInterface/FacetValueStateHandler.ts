import { QueryStateModel } from '../../models/QueryStateModel';
import { Component } from '../Base/Component';
import { BaseComponent } from '../Base/BaseComponent';

export class FacetValueStateHandler {
  constructor(private componentsFetcher: (componentId: string) => Component[]) {}

  public handleFacetValueState(stateToSet: { [key: string]: any }): void {
    const facetRef = BaseComponent.getComponentRef('Facet');
    const fvState = stateToSet.fv;
    const fvFieldsIds = Object.keys(fvState);
    let fieldsWithoutFacets = [];
    if (facetRef) {
      const allFacets: Component[] = this.componentsFetcher(facetRef.ID);
      fieldsWithoutFacets = fvFieldsIds.filter(facetField => {
        // Try to find a facet matching the `fv:` field state.
        const value = fvState[facetField];
        if (value && value.length > 0) {
          const facetsWithField = allFacets.filter(facet => facet.options.field == facetField);
          if (facetsWithField.length > 0) {
            // We found a facet, remove the `fv:` and replace it with `f:`.
            delete fvState[facetField];
            facetsWithField.forEach(facet => (stateToSet[QueryStateModel.getFacetId(facet.options.id)] = value));
            return false;
          }
        }
        return true;
      });
    } else {
      fieldsWithoutFacets = fvFieldsIds;
    }

    // For the remaining field, we need to transform them in hidden queries.
    // This ensure that an `fv:` state is always transformed into the filter it is supposed to apply.
    if (fieldsWithoutFacets.length > 0) {
      const valuesTransformedToHiddenQuery = fieldsWithoutFacets
        .map(facetField => {
          const value = fvState[facetField];
          if (value && value.length > 0) {
            delete fvState[facetField];
            return `${facetField}=="${value}"`;
          }
        })
        .filter(expression => !!expression);
      if (valuesTransformedToHiddenQuery.length > 0) {
        stateToSet[QueryStateModel.attributesEnum.hq] = valuesTransformedToHiddenQuery.join(' AND ');
      }
    }
  }
}

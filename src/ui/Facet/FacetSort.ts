/// <reference path="Facet.ts" />
/// <reference path="FacetSettings.ts" />
import {Facet} from './Facet';
import {l} from '../../strings/Strings';
import {FacetSettings} from './FacetSettings';
import {Utils} from '../../utils/Utils';
import {FacetValue} from './FacetValues';
import {StringUtils} from '../../utils/StringUtils';

declare const Coveo;

export interface IFacetSortKlass {
  new (sorts: string[], facet: Facet): FacetSort;
}

export interface IFacetSortDescription {
  label: string;
  directionToggle: boolean;
  description: string;
  name: string;
  relatedSort?: string;
}

export class FacetSort {
  public static availableSorts: { [name: string]: IFacetSortDescription } = {
    score: {
      label: l('Score'),
      directionToggle: false,
      description: l('ScoreDescription'),
      name: 'score'
    },
    occurrences: {
      label: l('Occurrences'),
      directionToggle: false,
      description: l('OccurrencesDescription'),
      name: 'occurrences'
    },
    alphaascending: {
      label: l('Label'),
      directionToggle: true,
      description: l('LabelDescription'),
      name: 'alphaascending',
      relatedSort: 'alphadescending'
    },
    alphadescending: {
      label: l('Label'),
      directionToggle: true,
      description: l('LabelDescription'),
      name: 'alphadescending',
      relatedSort: 'alphaascending'
    },
    computedfieldascending: {
      label: l('Value'),
      directionToggle: true,
      description: l('ValueDescription'),
      name: 'computedfieldascending',
      relatedSort: 'computedfielddescending'
    },
    computedfielddescending: {
      label: l('Value'),
      directionToggle: true,
      description: l('ValueDescription'),
      name: 'computedfielddescending',
      relatedSort: 'computedfieldascending'
    },
    chisquare: {
      label: l('RelativeFrequency'),
      directionToggle: false,
      description: l('RelativeFrequencyDescription'),
      name: 'chisquare'
    },
    custom: {
      label: l('Custom'),
      directionToggle: true,
      description: l('CustomDescription'),
      name: 'custom',
      relatedSort: 'custom'
    }
  }

  public enabledSorts: IFacetSortDescription[] = [];
  public activeSort: IFacetSortDescription;
  public customSortDirection = 'ascending';

  constructor(sorts: string[], public facet: Facet) {
    _.each(sorts, (sortToActivate) => {
      var newSortToEnable = FacetSettings.availableSorts[sortToActivate.toLowerCase()];
      if (newSortToEnable != undefined) {
        this.enabledSorts.push(newSortToEnable);
      }
    })
    this.removeEnabledSortsBasedOnFacetType();
    if (Utils.isNonEmptyArray(this.enabledSorts)) {
      if (this.facet.options.sortCriteria != undefined) {
        this.activeSort = _.find<IFacetSortDescription>(this.enabledSorts, (enabledSort) => {
          return enabledSort.name == this.facet.options.sortCriteria
        })
      }
      if (!this.activeSort) {
        this.activeSort = this.enabledSorts[0];
      }
    }
  }

  private removeEnabledSortsBasedOnFacetType() {
    if (Coveo.FacetRange && this.facet instanceof Coveo.FacetRange) {
      var facetRange = this.facet;
      if (facetRange.options['slider']) {
        this.enabledSorts = [];
      }
    }
  }

  public reorderValues(facetValues: FacetValue[]): FacetValue[] {
    if (this.activeSort.name == 'custom' && this.facet.options.customSort != undefined) {
      return this.reorderValuesWithCustomOrder(facetValues);
    } else {
      return facetValues
    }
  }

  private reorderValuesWithCustomOrder(facetValues: FacetValue[]) {
    var notFoundIndex = facetValues.length;
    var customSortsLowercase = _.map(this.facet.options.customSort, (customSort) => customSort.toLowerCase());
    var valueIndexPair = _.map(facetValues, (facetValue) => {
      var index = _.reduce(customSortsLowercase, (memo, customSort, i) => {
        if (memo != -1) {
          return memo;
        }
        if (StringUtils.equalsCaseInsensitive(<string>customSort, facetValue.value) || (facetValue.lookupValue != null && StringUtils.equalsCaseInsensitive(<string>customSort, facetValue.lookupValue))) {
          return i;
        }
        return -1;
      }, -1);
      index = index == -1 ? ++notFoundIndex : index;
      return { facetValue: facetValue, index: index };
    })
    var sorted = _.sortBy(valueIndexPair, 'index');
    sorted = this.customSortDirection == 'ascending' ? sorted : sorted.reverse();
    return _.pluck(sorted, 'facetValue');
  }
}

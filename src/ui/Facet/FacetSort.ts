/// <reference path="Facet.ts" />
/// <reference path="FacetSettings.ts" />
import { Facet } from './Facet';
import { l } from '../../strings/Strings';
import { FacetSettings } from './FacetSettings';
import { Utils } from '../../utils/Utils';
import * as _ from 'underscore';

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
    nosort: {
      label: l('Nosort'),
      directionToggle: false,
      description: l('NosortDescription'),
      name: 'nosort'
    },
    custom: {
      label: l('Custom'),
      directionToggle: true,
      description: l('CustomDescription'),
      name: 'custom',
      relatedSort: 'custom'
    }
  };

  public enabledSorts: IFacetSortDescription[] = [];
  public activeSort: IFacetSortDescription;
  public customSortDirection = 'ascending';

  constructor(sorts: string[], public facet: Facet) {
    _.each(sorts, sortToActivate => {
      var newSortToEnable = FacetSettings.availableSorts[sortToActivate.toLowerCase()];
      if (newSortToEnable != undefined) {
        this.enabledSorts.push(newSortToEnable);
      }
    });
    this.removeEnabledSortsBasedOnFacetType();
    if (Utils.isNonEmptyArray(this.enabledSorts)) {
      if (this.facet.options.sortCriteria != undefined) {
        this.activeSort = _.find<IFacetSortDescription>(this.enabledSorts, enabledSort => {
          return enabledSort.name == this.facet.options.sortCriteria;
        });
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
}

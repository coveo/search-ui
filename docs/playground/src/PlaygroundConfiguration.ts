import {IStringMap} from "../../../src/rest/GenericParam";
import {$$, Dom} from "../../../src/utils/Dom";
import {SearchEndpoint} from "../../../src/rest/SearchEndpoint";

export interface IComponentPlaygroundConfiguration {
  show: boolean; // should we show a preview for this component. False is assumed if not specified.
  isResultComponent?: boolean; // is this component supposed to be inserted inside a result template ? False is assumed if not specified
  options?: any; // The options to specify for this component.
  basicExpression?: string; // A basic expression that should be executed for the preview of this component. If not provided, a blank query will be used.
  advancedExpression?: string; // The advanced expression that should be executed for the preview of this component. If not provided, a blank query will be used.
  element?: Dom; // The Dom that should be generated for this component. If not provided, a generic one will be generated.
  toExecute?: Function;
}

declare var Coveo;

export const PlaygroundConfiguration: IStringMap<IComponentPlaygroundConfiguration> = {
  SearchInterface: {
    show: false,
    options: {
      autoTriggerQuery: false
    }
  },
  Facet: {
    show: true,
    options: {
      field: '@objecttype',
      title: 'Type'
    }
  },
  Searchbox: {
    show: true,
    options: {
      enableOmnibox: true,
      enableRevealQuerySuggestAddon: true,
      inline: true
    }
  },
  SearchButton: {
    show: true
  },
  Omnibox: {
    show: true,
    options: {
      enableQuerySuggestAddon: true,
      inline: true
    }
  },
  Excerpt: {
    show: true,
    isResultComponent: true,
    basicExpression: 'technology'
  },
  Icon: {
    show: true,
    isResultComponent: true,
    basicExpression: 'getting started pdf'
  },
  Tab: {
    show: true,
    element: $$('div', {className: 'coveo-tab-section'}, `<div class="CoveoTab" data-caption="All content" data-id="All"></div><div class="CoveoTab" data-caption="YouTube videos" data-id="YouTube"></div><div class="CoveoTab" data-caption="Google Drive" data-id="GoogleDrive"></div><div class="CoveoTab" data-caption="Emails" data-id="Emails"></div><div class="CoveoTab" data-caption="Salesforce content" data-id="Salesforce"></div>`)
  },
  FacetSlider: {
    show: true,
    options: {
      field: '@date',
      dateField: true,
      queryOverride: '@date>2010/01/01',
      graph: {
        steps: 20
      },
      rangeSlider: true,
      title: 'Date distribution'
    }
  },
  Badge: {
    show: true,
    options: {
      field: '@author'
    },
    isResultComponent: true,
    advancedExpression: '@author=="BBC News"'
  },
  Breadcrumb: {
    show: true,
    element: $$('div', undefined, `<div class="CoveoBreadcrumb"></div><p>Interact with the facet to modify the breadcrumb</p><div class="CoveoFacet" data-field="@objecttype" data-title="Type"></div>`)
  },
  DidYouMean: {
    show: true,
    basicExpression: 'testt',
    element: $$('div', undefined, `<div class="CoveoDidYouMean"></div><div class='CoveoSearchbox'></div>`)
  },
  ErrorReport: {
    show: true,
    toExecute: ()=> {
      Coveo['SearchEndpoint'].endpoints['default'].options.accessToken = 'invalid';
    }
  },
  ExportToExcel: {
    show: true,
    element: $$('div', undefined, `<div class="CoveoSettings"></div><div class="CoveoSearchbox"></div><div class="CoveoExportToExcel"></div>`),
    toExecute: ()=> {
      $$(document.body).find('.CoveoSearchInterface').style.minHeight = '300px';
    }
  },
  FacetRange: {
    show: true,
    options: {
      field: '@size',
      title: 'Documents size',
      ranges: [{
        start: 0,
        end: 100,
        label: "0 - 100 KB",
        endInclusive: false
      }, {
        start: 100,
        end: 200,
        label: "100 - 200 KB",
        endInclusive: false
      }, {
        start: 200,
        end: 300,
        label: "200 - 300 KB",
        endInclusive: false
      },
        {
          start: 300,
          end: 400,
          label: "300 - 400 KB",
          endInclusive: false
        }
      ],
      sortCriteria: 'alphaascending'
    }
  },
  FieldSuggestions: {
    options: {
      field: '@author'
    },
    show: true,
    element: $$('div', undefined, `<div class='preview-info'>Showing suggestions on the field <span class='preview-info-emphasis'>@author</span></div><div class="CoveoSearchbox" data-enable-omnibox="true"></div><div class="CoveoFieldSuggestions"></div>`),
    toExecute: ()=> {
      $$(document.body).find('.CoveoSearchInterface').style.minHeight = '500px';
    }
  },
  FieldTable: {
    show: true,
    options: {
      minimizedByDefault: false
    },
    isResultComponent: true,
    advancedExpression: '@source=="Dropbox - coveodocumentationsamples@gmail.com"',
    element: $$('div', undefined,
        `<table class="CoveoFieldTable">
            <tbody>
             <tr data-field="@size" data-caption="Document size" data-helper="size">
              </tr>
              <tr data-field="@source" data-caption="Source">
              </tr>
              <tr data-field="@date" data-caption="Date" date-helper="dateTime"></tr>
            </tbody>
          </table>`)
  },
  FieldValue: {
    show: true,
    options: {
      field: '@date',
      helper: 'dateTime'
    },
    isResultComponent: true,
    advancedExpression: '@date'
  },
  FollowItem: {
    show: true,
    isResultComponent: true,
    element: $$('div', undefined, `<div class="CoveoSearchAlerts"></div><a class="CoveoResultLink"></a><span class="CoveoFollowItem"></span>`),
    basicExpression: 'technology',
    toExecute: ()=> {
      $$(document.body).find('.CoveoSearchInterface').style.minHeight = '300px';
    }
  },
  HiddenQuery: {
    show: true,
    toExecute: ()=> {
      let searchInterface = $$(document.body).find('.CoveoSearchInterface')
      Coveo.state(searchInterface, 'hd', 'This is the filter description');
      Coveo.state(searchInterface, 'hq', '@uri');
    },
    element: $$('div', undefined, `<div class="CoveoBreadcrumb"></div><div class="CoveoHiddenQuery"></div>`)
  },
  HierarchicalFacet: {
    show: true,
    options: {
      field: '@hierarchicfield',
      title: 'Hierarchical Facet with random values'
    },
    toExecute: ()=> {  // `@hierarchicfield` does not exist in the sample Coveo Cloud V2 organization.
      $$(document.body).on('newQuery', function(e, args) {
        SearchEndpoint.configureSampleEndpoint();
        Coveo.get($$(document.body).find(".CoveoHierarchicalFacet")).queryController.setEndpoint(SearchEndpoint.endpoints['default']);
      });
    },
    advancedExpression: "@hierarchicfield"
  },
  Logo: {
    show: true,
    toExecute: ()=> {
      $$(document.body).find('.CoveoSearchInterface').style.padding = '20px';
    }
  },
  Matrix: {
    show: true,
    options: {
      title: 'Size of documents by Author',
      rowField: '@author',
      columnField: '@filetype',
      columnFieldValues: ['pdf', 'YouTubeVideo', 'xls'],
      computedField: '@size',
      computedFieldFormat: 'n0 bytes',
      columnLabels: ['PDF', 'YouTube Videos', 'Excel documents']
    },
    element: $$('div', undefined, `<div class="CoveoBreadcrumb"></div><div class="CoveoMatrix"></div>`)
  },
  OmniboxResultList: {
    show: true,
    element: $$('div', undefined, `<div class="CoveoSearchbox" data-enable-omnibox="true" data-inline="true"></div><div class="CoveoOmniboxResultList"><script class="result-template" type="text/x-underscore"><div><a class='CoveoResultLink'></a></div></script></div>`),
    options: {
      headerTitle: ''
    },
    toExecute: ()=> {
      Coveo.get($$(document.body).find('.CoveoSearchInterface'), Coveo.SearchInterface).options.resultsPerPage = 5;
    }
  },
  Pager: {
    show: true,
    toExecute: ()=> {
      $$(document.body).find('.CoveoSearchInterface').style.padding = '20px';
    }
  },
  PreferencesPanel: {
    show: true,
    element: $$('div', undefined, `<div class="CoveoSettings"></div><div class="CoveoSearchbox"></div><div class="CoveoPreferencesPanel"><div class="CoveoResultsPreferences"></div><div class="CoveoResultsFiltersPreferences"></div></div>`),
    toExecute: ()=> {
      $$(document.body).find('.CoveoSearchInterface').style.minHeight = '300px';
    }
  },
  PrintableUri: {
    show: true,
    isResultComponent: true,
    advancedExpression: '@litopicid @filetype==lithiummessage'
  },
  QueryDuration: {
    show: true
  },
  QuerySummary: {
    show: true
  },
  Querybox: {
    show: true
  },
  Quickview: {
    show: true,
    isResultComponent: true,
    advancedExpression: '@filetype=="youtubevideo"'
  },
  ResultLink: {
    show: true,
    isResultComponent: true,
    advancedExpression: '@filetype=="youtubevideo"'
  },
  ResultList: {
    show: true
  },
  ResultRating: {
    show: true,
    isResultComponent: true,
    toExecute: ()=> {
      Coveo.get($$(document.body).find('.CoveoSearchInterface'), Coveo.SearchInterface).options.enableCollaborativeRating = true;
    }
  },
  ResultsFiltersPreferences: {
    show: true,
    element: $$('div', undefined, `<div class="CoveoSettings"></div><div class="CoveoSearchbox"></div><div class="CoveoPreferencesPanel"><div class="CoveoResultsFiltersPreferences"></div></div>`),
    toExecute: ()=> {
      $$(document.body).find('.CoveoSearchInterface').style.minHeight = '300px';
    }
  },
  ResultsPerPage: {
    show: true,
    toExecute: ()=> {
      $$(document.body).find('.CoveoSearchInterface').style.padding = '20px';
    }
  },
  ResultsPreferences: {
    element: $$('div', undefined, `<div class="CoveoSettings"></div><div class="CoveoSearchbox"></div><div class="CoveoPreferencesPanel"><div class="CoveoResultsPreferences"></div></div>`),
    show: true,
    toExecute: ()=> {
      $$(document.body).find('.CoveoSearchInterface').style.minHeight = '300px';
    }
  },
  SearchAlerts: {
    show: true,
    element: $$('div', undefined, `<div class="CoveoSettings"></div><div class="CoveoSearchbox"></div><div class="CoveoSearchAlerts"></div>`),
    toExecute: ()=> {
      $$(document.body).find('.CoveoSearchInterface').style.minHeight = '300px';
    }
  },
  Settings: {
    show: true,
    element: $$('div', undefined, `<div class="CoveoSettings"></div><div class="CoveoSearchbox"></div><div class="CoveoPreferencesPanel"></div><div class="CoveoShareQuery"></div><div class="CoveoExportToExcel"></div>`),
    toExecute: ()=> {
      $$(document.body).find('.CoveoSearchInterface').style.minHeight = '300px';
    }
  },
  ShareQuery: {
    show: true,
    element: $$('div', undefined, `<div class="CoveoSettings"></div><div class="CoveoSearchbox"></div><div class="CoveoShareQuery"></div>`),
    toExecute: ()=> {
      $$(document.body).find('.CoveoSearchInterface').style.minHeight = '300px';
    }
  },
  Sort: {
    show: true,
    element: $$('div', undefined, `<span class="CoveoSort" data-sort-criteria="relevancy" data-caption="Relevance"></span><span class="CoveoSort" data-sort-criteria="date descending,date ascending" data-caption="Date"></span>`),
    toExecute: ()=> {
      $$(document.body).find('.CoveoSearchInterface').style.padding = '20px';
    }
  },
  Thumbnail: {
    show: true,
    isResultComponent: true,
    advancedExpression: '@filetype=="youtubevideo"'
  },
  YouTubeThumbnail: {
    show: true,
    isResultComponent: true,
    advancedExpression: '@filetype=="youtubevideo"'
  },
  AdvancedSearch: {
    show: true,
    element: $$('div', undefined, `<div class="coveo-search-section"><div class="CoveoSettings"></div><div class="CoveoSearchbox"></div></div><div class="CoveoAdvancedSearch"></div>`),
    toExecute: ()=> {
      $$(document.body).find('.CoveoSearchInterface').style.minHeight = '300px';
    }
  }
}

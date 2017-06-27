import { $$, Dom } from './Dom';

declare var require: (svgPath: string) => string;

export class SVGIcons {
  public static search = require('svg/search');
  public static more = require('svg/more');
  public static loading = require('svg/loading');
  public static checkboxHookExclusionMore = require('svg/checkbox-hook-exclusion-more');
  public static arrowUp = require('svg/arrow-up');
  public static arrowDown = require('svg/arrow-down');

  public static mainClear = require('svg/main-clear');
  public static orAnd = require('svg/or-and');
  public static sort = require('svg/sort');
  public static ascending = require('svg/ascending');
  public static descending = require('svg/descending');
  public static dropdownMore = require('svg/dropdown-more');
  public static dropdownLess = require('svg/dropdown-less');
  public static facetCollapse = require('svg/facet-collapse');
  public static facetExpand = require('svg/facet-expand');

  public static dropdownShareQuery = require('svg/dropdown-share-query');
  public static dropdownPreferences = require('svg/dropdown-preferences');
  public static dropdownAuthenticate = require('svg/dropdown-authenticate');
  public static dropdownExport = require('svg/dropdown-export');
  public static dropdownFollowQuery = require('svg/dropdown-follow-query');
}

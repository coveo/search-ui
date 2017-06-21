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
}

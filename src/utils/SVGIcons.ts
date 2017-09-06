import { $$, Dom } from './Dom';

declare const require: (svgPath: string) => string;

const path = '../../image/svg';

export class SVGIcons {
  public static icons = {
    search: require(`${path}/search`),
    more: require(`${path}/more`),
    loading: require(`${path}/loading`),
    checkboxHookExclusionMore: require(`${path}/checkbox-hook-exclusion-more`),
    arrowUp: require(`${path}/arrow-up`),
    arrowDown: require(`${path}/arrow-down`),

    mainClear: require(`${path}/main-clear`),
    orAnd: require(`${path}/or-and`),
    sort: require(`${path}/sort`),
    ascending: require(`${path}/ascending`),
    descending: require(`${path}/descending`),
    dropdownMore: require(`${path}/dropdown-more`),
    dropdownLess: require(`${path}/dropdown-less`),
    facetCollapse: require(`${path}/facet-collapse`),
    facetExpand: require(`${path}/facet-expand`),

    dropdownShareQuery: require(`${path}/dropdown-share-query`),
    dropdownPreferences: require(`${path}/dropdown-preferences`),
    dropdownAuthenticate: require(`${path}/dropdown-authenticate`),
    dropdownExport: require(`${path}/dropdown-export`),
    dropdownFollowQuery: require(`${path}/dropdown-follow-query`),
    quickview: require(`${path}/quickview`),
    pagerRightArrow: require(`${path}/pager-right-arrow`),
    pagerLeftArrow: require(`${path}/pager-left-arrow`),
    replies: require(`${path}/replies`),

    coveoLogo: require(`${path}/coveo-logo`),
    coveoPoweredBy: require(`${path}/coveo-powered-by-logo`),

    taggingOk: require(`${path}/tagging-ok`),
    edit: require(`${path}/edit`),
    star: require(`${path}/star`),

    listLayout: require(`${path}/list-layout`),
    cardLayout: require(`${path}/card-layout`),
    tableLayout: require(`${path}/table-layout`)
  };
}

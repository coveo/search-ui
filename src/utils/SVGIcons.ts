declare const require: (svgPath: string) => string;

export class SVGIcons {
  public static icons = {
    search: require(`svg/search`),
    more: require(`svg/more`),
    loading: require(`svg/loading`),
    checkboxHookExclusionMore: require(`svg/checkbox-hook-exclusion-more`),
    arrowUp: require(`svg/arrow-up`),
    arrowDown: require(`svg/arrow-down`),

    mainClear: require(`svg/main-clear`),
    orAnd: require(`svg/or-and`),
    sort: require(`svg/sort`),
    ascending: require(`svg/ascending`),
    descending: require(`svg/descending`),
    dropdownMore: require(`svg/dropdown-more`),
    dropdownLess: require(`svg/dropdown-less`),
    facetCollapse: require(`svg/facet-collapse`),
    facetExpand: require(`svg/facet-expand`),

    dropdownShareQuery: require(`svg/dropdown-share-query`),
    dropdownPreferences: require(`svg/dropdown-preferences`),
    dropdownAuthenticate: require(`svg/dropdown-authenticate`),
    dropdownExport: require(`svg/dropdown-export`),
    dropdownFollowQuery: require(`svg/dropdown-follow-query`),
    quickview: require(`svg/quickview`),
    pagerRightArrow: require(`svg/pager-right-arrow`),
    pagerLeftArrow: require(`svg/pager-left-arrow`),
    replies: require(`svg/replies`),
    video: require(`svg/video`),
    coveoLogo: require(`svg/coveo-logo`),
    coveoPoweredBy: require(`svg/coveo-powered-by-logo`),
    taggingOk: require(`svg/tagging-ok`),
    edit: require(`svg/edit`),
    star: require(`svg/star`),
    listLayout: require(`svg/list-layout`),
    cardLayout: require(`svg/card-layout`),
    tableLayout: require(`svg/table-layout`)
  };
}

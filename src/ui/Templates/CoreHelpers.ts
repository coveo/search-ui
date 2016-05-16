









module Coveo {
  TemplateHelpers.registerFieldHelper('javascriptEncode', (value: string) => {
    return Utils.exists(value) ? StringUtils.javascriptEncode(value) : undefined;
  });

  TemplateHelpers.registerTemplateHelper('shorten', (content: string, length: number, highlights?: Highlight[], cssClass?: string) => {
    var strAndHoles = Coveo.StringAndHoles.shortenString(content, length, '...');

    if (Utils.exists(highlights)) {
      return Coveo.HighlightUtils.highlightString(strAndHoles.value, highlights, strAndHoles.holes, cssClass || 'highlight');
    } else {
      return strAndHoles.value;
    }
  });

  TemplateHelpers.registerTemplateHelper('shortenPath', (content: string, length: number, highlights?: Highlight[], cssClass?: string) => {
    var strAndHoles = StringAndHoles.shortenPath(content, length);

    if (Utils.exists(highlights)) {
      return Coveo.HighlightUtils.highlightString(strAndHoles.value, highlights, strAndHoles.holes, cssClass || 'highlight');
    } else {
      return strAndHoles.value;
    }
  });

  TemplateHelpers.registerTemplateHelper('shortenUri', (content: string, length: number, highlights?: Highlight[], cssClass?: string) => {
    var strAndHoles = StringAndHoles.shortenUri(content, length);

    if (Utils.exists(highlights)) {
      return Coveo.HighlightUtils.highlightString(strAndHoles.value, highlights, strAndHoles.holes, cssClass || 'highlight');
    } else {
      return strAndHoles.value;
    }
  });

  TemplateHelpers.registerTemplateHelper('highlight', (content: string, highlights: Highlight[], cssClass?: string) => {
    if (Utils.exists(content)) {
      if (Utils.exists(highlights)) {
        return HighlightUtils.highlightString(content, highlights, null, cssClass || 'highlight');
      } else {
        return content;
      }
    } else {
      return undefined;
    }
  });

  TemplateHelpers.registerTemplateHelper('highlightStreamText', (content: string, termsToHighlight = resolveQueryResultFromCallStack().termsToHighlight, phrasesToHighlight = resolveQueryResultFromCallStack().phrasesToHighlight, opts?: StreamHighlightOptions)=> {
    if (Utils.exists(content)) {
      if (Utils.isNonEmptyArray(_.keys(termsToHighlight)) || Utils.isNonEmptyArray(_.keys(phrasesToHighlight))) {
        return highlightStreamText(content, termsToHighlight, phrasesToHighlight, opts)
      } else {
        return content;
      }
    } else {
      return undefined;
    }
  });

  TemplateHelpers.registerTemplateHelper('highlightStreamHTML', (content: string, termsToHighlight = resolveQueryResultFromCallStack().termsToHighlight, phrasesToHighlight = resolveQueryResultFromCallStack().phrasesToHighlight, opts?: StreamHighlightOptions)=> {
    if (Utils.exists(content)) {
      if (Utils.isNonEmptyArray(termsToHighlight)) {
        return highlightStreamHTML(content, termsToHighlight, phrasesToHighlight, opts)
      } else {
        return content;
      }
    } else {
      return undefined;
    }
  });

  TemplateHelpers.registerFieldHelper('number', (value: any, options?: any) => {
    var numberValue = Number(value)
    if (Utils.exists(value)) {
      if (_.isString(options)) {
        return StringUtils.htmlEncode(Globalize.format(numberValue, <string>options));
      } else {
        return StringUtils.htmlEncode(numberValue.toString());
      }
    } else {
      return undefined;
    }
  });

  TemplateHelpers.registerFieldHelper('date', (value: any, options?: DateToStringOptions) => {
    return DateUtils.dateToString(DateUtils.convertFromJsonDateIfNeeded(value), options);
  });

  TemplateHelpers.registerFieldHelper('time', (value: any, options?: DateToStringOptions) => {
    return DateUtils.timeToString(DateUtils.convertFromJsonDateIfNeeded(value), options);
  });

  TemplateHelpers.registerFieldHelper('dateTime', (value: any, options?: DateToStringOptions) => {
    return DateUtils.dateTimeToString(DateUtils.convertFromJsonDateIfNeeded(value), options);
  });

  TemplateHelpers.registerFieldHelper('emailDateTime', (value: any, options?: DateToStringOptions) => {
    var defaultOptions = <DateToStringOptions>{};
    defaultOptions.includeTimeIfThisWeek = true;
    var optionsToUse = <DateToStringOptions>$.extend({}, defaultOptions, options);
    return value ? DateUtils.dateTimeToString(DateUtils.convertFromJsonDateIfNeeded(value), optionsToUse) : undefined;
  });

  TemplateHelpers.registerFieldHelper('currency', (value: any, options?: CurrencyToStringOptions) => {
    return CurrencyUtils.currencyToString(value, options);
  });

  TemplateHelpers.registerFieldHelper('timeSpan', (value: any, options: TimeSpanUtilsOptions = {isMilliseconds: false})=> {
    return new TimeSpan(value, options.isMilliseconds).getHHMMSS();
  });

  TemplateHelpers.registerFieldHelper('email', (value: any, ...args: any[]) => {
    // support old arguments (value: any, companyDomain: string, me: string, lengthLimit = 2, truncateName = false)
    var companyDomain: string;
    var me: string;
    var lengthLimit: number;
    var truncateName: boolean;
    if (_.isObject(args[0])) {
      companyDomain = args[0]['companyDomain'];
      me = args[0]['me'];
      lengthLimit = args[0]['lengthLimit'];
      truncateName = args[0]['truncateName'];
    } else {
      companyDomain = args[0];
      me = args[1];
      lengthLimit = args[2];
      truncateName = args[3];
    }
    if (lengthLimit == undefined) {
      lengthLimit = 2;
    }
    if (truncateName == undefined) {
      truncateName = false;
    }
    if (_.isString(value)) {
      var listOfAddresses = EmailUtils.splitSemicolonSeparatedListOfEmailAddresses(<string>value);
      return EmailUtils.emailAddressesToHyperlinks(listOfAddresses, companyDomain, me, lengthLimit, truncateName);
    } else if (_.isArray(value)) {
      return EmailUtils.emailAddressesToHyperlinks(<string[]>value, companyDomain, me, lengthLimit, truncateName);
    } else {
      return undefined;
    }
  });

  TemplateHelpers.registerTemplateHelper("excessEmailToggle", (target: HTMLElement) => {
    $(target).removeClass("coveo-active");
    if ($(target).hasClass("coveo-emails-excess-collapsed")) {
      $(target).siblings(".coveo-emails-excess-expanded").addClass("coveo-active");
    } else if ($(target).hasClass("coveo-hide-expanded")) {
      $(target).parent().addClass("coveo-inactive");
      $(target).parent().siblings(".coveo-emails-excess-collapsed").addClass("coveo-active");
    }
    return undefined;
  })

  TemplateHelpers.registerFieldHelper('anchor', (href: string, options?: AnchorUtilsOptions) => {
    return AnchorUtils.buildAnchor(href, options);
  });

  TemplateHelpers.registerFieldHelper('image', (src: string, options?: ImageUtilsOptions) => {
    return ImageUtils.buildImage(src, options);
  });

  TemplateHelpers.registerTemplateHelper('thumbnail', (result: IQueryResult = resolveQueryResultFromCallStack(), endpoint: string = "default", options?: ImageUtilsOptions) => {
    if (QueryUtils.hasThumbnail(result)) {
      return ImageUtils.buildImageFromResult(result, Coveo.SearchEndpoint.endpoints[endpoint], options);
    }
  });

  TemplateHelpers.registerTemplateHelper('fromFileTypeToIcon', (result: IQueryResult = resolveQueryResultFromCallStack(), options: IIconOptions = {}) => {
    return Icon.createIcon(result, options).outerHTML;
  });

  TemplateHelpers.registerTemplateHelper('attrEncode', (value: string) => {
    return ('' + value)/* Forces the conversion to string. */
        .replace(/&/g, '&amp;')/* This MUST be the 1st replacement. */
        .replace(/'/g, '&apos;')/* The 4 other predefined entities, required. */
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
  });

  TemplateHelpers.registerTemplateHelper('templateFields', (result: IQueryResult = resolveQueryResultFromCallStack()) => {
        var rows: string[] = [];
        if (result.fields != null) {
          _.forEach(result.fields, (tableField: any)=> {
            var tr = $(document.createElement('tr'));
            _.forEach(tableField, (value: any, key: string)=> {
              if (_.isObject(value)) {
                tr.attr(ComponentOptions.attrNameFromName(key), JSON.stringify(value));
              } else {
                tr.attr(ComponentOptions.attrNameFromName(key), value);
              }
            });
            return rows.push(tr.get(0).outerHTML);
          });
        }
        return rows.join('');
      }
  );

  TemplateHelpers.registerTemplateHelper('loadTemplates', (templatesToLoad: { [id: string]: any }, once = true) => {
    var ret = "";
    var data = resolveQueryResultFromCallStack();
    var atLeastOneWasLoaded = false;
    var toLoad = templatesToLoad;
    var defaultTmpl;
    _.each(templatesToLoad, (value, key?, obj?) => {
      if (value == "default") {
        defaultTmpl = key;
      }
    })
    if (defaultTmpl != undefined) {
      toLoad = _.omit(templatesToLoad, defaultTmpl)
    }
    _.each(toLoad, (condition, id?, obj?) => {
      if (!atLeastOneWasLoaded || !once) {
        atLeastOneWasLoaded = atLeastOneWasLoaded || condition;
        ret += TemplateHelpers.getHelper("loadTemplate")(id, condition, data);
      }
    })
    if (!atLeastOneWasLoaded && defaultTmpl != undefined) {
      ret += TemplateHelpers.getHelper("loadTemplate")(defaultTmpl, true, data);
    }
    return ret;
  })

  var byteMeasure = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];

  TemplateHelpers.registerFieldHelper('size', (value: any, options?: {base?:number; presision?:number;}) => {
    var size = Number(value);
    var presision = (options != null && options.presision != null ? options.presision : 2);
    var base = (options != null && options.base != null ? options.base : 0);
    while (size > 1024 && base + 1 < byteMeasure.length) {
      size /= 1024;
      base++;
    }
    size = Math.floor(size * Math.pow(10, presision)) / Math.pow(10, presision);
    return size + ' ' + byteMeasure[base];
  });

  TemplateHelpers.registerTemplateHelper('loadTemplate', (id: string, condition: boolean = true, data?: any) => {
    if (Utils.isNullOrUndefined(data)) {
      data = resolveQueryResultFromCallStack();
    }
    if (condition) {
      return TemplateCache.getTemplate(id).instantiateToString(data, false);
    }
    return "";
  });

  TemplateHelpers.registerTemplateHelper('encodeCarriageReturn', (data: string) => {
    if (Utils.isNullOrUndefined(data)) {
      return undefined;
    } else {
      return StringUtils.encodeCarriageReturn(data);
    }
  });

  TemplateHelpers.registerTemplateHelper('isMobileDevice', () => {
    return DeviceUtils.isMobileDevice() ? DeviceUtils.getDeviceName() : null;
  });


  function resolveQueryResultFromCallStack() {
    var calledBy = arguments.callee.caller;
    var queryResult: IQueryResult = calledBy.arguments[0];
    var numOfCall = 0;
    while (calledBy != undefined && (queryResult == undefined || queryResult.uri == undefined) && numOfCall < 100) {
      queryResult = calledBy.arguments[0];
      calledBy = calledBy.caller;
      numOfCall++;
    }
    return queryResult;
  }
}

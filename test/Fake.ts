import {IQueryResults} from '../src/rest/QueryResults';
import {IQueryResult} from '../src/rest/QueryResult';
import {QueryUtils} from '../src/utils/QueryUtils';
import {Assert} from '../src/misc/Assert';
import {IGroupByValue} from '../src/rest/GroupByValue';
import {IGroupByResult} from '../src/rest/GroupByResult';
import {IIndexFieldValue} from '../src/rest/FieldValue';
import {ISearchEvent} from '../src/rest/SearchEvent';
import {IClickEvent} from '../src/rest/ClickEvent';
import {IOmniboxDataRow} from '../src/ui/Omnibox/OmniboxInterface';
import {IPopulateOmniboxEventArgs} from '../src/events/OmniboxEvents';

export class FakeResults {

  static createFakeResults(count = 10, token = ''): IQueryResults {
    var results: IQueryResult[] = [];
    for (var i = 0; i < count; ++i) {
      results.push(FakeResults.createFakeResult(token + i.toString()));
    }

    return {
      searchUid: QueryUtils.createGuid(),
      pipeline: 'pipeline',
      splitTestRun: 'splitTestRunName',
      totalCount: count != 0 ? count + 1 : 0,
      totalCountFiltered: count != 0 ? count + 1 : 0,
      duration: 321,
      indexDuration: 123,
      clientDuration: 456,
      results: results,
      groupByResults: [],
      queryCorrections: [],
      _folded: undefined,
      termsToHighlight: undefined,
      phrasesToHighlight: undefined,
      triggers: []
    }
  }

  static createFakeResultsWithChildResults(count = 10, numberOfChildResults = 5, totalNumberOfChildResult = 5): IQueryResults {
    var results: IQueryResult[] = [];
    for (var i = 0; i < count; ++i) {
      results.push(FakeResults.createFakeResultWithChildResult(i.toString(), numberOfChildResults, totalNumberOfChildResult));
    }

    return {
      searchUid: QueryUtils.createGuid(),
      totalCount: count != 0 ? count + 1 : 0,
      totalCountFiltered: count != 0 ? count + 1 : 0,
      duration: 321,
      indexDuration: 123,
      clientDuration: 456,
      results: results,
      groupByResults: [],
      queryCorrections: [],
      _folded: undefined,
      termsToHighlight: undefined,
      phrasesToHighlight: undefined,
      triggers: []
    }
  }

  static createFakeResult(token: string = 'foo'): IQueryResult {
    return <IQueryResult>{
      title: 'Title' + token,
      titleHighlights: [],
      uri: 'http://uri.' + token + '.com',
      printableUri: 'http://printable.uri.' + token + '.com',
      printableUriHighlights: [],
      clickUri: 'http://click.uri.' + token + '.com',
      uniqueId: 'uniqueId' + token,
      excerpt: 'excerpt' + token,
      excerptHighlights: [],
      firstSentences: 'firstSentences' + token,
      firstSentencesHighlights: [],
      hasHtmlVersion: true,
      hasMobileHtmlVersion: true,
      flags: 'HasThumbnail',
      summary: 'summary' + token,
      summaryHighlights: [],
      rankingInfo: '',
      raw: {
        'string': 'string value',
        'date': new Date(1980, 2, 11, 8, 30).valueOf(),
        'number': 123,
        'emails': 'mlaporte@coveo.com;dlavoie@coveo.com',
        'empty': '',
        'randomNumber': Math.random(),
        'urihash': QueryUtils.createGuid(),
        'source': 'the source',
        'collection': 'the collection',
        'author': 'o.o'
      },
      childResults: [],
      termsToHighlight: {},
      phrasesToHighlight: {},
      index: 0,
      queryUid: 'the uid',
      rating: 3,
      state: {},
      isRecommendation: false
    };
  }

  static createFakeResultWithChildResult(token: string, numberOfChildResult: number, totalNumberOfChildResult = 5): IQueryResult {
    var childResults: IQueryResult[] = [];
    for (var i = 0; i < numberOfChildResult; i++) {
      childResults.push(FakeResults.createFakeResult(token + '-child' + i));
    }
    var ret = FakeResults.createFakeResult(token);
    ret.totalNumberOfChildResults = totalNumberOfChildResult;
    $.extend(ret, {childResults: childResults});
    return ret;
  }

  static createFakeResultWithAttachments(token = 'test',
                                         numberOfAttachments = 3,
                                         attachmentType = ['xml', 'pdf', 'txt'],
                                         flags = 'HasThumbnail',
                                         attachmentsFlags = ['IsAttachment', 'IsAttachment', 'IsAttachment'],
                                         withSubAttachments = false): IQueryResult {
    var fake = FakeResults.createFakeResult(token);
    fake.flags = flags;
    if (withSubAttachments) {
      var subAttachments = [];
      for (var i = 0; i < numberOfAttachments; i++) {
        subAttachments.push(FakeResults.createFakeResultWithAttachments('test1', 3, undefined, undefined, undefined, false));
      }
      fake.attachments = subAttachments;
    } else {
      fake.attachments = FakeResults.createFakeResults(numberOfAttachments).results;
    }
    _.each(attachmentType, (type, index, list) => {
      if (fake.attachments[index] != undefined) {
        fake.attachments[index].raw['filetype'] = type
      }
    })
    _.each(attachmentsFlags, (flag, index, list) => {
      if (fake.attachments[index] != undefined) {
        fake.attachments[index].flags = flag
      }
    })
    return fake
  }

  static createFakeGroupByResult(field: string, token: string, count: number, includeComputedValues?: boolean): IGroupByResult {
    Assert.isNonEmptyString(field);
    Assert.isNonEmptyString(token);
    Assert.isLargerOrEqualsThan(0, count);

    var groupByValues: IGroupByValue[] = [];
    for (var i = 0; i < count; ++i) {
      groupByValues.push(FakeResults.createFakeGroupByValue(token + i.toString(), i + 1, 100 + i, includeComputedValues ? 1000 + i : undefined));
    }

    return {
      field: field,
      values: groupByValues
    };
  }

  static createFakeRangeGroupByResult(field: string, start = 1, end = 100, steps = 25): IGroupByResult {
    var groupByValues: IGroupByValue[] = [];
    for (var i = start; i <= end; i += (steps)) {
      groupByValues.push(FakeResults.createFakeGroupByRangeValue(i, i + (steps - 1), 'foobar' + i.toString(), i));
    }
    return {
      field: field,
      values: groupByValues
    }
  }

  static createFakeHierarchicalGroupByResult(field: string, token: string, numberOfLevel = 2, countByLevel = 3, delimitingCharacter = '|', includeComputedValues = false, weirdCasing = true): IGroupByResult {
    var groupByValues: IGroupByValue[] = [];
    for (var i = 0; i < 2; ++i) {
      var groupByValueTopLevel = FakeResults.createFakeGroupByValue(token + i.toString(), i + 1, 100 + 1, includeComputedValues ? 1000 + i : undefined);
      groupByValues.push(groupByValueTopLevel);

      for (var j = 0; j < countByLevel; j++) {
        var groupByValueSubLevel = FakeResults.createFakeGroupByValue(token + i.toString(), i + 1, 100 + 1, includeComputedValues ? 1000 + i : undefined);
        groupByValueSubLevel.value = groupByValueSubLevel.lookupValue += delimitingCharacter + FakeResults.createFakeGroupByValue(token + i.toString() + '-' + +j.toString(), i + 1, 100 + i, includeComputedValues ? 1000 + i : undefined).value
        if (weirdCasing) {
          groupByValueSubLevel.value = groupByValueSubLevel.lookupValue = _.map(groupByValueSubLevel.lookupValue.split(delimitingCharacter), (value, k) => (i + j + k) % 2 == 0 ? value.toLowerCase() : value.toUpperCase()).join(delimitingCharacter)
        }
        groupByValues.push(groupByValueSubLevel)
      }
    }

    return {
      field: field,
      values: groupByValues
    };
  }

  static createFakeGroupByValue(token: string, count: number, score?: number, computedValue?: number): IGroupByValue {
    Assert.isNonEmptyString(token);

    return {
      value: token,
      lookupValue: token,
      numberOfResults: count,
      score: score || count * 2,
      computedFieldResults: computedValue ? [computedValue] : undefined
    }
  }

  static createFakeGroupByRangeValue(from: number, to: number, token: string, count: number, score?: number, computedValue?: number): IGroupByValue {

    return {
      value: from + '..' + to,
      lookupValue: token,
      numberOfResults: count,
      score: score || count * 2,
      computedFieldResults: computedValue ? [computedValue] : undefined
    }
  }

  static createFakeFieldValue(token: string, count: number): IIndexFieldValue {
    Assert.isNonEmptyString(token);

    return {
      value: token,
      lookupValue: token,
      numberOfResults: count
    }
  }

  static createFakeFieldValues(token: string, count: number): IIndexFieldValue[] {
    Assert.isNonEmptyString(token);
    Assert.isLargerOrEqualsThan(0, count);

    var fieldValues: IIndexFieldValue[] = [];
    for (var i = 0; i < count; ++i) {
      fieldValues.push(FakeResults.createFakeFieldValue(token + i.toString(), i + 1));
    }

    return fieldValues;
  }

  static createFakeOmniboxData(token = 'test', numberOfRows = 1, numberOfSelectablePerRow = 1, zIndex = 1) {
    var rows = [];
    for (var i = 0; i < numberOfRows; i++) {
      var selectables = FakeResults.createFakeOmniboxSelectableData(token + ':' + i, numberOfSelectablePerRow);
      var element = $(`<div class='coveo-omnibox-section'></div>`);
      _.each(selectables, (selectable) => {
        element.append(selectable)
      })
      rows.push({element: element.get(0), zIndex: zIndex + i})
    }
    return rows;
  }

  static createFakeDeferredOmniboxData(numberOfRows: number) {
    var rows = [];
    for (var i = 0; i < numberOfRows; i++) {
      rows.push({deferred: $.Deferred()})
    }
    return rows;
  }

  static createFakeOmniboxSelectableData(token: string, numberOfSelectables: number) {
    var rows = [];
    for (var i = 0; i < numberOfSelectables; i++) {
      rows.push($(`<div class='coveo-omnibox-selectable'>${token + ':' + i}</div>`))
    }
    return rows;
  }

  static createFakeFeedItemResult(token: string, nbLikes: number = 0, nbTopics: number = 0, hasAttachment: boolean = false) {
    var result = this.createFakeResult(token);
    result.raw.sfparentid = 'parentid';
    result.raw.sfparentname = 'parentname';
    result.raw.sffeeditemid = token + 'id';
    result.clickUri = 'myURI/' + result.raw.sffeeditemid;
    result.raw.sfcreatedby = 'createdby';
    result.raw.sfcreatedbyid = 'createdbyid';
    result.raw.sfinsertedbyid = 'createdbyid';

    // Generate likes
    if (nbLikes > 0) {
      result.raw.sflikecount = nbLikes;
      result.raw.sflikedby = '';
      result.raw.sflikedbyid = '';

      for (var i = 1; i <= nbLikes; i++) {
        result.raw.sflikedby += 'LikeName' + i;
        result.raw.sflikedbyid += 'LikeId' + i;

        if (i != nbLikes) {
          result.raw.sflikedby += ';';
          result.raw.sflikedbyid += ';';
        }
      }
    }

    // Generate topics
    if (nbTopics > 0) {
      result.raw.coveochatterfeedtopics = '';

      for (var i = 1; i <= nbTopics; i++) {
        result.raw.coveochatterfeedtopics += 'topic' + i;

        if (i != nbTopics) {
          result.raw.coveochatterfeedtopics += ';';
        }
      }
    }

    // Generate post attachment
    if (hasAttachment) {
      result.raw.coveochatterfeedtopics = 'PostAttachment';
      result.raw.sfcontentfilename = 'fileName';
      result.raw.sfcontentversionid = token;

    }

    return result;
  }

  static createFakeSearchEvent(token = 'foo'): ISearchEvent {
    return {
      actionCause: token + 'actionCause',
      actionType: token + 'actionType',
      device: token + 'device',
      mobile: false,
      originLevel1: token + 'originLevel1',
      originLevel2: token + 'originLevel2',
      language: token + 'language',
      responseTime: 0,
      searchQueryUid: token + 'searchQueryUid',
      queryPipeline: token + 'queryPipeline',
      splitTestRunName: token + 'splitTestRunName',
      splitTestRunVersion: token + 'splitTestRunVersion',
      queryText: token + 'queryText',
      numberOfResults: 0,
      resultsPerPage: 0,
      pageNumber: 0,
      advancedQuery: token + 'advancedQuery',
      didYouMean: false,
      contextual: false
    }
  }

  static createFakeClickEvent(token = 'foo'): IClickEvent {
    return {
      actionCause: token + 'actionCause',
      actionType: token + 'actionType',
      device: token + 'device',
      mobile: false,
      originLevel1: token + 'originLevel1',
      originLevel2: token + 'originLevel2',
      language: token + 'language',
      responseTime: 0,
      searchQueryUid: token + 'searchQueryUid',
      queryPipeline: token + 'queryPipeline',
      splitTestRunName: token + 'splitTestRunName',
      splitTestRunVersion: token + 'splitTestRunVersion',
      documentUri: token + 'documentUri',
      documentUriHash: token + 'documentUriHash',
      documentUrl: token + 'documentUrl',
      documentTitle: token + 'documentTitle',
      documentCategory: token + 'documentCategory',
      collectionName: token + 'collectionName',
      sourceName: token + 'sourceName',
      documentPosition: 0,
      viewMethod: token + 'viewMethod',
      rankingModifier: token + 'rankingModifier'
    }
  }

  static createPopulateOmniboxEventArgs(queryboxContent: string, cursorPosition: number, rows: IOmniboxDataRow[] = []): IPopulateOmniboxEventArgs {
    return {
      completeQueryExpression: {word: queryboxContent, regex: new RegExp(queryboxContent, 'gi')},
      allQueryExpressions: undefined,
      currentQueryExpression: {word: queryboxContent, regex: new RegExp(queryboxContent, 'gi')},
      cursorPosition: cursorPosition,
      rows: [],
      clear: () => {
      },
      clearCurrentExpression: () => {
      },
      closeOmnibox: () => {
      },
      insertAt: () => {
      },
      replace: () => {
      },
      replaceCurrentExpression: () => {
      }
    }
  }
}

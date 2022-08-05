import { IQueryResults } from '../src/rest/QueryResults';
import { IQueryResult } from '../src/rest/QueryResult';
import { QueryUtils } from '../src/utils/QueryUtils';
import { Assert } from '../src/misc/Assert';
import { IGroupByValue } from '../src/rest/GroupByValue';
import { IGroupByResult } from '../src/rest/GroupByResult';
import { IIndexFieldValue } from '../src/rest/FieldValue';
import { ISearchEvent } from '../src/rest/SearchEvent';
import { IClickEvent } from '../src/rest/ClickEvent';
import { IOmniboxDataRow } from '../src/ui/Omnibox/OmniboxInterface';
import { IPopulateOmniboxEventArgs } from '../src/events/OmniboxEvents';
import { mockSearchInterface } from './MockEnvironment';
import _ = require('underscore');
import { IFieldDescription } from '../src/rest/FieldDescription';
import { ICategoryFacetResult } from '../src/rest/CategoryFacetResult';
import { range } from 'underscore';
import { IPlanResponse } from '../src/rest/Plan';

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
      totalCountFiltered: count,
      duration: 321,
      indexDuration: 123,
      clientDuration: 456,
      searchAPIDuration: 789,
      results: results,
      groupByResults: [],
      categoryFacets: [],
      queryCorrections: [],
      _folded: undefined,
      termsToHighlight: undefined,
      phrasesToHighlight: undefined,
      triggers: []
    };
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
      searchAPIDuration: 789,
      results: results,
      groupByResults: [],
      categoryFacets: [],
      queryCorrections: [],
      _folded: undefined,
      termsToHighlight: undefined,
      phrasesToHighlight: undefined,
      triggers: []
    };
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
        string: 'string value',
        date: new Date(1980, 2, 11, 8, 30).valueOf(),
        number: 123,
        emails: 'mlaporte@coveo.com;dlavoie@coveo.com',
        empty: '',
        randomNumber: Math.random(),
        urihash: QueryUtils.createGuid(),
        source: 'the source',
        collection: 'the collection',
        author: 'o.o'
      },
      childResults: [],
      termsToHighlight: {},
      phrasesToHighlight: {},
      index: 0,
      queryUid: 'the uid',
      rating: 3,
      state: {},
      isRecommendation: false,
      searchInterface: mockSearchInterface(),
      absentTerms: []
    };
  }

  static createFakeResultWithChildResult(token: string, numberOfChildResult: number, totalNumberOfChildResult = 5): IQueryResult {
    var childResults: IQueryResult[] = [];
    for (var i = 0; i < numberOfChildResult; i++) {
      childResults.push(FakeResults.createFakeResult(token + '-child' + i));
    }
    var ret = FakeResults.createFakeResult(token);
    ret.totalNumberOfChildResults = totalNumberOfChildResult;
    ret = _.extend(ret, { childResults: childResults });
    return ret;
  }

  static createFakeResultWithAttachments(
    token = 'test',
    numberOfAttachments = 3,
    attachmentType = ['xml', 'pdf', 'txt'],
    flags = 'HasThumbnail',
    attachmentsFlags = ['IsAttachment', 'IsAttachment', 'IsAttachment'],
    withSubAttachments = false
  ): IQueryResult {
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
        fake.attachments[index].raw['filetype'] = type;
      }
    });
    _.each(attachmentsFlags, (flag, index, list) => {
      if (fake.attachments[index] != undefined) {
        fake.attachments[index].flags = flag;
      }
    });
    return fake;
  }

  static createFakeGroupByResult(field: string, token: string, count: number, includeComputedValues?: boolean): IGroupByResult {
    Assert.isNonEmptyString(field);
    Assert.isNonEmptyString(token);
    Assert.isLargerOrEqualsThan(0, count);

    var groupByValues: IGroupByValue[] = [];
    for (var i = 0; i < count; ++i) {
      groupByValues.push(
        FakeResults.createFakeGroupByValue(token + i.toString(), i + 1, 100 + i, includeComputedValues ? 1000 + i : undefined)
      );
    }

    return {
      field: field,
      values: groupByValues
    };
  }

  static createFakeRangeGroupByResult(field: string, start = 1, end = 100, steps = 25): IGroupByResult {
    var groupByValues: IGroupByValue[] = [];
    for (var i = start; i <= end; i += steps) {
      groupByValues.push(FakeResults.createFakeGroupByRangeValue(i, i + (steps - 1), 'foobar' + i.toString(), i));
    }
    return {
      field: field,
      values: groupByValues
    };
  }

  static createFakeHierarchicalValue(token: string, currentLevel: number, delimitingCharacter = '|') {
    let value = `level:${currentLevel.toString()}--value:${token}`;
    if (currentLevel != 0) {
      for (var i = currentLevel - 1; i >= 0; i--) {
        value = `level:${i.toString()}--value:${token}${delimitingCharacter}${value}`;
      }
    }
    return value;
  }

  static createFakeHierarchicalGroupByResult(
    field: string,
    token: string,
    numberOfLevel = 2,
    countByLevel = 3,
    delimitingCharacter = '|',
    includeComputedValues = false,
    weirdCasing = true
  ): IGroupByResult {
    var groupByValues: IGroupByValue[] = [];
    // i == level
    for (var i = 0; i < numberOfLevel; ++i) {
      // j == values on current level
      for (var j = 0; j < countByLevel; j++) {
        let currentValue = FakeResults.createFakeHierarchicalValue(`${token}${j.toString()}`, i);
        if (weirdCasing) {
          currentValue = _.map(currentValue.split(delimitingCharacter), (value, k) =>
            (i + j + k) % 2 == 0 ? value.toLowerCase() : value.toUpperCase()
          ).join(delimitingCharacter);
        }
        var currentGroupByValue = FakeResults.createFakeGroupByValue(currentValue, j + 1, 100, includeComputedValues ? 1000 : undefined);
        groupByValues.push(currentGroupByValue);
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
    };
  }

  static createFakeGroupByRangeValue(
    from: number,
    to: number,
    token: string,
    count: number,
    score?: number,
    computedValue?: number
  ): IGroupByValue {
    return {
      value: from + '..' + to,
      lookupValue: token,
      numberOfResults: count,
      score: score || count * 2,
      computedFieldResults: computedValue ? [computedValue] : undefined
    };
  }

  static createFakeCategoryFacetResult(field: string, path: string[], token = 'value', numberOfValues: number = 10): ICategoryFacetResult {
    Assert.isNonEmptyString(field);
    return {
      field,
      values: range(0, numberOfValues).map(number => {
        return { value: token + number, numberOfResults: 5 };
      }),
      parentValues: range(0, numberOfValues).map(number => {
        return { value: 'parent' + number, numberOfResults: number + 250 * number };
      })
    };
  }

  static createFakeFieldValue(token: string, count: number): IIndexFieldValue {
    Assert.isNonEmptyString(token);

    return {
      value: token,
      lookupValue: token,
      numberOfResults: count
    };
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

  static createFakeFeedItemResult(token: string, nbLikes: number = 0, nbTopics: number = 0, hasAttachment: boolean = false) {
    var result = this.createFakeResult(token);
    result.raw.sfparentid = 'parentid';
    result.raw.sfparentname = 'parentname';
    result.raw.sffeeditemid = token + 'id';
    result.clickUri = 'myURI/' + result.raw.sffeeditemid;
    result.raw.sfcreatedby = 'createdby';
    result.raw.sfcreatedbyname = 'createdby';
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
      result.raw.sftitle = 'fileName';
      result.raw.sf_title = 'fileName';
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
      originContext: 'context',
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
      contextual: false,
      clientId: token + 'clientId'
    };
  }

  static createFakeClickEvent(token = 'foo'): IClickEvent {
    return {
      actionCause: token + 'actionCause',
      actionType: token + 'actionType',
      device: token + 'device',
      mobile: false,
      originLevel1: token + 'originLevel1',
      originLevel2: token + 'originLevel2',
      originContext: 'context',
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
      rankingModifier: token + 'rankingModifier',
      clientId: token + 'clientId'
    };
  }

  static createPopulateOmniboxEventArgs(
    queryboxContent: string,
    cursorPosition: number,
    rows: IOmniboxDataRow[] = []
  ): IPopulateOmniboxEventArgs {
    return {
      completeQueryExpression: { word: queryboxContent, regex: new RegExp(queryboxContent, 'gi') },
      allQueryExpressions: undefined,
      currentQueryExpression: { word: queryboxContent, regex: new RegExp(queryboxContent, 'gi') },
      cursorPosition: cursorPosition,
      rows: [],
      clear: () => {},
      clearCurrentExpression: () => {},
      closeOmnibox: () => {},
      insertAt: () => {},
      replace: () => {},
      replaceCurrentExpression: () => {}
    };
  }

  static createRankingInfoNoKeywords() {
    return `Document weights:
    Title: 0; Quality: 180; Date: 405; Adjacency: 0; Source: 500; Custom: 400; Collaborative rating: 0; QRE: 890; Ranking functions: 0;

    Total weight: 2375`;
  }

  static createRankingInfoWithKeywords() {
    return `Document weights:\nTitle: 800; Quality: 180; Date: 101; Adjacency: 0; Source: 500; Custom: 350; Collaborative rating: 0; QRE: 2500; Ranking functions: 0; \n\nTerms weights:\ntest: 100, 26; \nTitle: 800; Concept: 0; Summary: 300; URI: 500; Formatted: 0; Casing: 0; Relation: 200; Frequency: 1744; \n\nTotal weight: 7975`;
  }

  static createRankingInforWithQRE() {
    return `Document weights:\nTitle: 0; Quality: 180; Date: 0; Adjacency: 0; Source: 500; Custom: 350; Collaborative rating: 0; QRE: 2500; Ranking functions: 0; \nQRE:\nExpression: \"@permanentid=95ad18de4cb8e17023f0224e9d44dd2f7177c6dceac6cb81b16f3659a3c3\" Score: 2500\nExpression: \"@permanentid=4119a14f02a63d0c2d92b51d4501dd83580831caea327179934dd1bc6645\" Score: -1000\nExpression: \"@permanentid=39ce64557bee624c368c6cfe736787f1dd22667f43a9f3e46fafa67158d6\" Score: 0\nExpression: \"@permanentid=0d4e5fe9dca91c13d9de061c0c00d1a2733e0a1c0e198c588c2b93cfcd25\" Score: 0\nExpression: \"@permanentid=c612db560ef1f77316b6c11fbedfa3e9b728e09859a188639911aef9e6ea\" Score: 0\nRanking Functions:\n\nTotal weight: 3530`;
  }

  static createFieldDescription(): IFieldDescription {
    return {
      name: 'foo',
      type: 'String',
      splitGroupByField: false,
      groupByField: true,
      sortByField: true,
      includeInResults: true,
      includeInQuery: true,
      fieldType: 'String',
      fieldSourceType: null,
      defaultValue: null,
      description: 'a description'
    };
  }

  static createFakePlanResponse(): IPlanResponse {
    return {
      preprocessingOutput: {
        triggers: [{ type: 'redirect', content: 'https://www.coveo.com/fr/solutions/commerce' }]
      },
      parsedInput: {
        basicExpression: 'commerce',
        largeExpression: 'coveo commerce solutions'
      }
    };
  }
}

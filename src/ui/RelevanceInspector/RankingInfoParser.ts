import { object, map, keys, reduce } from 'underscore';
import { StringUtils } from '../../utils/StringUtils';
import { $$, Dom } from '../../utils/Dom';

export interface IRankingInfo {
  documentWeights: IListOfWeights;
  totalWeight: number;
  termsWeight: IListOfTermsWeights;
  qreWeights: IListOfQRE[];
}

export interface IListOfWeights {
  Adjacency: number;
  'Collaborative rating': number;
  Custom: number;
  Date: number;
  QRE: number;
  Quality: number;
  'Ranking functions': number;
  Source: number;
  Title: number;
  [key: string]: number;
}

export interface IListOfQRE {
  expression: string;
  score: number;
}

export type IListOfTermsWeights = Record<string, IWeightsPerTerm>;

export interface IWeightsPerTerm {
  Weights: IWeightsPerTermBreakdown;
  terms: Record<string, IWeightsPerTermPerDocument>;
}

export interface IWeightsPerTermBreakdown {
  Casing: number;
  Concept: number;
  Formatted: number;
  Frequency: number;
  Relation: number;
  Summary: number;
  Title: number;
  URI: number;
  [key: string]: number;
}

export interface IWeightsPerTermPerDocument {
  Correlation: number;
  'TF-IDF': number;
}

export const buildListOfTermsElement = (weightPerTerm: IWeightsPerTermBreakdown): Dom => {
  const listItems = map(weightPerTerm, (value, key) => {
    return {
      dt: $$(
        'dt',
        {
          className: 'coveo-relevance-inspector-dt'
        },
        `${key}`
      ),
      dd: $$(
        'dd',
        {
          className: 'coveo-relevance-inspector-dd'
        },
        `${value}`
      )
    };
  });
  const total = reduce(weightPerTerm, (memo, value) => memo + value, 0);
  const list = $$('dl');
  listItems.forEach(item => {
    list.append(item.dt.el);
    list.append(item.dd.el);
  });
  list.append($$('dt', { className: 'coveo-relevance-inspector-dt' }, `Total`).el);
  list.append($$('dd', { className: 'coveo-relevance-inspector-dd coveo-relevance-inspector-highlight' }, `${total}`).el);
  return list;
};

export const parseRankingInfo = (value: string): IRankingInfo | null => {
  const REGEX_EXTRACT_DOCUMENT_WEIGHTS = /Document weights:\n((?:.)*?)\n+/g;
  const REGEX_EXTRACT_TERMS_WEIGHTS = /Terms weights:\n((?:.|\n)*)\n+/g;
  const REGEX_EXTRACT_TOTAL_WEIGHTS = /Total weight: ([0-9]+)/g;

  if (value) {
    const docWeightsRegexResult = REGEX_EXTRACT_DOCUMENT_WEIGHTS.exec(value);
    const termsWeightRegexResult = REGEX_EXTRACT_TERMS_WEIGHTS.exec(value);
    const totalWeigthRegexResult = REGEX_EXTRACT_TOTAL_WEIGHTS.exec(value);

    const qreWeights = parseQREWeights(value);
    const documentWeights = parseWeights(docWeightsRegexResult ? docWeightsRegexResult[1] : null);
    const termsWeight = parseTermsWeights(termsWeightRegexResult);
    const totalWeight = totalWeigthRegexResult ? Number(totalWeigthRegexResult[1]) : null;

    return {
      documentWeights,
      termsWeight,
      totalWeight,
      qreWeights
    };
  }
  return null;
};

const parseWeights = (value: string | null): IListOfWeights | null => {
  const REGEX_EXTRACT_LIST_OF_WEIGHTS = /(\w+(?:\s\w+)*): ([-0-9]+)/g;
  const REGEX_EXTRACT_WEIGHT_GROUP = /^(\w+(?:\s\w+)*): ([-0-9]+)$/;

  if (value) {
    const listOfWeight = value.match(REGEX_EXTRACT_LIST_OF_WEIGHTS);

    if (listOfWeight) {
      return object(
        listOfWeight.map(weight => {
          let weightGroup = weight.match(REGEX_EXTRACT_WEIGHT_GROUP);

          if (weightGroup) {
            const weightAppliedOn = weightGroup[1];
            const weightValue = weightGroup[2];
            return [weightAppliedOn, Number(weightValue)];
          }
          return null;
        })
      ) as IListOfWeights;
    }
  }

  return null;
};

const parseTermsWeights = (termsWeight: RegExpExecArray | null): IListOfTermsWeights | null => {
  const REGEX_EXTRACT_GROUP_OF_TERMS = /((?:[^:]+: [0-9]+, [0-9]+; )+)\n((?:\w+: [0-9]+; )+)/g;
  const REGEX_EXTRACT_SINGLE_TERM = /([^:]+): ([0-9]+), ([0-9]+); /g;

  if (termsWeight && termsWeight[1]) {
    let terms = StringUtils.match(termsWeight[1], REGEX_EXTRACT_GROUP_OF_TERMS);

    return (object(
      map(terms, term => {
        let words = object(
          map(StringUtils.match(term[1], REGEX_EXTRACT_SINGLE_TERM), word => {
            return [
              word[1],
              {
                Correlation: Number(word[2]),
                'TF-IDF': Number(word[3])
              }
            ];
          })
        );
        const weights = parseWeights(term[2]);
        return [
          keys(words).join(', '),
          {
            terms: words,
            Weights: weights
          }
        ];
      })
    ) as any) as IListOfTermsWeights;
  }
  return null;
};

const parseQREWeights = (value: string): IListOfQRE[] => {
  const REGEX_EXTRACT_QRE_WEIGHTS = /(Expression:\s".*")\sScore:\s(?!0)([0-9]+)\n+/g;

  let qreWeightsRegexResult = REGEX_EXTRACT_QRE_WEIGHTS.exec(value);

  const qreWeights: IListOfQRE[] = [];
  while (qreWeightsRegexResult) {
    qreWeights.push({
      expression: qreWeightsRegexResult[1],
      score: parseInt(qreWeightsRegexResult[2], 10)
    });
    qreWeightsRegexResult = REGEX_EXTRACT_QRE_WEIGHTS.exec(value);
  }

  return qreWeights;
};

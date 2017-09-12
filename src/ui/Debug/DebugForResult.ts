import { IQueryResult } from '../../rest/QueryResult';
import { IFieldDescription } from '../../rest/FieldDescription';
import { IComponentBindings } from '../Base/ComponentBindings';
import { IStringMap } from '../../rest/GenericParam';
import { StringUtils } from '../../utils/StringUtils';
import * as _ from 'underscore';

export class DebugForResult {
  private fields: { [field: string]: IFieldDescription };

  constructor(public bindings: IComponentBindings) {}

  public generateDebugInfoForResult(result: IQueryResult) {
    return {
      result: result,
      fields: () => this.buildFieldsSection(result),
      rankingInfo: () => this.buildRankingInfoSection(result)
    };
  }

  private fetchFields(): Promise<{ [field: string]: IFieldDescription }> {
    if (this.fields == null) {
      return this.bindings.queryController
        .getEndpoint()
        .listFields()
        .then((fields: IFieldDescription[]) => {
          this.fields = {};
          fields.forEach(field => {
            this.fields[field.name] = field;
          });
          return this.fields;
        });
    } else {
      return Promise.resolve(this.fields);
    }
  }

  private buildRankingInfoSection(result: IQueryResult) {
    return result.rankingInfo && this.parseRankingInfo(result.rankingInfo);
  }

  private parseWeights(value: string) {
    let listOfWeight = value.match(/(\w+(?:\s\w+)*): ([-0-9]+)/g);
    return _.object(
      _.map(listOfWeight, weight => {
        let weightGroup = weight.match(/^(\w+(?:\s\w+)*): ([-0-9]+)$/);
        return [weightGroup[1], Number(weightGroup[2])];
      })
    );
  }

  private buildFieldsSection(result: IQueryResult) {
    return this.fetchFields().then((fieldDescriptions: IStringMap<IFieldDescription>) => {
      let fields = {};
      _.each(result.raw, (value: any, key: string) => {
        let fieldDescription = fieldDescriptions['@' + key];
        if (fieldDescription == null && key.match(/^sys/)) {
          fieldDescription = fieldDescriptions['@' + key.substr(3)];
        }
        if (fieldDescription == null) {
          fields['@' + key] = value;
        } else if (fieldDescription.fieldType == 'Date') {
          fields['@' + key] = new Date(value);
        } else if (fieldDescription.splitGroupByField && _.isString(value)) {
          fields['@' + key] = value.split(/\s*;\s*/);
        } else {
          fields['@' + key] = value;
        }
      });
      return fields;
    });
  }

  private parseRankingInfo(value: string) {
    let rankingInfo = {};
    if (value) {
      let documentWeights = /Document weights:\n((?:.)*?)\n+/g.exec(value);
      let termsWeight = /Terms weights:\n((?:.|\n)*)\n+/g.exec(value);
      let totalWeight = /Total weight: ([0-9]+)/g.exec(value);

      if (documentWeights && documentWeights[1]) {
        rankingInfo['Document weights'] = this.parseWeights(documentWeights[1]);
      }

      if (totalWeight && totalWeight[1]) {
        rankingInfo['Total weight'] = Number(totalWeight[1]);
      }

      if (termsWeight && termsWeight[1]) {
        let terms = StringUtils.match(termsWeight[1], /((?:[^:]+: [0-9]+, [0-9]+; )+)\n((?:\w+: [0-9]+; )+)/g);
        rankingInfo['Terms weights'] = _.object(
          _.map(terms, term => {
            let words = _.object(
              _.map(StringUtils.match(term[1], /([^:]+): ([0-9]+), ([0-9]+); /g), word => {
                return [
                  word[1],
                  {
                    Correlation: Number(word[2]),
                    'TF-IDF': Number(word[3])
                  }
                ];
              })
            );
            let weights = this.parseWeights(term[2]);
            return [
              _.keys(words).join(', '),
              {
                terms: words,
                Weights: weights
              }
            ];
          })
        );
      }
    }

    return rankingInfo;
  }
}

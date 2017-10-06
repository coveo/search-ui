///<reference path='Omnibox.ts'/>
import { Omnibox, IOmniboxSuggestion, MagicBox } from './Omnibox';
import { OmniboxEvents, IPopulateOmniboxSuggestionsEventArgs } from '../../events/OmniboxEvents';
import { IFieldDescription } from '../../rest/FieldDescription';
import { IEndpointError } from '../../rest/EndpointError';
import * as _ from 'underscore';

interface IFieldAddonHash {
  type: string;
  before: string;
  after: string;
  current: string;
  field?: string;
}

export class FieldAddon {
  static INDEX = 64;
  cache: { [hash: string]: Promise<IOmniboxSuggestion[]> } = {};

  constructor(public omnibox: Omnibox) {
    this.omnibox.bind.on(this.omnibox.element, OmniboxEvents.populateOmniboxSuggestions, (args: IPopulateOmniboxSuggestionsEventArgs) => {
      args.suggestions.push(this.getSuggestion());
    });
  }

  public getSuggestion(): Promise<IOmniboxSuggestion[]> {
    const hash = this.getHash();
    if (hash == null) {
      return null;
    }
    const hashString = this.hashToString(hash);
    if (this.cache[hashString] != null) {
      return this.hashValueToSuggestion(hash, this.cache[hashString]);
    }
    let values: Promise<IOmniboxSuggestion[]>;
    if (hash.type == 'FieldName') {
      values = this.fieldNames(hash.current);
    }
    if (hash.type == 'FieldValue') {
      values = this.fieldValues(hash.field, hash.current);
    }
    if (hash.type == 'SimpleFieldName') {
      values = this.simpleFieldNames(hash.current);
    }
    this.cache[hashString] = values;
    values.catch(() => {
      delete this.cache[hashString];
    });
    return this.hashValueToSuggestion(hash, values);
  }

  private getHash(): IFieldAddonHash {
    let fieldName: Coveo.MagicBox.Result = _.last(this.omnibox.resultAtCursor('FieldName'));
    if (fieldName != null) {
      fieldName = fieldName.findParent('Field') || fieldName;
      const currentField = fieldName.toString();
      const before = fieldName.before();
      const after = fieldName.after();
      return { type: 'FieldName', current: currentField, before: before, after: after };
    }
    const fieldValue: Coveo.MagicBox.Result = _.last(this.omnibox.resultAtCursor('FieldValue'));
    if (fieldValue) {
      const fieldQuery =
        fieldValue.findParent('FieldQuery') || (this.omnibox.options.enableSimpleFieldAddon && fieldValue.findParent('FieldSimpleQuery'));
      if (fieldQuery) {
        let field = fieldQuery.find('FieldName').toString();
        if (this.omnibox.options.fieldAlias) {
          if (field in this.omnibox.options.fieldAlias) {
            field = this.omnibox.options.fieldAlias[field];
          }
        }
        const value = fieldValue.toString();
        const before = fieldValue.before();
        const after = fieldValue.after();
        return { type: 'FieldValue', field: field, current: value, before: before, after: after };
      }
    }
    if (this.omnibox.options.enableSimpleFieldAddon) {
      const word: Coveo.MagicBox.Result = _.last(this.omnibox.resultAtCursor('Word'));
      if (word != null) {
        const currentField = word.toString();
        const before = word.before();
        const after = word.after();
        return { type: 'SimpleFieldName', current: currentField, before: before, after: after };
      }
    }
  }

  private hashToString(hash: IFieldAddonHash) {
    if (hash == null) {
      return null;
    }
    return hash.type + hash.current + (hash.field || '');
  }

  private hashValueToSuggestion(hash: IFieldAddonHash, promise: Promise<IOmniboxSuggestion[]>): Promise<IOmniboxSuggestion[]> {
    return promise.then(values => {
      const suggestions = _.map<any, IOmniboxSuggestion>(values, (value: string, i): IOmniboxSuggestion => {
        const suggestion: IOmniboxSuggestion = {
          text:
            hash.before +
            (hash.current.toLowerCase().indexOf(value.toLowerCase()) == 0 ? hash.current + value.substr(hash.current.length) : value) +
            hash.after,
          html: MagicBox.Utils.highlightText(value, hash.current, true),
          index: FieldAddon.INDEX - i / values.length
        };
        return suggestion;
      });
      return suggestions;
    });
  }

  private fields: Promise<IOmniboxSuggestion[]>;

  private getFields(): Promise<IOmniboxSuggestion[]> {
    if (this.fields == null) {
      this.fields = new Promise<any[]>((resolve, reject) => {
        if (this.omnibox.options.listOfFields != null) {
          resolve(<string[]>this.omnibox.options.listOfFields);
        } else {
          const promise: Promise<IFieldDescription[] | IEndpointError> = this.omnibox.queryController.getEndpoint().listFields();
          promise
            .then((fieldDescriptions: IFieldDescription[]) => {
              const fieldNames = _.chain(fieldDescriptions)
                .filter((fieldDescription: IFieldDescription) => fieldDescription.includeInQuery && fieldDescription.groupByField)
                .map((fieldDescription: IFieldDescription) => fieldDescription.name.substr(1))
                .value();

              resolve(fieldNames);
            })
            .catch(() => {
              reject();
            });
        }
      });
    }
    return this.fields;
  }

  private fieldNames(current: string): Promise<IOmniboxSuggestion[]> {
    const withAt = current.length > 0 && current[0] == '@';
    const fieldName = withAt ? current.substr(1) : current;
    const fieldNameLC = fieldName.toLowerCase();

    return this.getFields().then((fields: string[] | IOmniboxSuggestion[]): any[] => {
      let matchFields = _.chain(fields)
        .map((field: any) => {
          return {
            index: field.toLowerCase().indexOf(fieldNameLC),
            field: withAt ? field : '@' + field
          };
        })
        .filter(field => {
          return field.index != -1 && field.field.length > current.length;
        })
        .sortBy('index')
        .map(field => field.field)
        .value();
      matchFields = _.first(matchFields, 5);
      return matchFields;
    });
  }

  private fieldValues(field: string, current: string): Promise<any[]> {
    return this.omnibox.queryController
      .getEndpoint()
      .listFieldValues({
        pattern: '.*' + current + '.*',
        patternType: 'RegularExpression',
        sortCriteria: 'occurrences',
        field: '@' + field,
        maximumNumberOfValues: 5
      })
      .then(values => {
        return _.chain(values)
          .map(value => {
            return {
              index: value.value.toLowerCase().indexOf(current),
              value: value.value
            };
          })
          .filter(value => {
            return value.value.length > current.length;
          })
          .sortBy('index')
          .map(value => {
            return value.value.replace(/ /g, '\u00A0');
          })
          .value();
      });
  }

  private simpleFieldNames(current: string): Promise<IOmniboxSuggestion[]> {
    const fieldName = current;
    const fieldNameLC = fieldName.toLowerCase();

    return this.getFields().then((fields: any[]): IOmniboxSuggestion[] => {
      let matchFields: any = _.chain(fields)
        .map((field: string) => {
          return {
            index: field.toLowerCase().indexOf(fieldNameLC),
            field: field + ':'
          };
        })
        .filter(field => {
          return field.index != -1 && field.field.length > current.length;
        })
        .sortBy('index')
        .map(field => field.field)
        .value();
      matchFields = _.first(matchFields, 5);
      return matchFields;
    });
  }
}

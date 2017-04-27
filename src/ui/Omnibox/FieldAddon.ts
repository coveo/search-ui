///<reference path='Omnibox.ts'/>
import {Omnibox, IPopulateOmniboxSuggestionsEventArgs, IOmniboxSuggestion} from './Omnibox';
import {OmniboxEvents} from '../../events/OmniboxEvents';
import {IFieldDescription} from '../../rest/FieldDescription';
import {IEndpointError} from '../../rest/EndpointError';
import _ = require('underscore');

interface IFieldAddonHash {
  type: string;
  before: string;
  after: string;
  current: string;
  field?: string
}

export class FieldAddon {
  static INDEX = 64;

  cache: { [hash: string]: Promise<string[]> } = {};

  constructor(public omnibox: Omnibox) {
    this.omnibox.bind.on(this.omnibox.element, OmniboxEvents.populateOmniboxSuggestions, (args: IPopulateOmniboxSuggestionsEventArgs) => {
      args.suggestions.push(this.getSuggestion());
    })
  }

  public getSuggestion(): Promise<IOmniboxSuggestion[]> {
    var hash = this.getHash();
    if (hash == null) {
      return null;
    }
    var hashString = this.hashToString(hash);
    if (this.cache[hashString] != null) {
      return this.hashValueToSuggestion(hash, this.cache[hashString]);
    }
    var values: Promise<IOmniboxSuggestion[]>;
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
    })
    return this.hashValueToSuggestion(hash, values);
  }

  private getHash(): IFieldAddonHash {
    var fieldName: Coveo.MagicBox.Result = _.last(this.omnibox.resultAtCursor('FieldName'));
    if (fieldName != null) {
      fieldName = fieldName.findParent('Field') || fieldName;
      var currentField = fieldName.toString();
      var before = fieldName.before();
      var after = fieldName.after();
      return { type: 'FieldName', current: currentField, before: before, after: after };
    }
    var fieldValue: Coveo.MagicBox.Result = _.last(this.omnibox.resultAtCursor('FieldValue'));
    if (fieldValue) {
      var fieldQuery = fieldValue.findParent('FieldQuery') || (this.omnibox.options.enableSimpleFieldAddon && fieldValue.findParent('FieldSimpleQuery'));
      if (fieldQuery) {
        var field = fieldQuery.find('FieldName').toString();
        if (this.omnibox.options.fieldAlias) {
          if (field in this.omnibox.options.fieldAlias) {
            field = this.omnibox.options.fieldAlias[field];
          }
        }
        var value = fieldValue.toString();
        var before = fieldValue.before();
        var after = fieldValue.after();
        return { type: 'FieldValue', field: field, current: value, before: before, after: after };
      }
    }
    if (this.omnibox.options.enableSimpleFieldAddon) {
      var word: Coveo.MagicBox.Result = _.last(this.omnibox.resultAtCursor('Word'));
      if (word != null) {
        var currentField = word.toString();
        var before = word.before();
        var after = word.after();
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

  private hashValueToSuggestion(hash: IFieldAddonHash, promise: Promise<string[]>): Promise<IOmniboxSuggestion[]> {
    return promise.then((values) => {
      var suggestions: IOmniboxSuggestion[] = _.map(values, (value: string, i) => {
        return {
          text: hash.before + (hash.current.toLowerCase().indexOf(value.toLowerCase()) == 0 ? hash.current + value.substr(hash.current.length) : value) + hash.after,
          html: Coveo.MagicBox.Utils.highlightText(value, hash.current, true),
          index: FieldAddon.INDEX - i / values.length
        }
      });
      return suggestions;
    });
  }

  private fields: Promise<string[]>;

  private getFields(): Promise<string[]> {
    if (this.fields == null) {
      this.fields = new Promise<string[]>((resolve, reject) => {
        if (this.omnibox.options.listOfFields != null) {
          resolve(this.omnibox.options.listOfFields);
        } else {
          var promise: Promise<IFieldDescription[] | IEndpointError> = this.omnibox.queryController.getEndpoint().listFields();
          promise.then((fieldDescriptions: IFieldDescription[]) => {
            var fieldNames = _.chain(fieldDescriptions)
              .filter((fieldDescription: IFieldDescription) => fieldDescription.includeInQuery && fieldDescription.groupByField)
              .map((fieldDescription: IFieldDescription) => fieldDescription.name.substr(1))
              .value();

            resolve(fieldNames);
          }).catch(() => {
            reject();
          });
        }
      })
    }
    return this.fields;
  }

  private fieldNames(current: string): Promise<IOmniboxSuggestion[]> {
    var withAt = current.length > 0 && current[0] == '@'
    var fieldName = withAt ? current.substr(1) : current;
    var fieldNameLC = fieldName.toLowerCase();

    return this.getFields().then((fields: string[]) => {
      var matchFields = _.chain(fields)
        .map((field: string) => {
          return {
            index: field.toLowerCase().indexOf(fieldNameLC),
            field: withAt ? '@' + field : field
          };
        })
        .filter((field) => {
          return field.index != -1 && field.field.length > current.length;
        })
        .sortBy('index')
        .map((field) => field.field)
        .value();
      matchFields = _.first(matchFields, 5);
      return matchFields;
    })
  }

  private fieldValues(field: string, current: string): Promise<IOmniboxSuggestion[]> {
    return this.omnibox.queryController.getEndpoint().listFieldValues({
      pattern: '.*' + current + '.*',
      patternType: 'RegularExpression',
      sortCriteria: 'occurrences',
      field: '@' + field,
      maximumNumberOfValues: 5
    }).then((values) => {
      return _.chain(values)
        .map((value) => {
          return {
            index: value.value.toLowerCase().indexOf(current),
            value: value.value
          };
        })
        .filter((value) => {
          return value.value.length > current.length;
        })
        .sortBy('index')
        .map((value) => {
          return value.value.replace(/ /g, '\u00A0');
        })
        .value();
    })
  }

  private simpleFieldNames(current: string): Promise<IOmniboxSuggestion[]> {
    var fieldName = current;
    var fieldNameLC = fieldName.toLowerCase();

    return this.getFields().then((fields: string[]) => {
      var matchFields = _.chain(fields)
        .map((field: string) => {
          return {
            index: field.toLowerCase().indexOf(fieldNameLC),
            field: field + ':'
          };
        })
        .filter((field) => {
          return field.index != -1 && field.field.length > current.length;
        })
        .sortBy('index')
        .map((field) => field.field)
        .value();
      matchFields = _.first(matchFields, 5);
      return matchFields;
    })
  }
}

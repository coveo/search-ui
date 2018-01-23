///<reference path='Omnibox.ts'/>
import { OmniboxEvents, IPopulateOmniboxSuggestionsEventArgs } from '../../events/OmniboxEvents';
import { Omnibox, IOmniboxSuggestion, MagicBox } from './Omnibox';
import { IExtension } from '../../rest/Extension';
import * as _ from 'underscore';

interface IQueryExtensionAddonHash {
  type: string;
  before: string;
  after: string;
  current: string;
  name?: string;
  used?: string[];
}

export class QueryExtensionAddon {
  static INDEX = 62;

  cache: { [hash: string]: Promise<string[]> } = {};

  constructor(public omnibox: Omnibox) {
    this.omnibox.bind.on(this.omnibox.element, OmniboxEvents.populateOmniboxSuggestions, (args: IPopulateOmniboxSuggestionsEventArgs) => {
      args.suggestions.push(this.getSuggestion());
    });
  }

  public getSuggestion(): Promise<IOmniboxSuggestion[]> {
    var hash = this.getHash(this.omnibox.magicBox);
    if (hash == null) {
      return null;
    }
    var hashString = this.hashToString(hash);
    if (this.cache[hashString] != null) {
      return this.hashValueToSuggestion(hash, this.cache[hashString]);
    }
    var values = hash.type == 'QueryExtensionName' ? this.names(hash.current) : this.attributeNames(hash.name, hash.current, hash.used);
    this.cache[hashString] = values;
    values.catch(() => {
      delete this.cache[hashString];
    });
    return this.hashValueToSuggestion(hash, values);
  }

  private getHash(magicBox: Coveo.MagicBox.Instance): IQueryExtensionAddonHash {
    var queryExtension: Coveo.MagicBox.Result = _.last(magicBox.resultAtCursor('QueryExtension'));
    if (queryExtension != null) {
      var queryExtensionArgumentResults = queryExtension.findAll('QueryExtensionArgument');
      var current = _.last(magicBox.resultAtCursor('QueryExtensionName'));
      if (current != null) {
        return {
          type: 'QueryExtensionName',
          current: current.toString(),
          before: current.before(),
          after: current.after()
        };
      }

      current = _.last(magicBox.resultAtCursor('QueryExtensionArgumentName'));
      if (current != null) {
        var used: string[] = _.chain(queryExtensionArgumentResults)
          .map(result => {
            var name = result.find('QueryExtensionArgumentName');
            return name && name.toString();
          })
          .compact()
          .value();

        var name = queryExtension.find('QueryExtensionName').toString();

        return {
          type: 'QueryExtensionArgumentName',
          current: current.toString(),
          before: current.before(),
          after: current.after(),
          name: name,
          used: used
        };
      }
    }
    return null;
  }

  private hashToString(hash: IQueryExtensionAddonHash) {
    if (hash == null) {
      return null;
    }
    return [hash.type, hash.current, hash.name || '', hash.used ? hash.used.join() : ''].join();
  }

  private hashValueToSuggestion(hash: IQueryExtensionAddonHash, promise: Promise<string[]>): Promise<IOmniboxSuggestion[]> {
    return promise.then(values => {
      var suggestions: IOmniboxSuggestion[] = _.map(values, (value, i) => {
        return {
          html: MagicBox.Utils.highlightText(value, hash.current, true),
          text: hash.before + value + hash.after,
          index: QueryExtensionAddon.INDEX - i / values.length
        };
      });
      return suggestions;
    });
  }

  private extensions: Promise<any>;

  private getExtensions() {
    if (this.extensions == null) {
      this.extensions = this.omnibox.queryController.getEndpoint().extensions();
    }
    return this.extensions;
  }

  private names(current: string): Promise<string[]> {
    var extensionName = current.toLowerCase();
    return this.getExtensions().then((extensions: IExtension[]) => {
      var matchExtensions = _.chain(extensions)
        .map((extension: IExtension) => {
          return {
            index: extension.name.toLowerCase().indexOf(extensionName),
            extension: extension.name
          };
        })
        .filter(extension => {
          return extension.index != -1 && extension.extension.length > extensionName.length;
        })
        .sortBy('index')
        .pluck('extension')
        .value();
      matchExtensions = _.first(matchExtensions, 5);
      return matchExtensions;
    });
  }

  private attributeNames(name: string, current: string, used: string[]): Promise<string[]> {
    return this.getExtensions().then((extensions: IExtension[]) => {
      var extension = _.find(extensions, (extension: IExtension) => extension.name == name);
      if (extension == null) {
        return [];
      } else {
        return _.filter(_.difference(extension.argumentNames, used), (argumentName: string) => argumentName.indexOf(current) == 0);
      }
    });
  }

  public hash() {
    return;
  }
}

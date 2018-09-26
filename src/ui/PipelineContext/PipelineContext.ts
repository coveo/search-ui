import { Component } from '../Base/Component';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { Utils } from '../../utils/Utils';
import { QueryEvents, IBuildingQueryEventArgs } from '../../events/QueryEvents';
import { $$ } from '../../utils/Dom';
import { Initialization } from '../Base/Initialization';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';
import { Context, IPipelineContextProvider } from './PipelineGlobalExports';

declare const Coveo;

export interface IPipelineContextOptions {}

/**
 * A PipelineContext is used to add custom context information to a query (see [Adding Custom Context Information to Queries](https://docs.coveo.com/en/399)).
 *
 * This component is meant to be initialized with a script tag, possibly configuring it with JSON content.
 *
 * The values can be either string or string array.
 *
 * ```
 * <script class='CoveoPipelineContext' type='text/context'>
 *   {
 *      "foo" : "bar",
 *      "foobar" : ["foo", "bar"]
 *   }
 * </script>
 * ```
 *
 * Configuring the component within a script tag implies you will be able to leverage the interface editor.
 *
 * Once the component is created, you can also use JavaScript code to set/overwrite context values, using the {@link setContext} and {@link setContextValue} methods.
 *
 * Whether you configure the component within a script tag or using JavaScript code, the data is added to the [Query.Context]{@link IQuery.context} parameter.
 *
 * **Note:**
 *
 * This component also ensures that the framework properly determines the context in all corner cases, including when a standalone search box ([initSearchbox]{@link initSearchbox}) is displaying query suggestions.
 *
 * In most cases, if you do not use this component, the context will not be resolved and leveraged properly in the query pipeline (see [What Is a Query Pipeline?](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=252)).
 *
 */
export class PipelineContext extends Component implements IPipelineContextProvider {
  static ID = 'PipelineContext';
  static CURRENT_URL = 'CurrentUrl';

  static doExport = () => {
    exportGlobally({
      PipelineContext: PipelineContext
    });
  };

  private contextContent: Context = {};

  public constructor(public element: HTMLElement, public options?: IPipelineContextOptions, public bindings?: IComponentBindings) {
    super(element, PipelineContext.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, PipelineContext, options);
    this.setContext(
      $$(this.element)
        .text()
        .trim()
    );
    this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => this.handleBuildingQuery(args));
  }

  /**
   * **Available since the [December 2017 Release](https://docs.coveo.com/en/373).**
   *
   * Sets a new context, replacing the previous context if applicable.
   *
   * @param newContext The new context to set, which can be directly passed as a JSON, or as a stringified JSON.
   */
  public setContext(newContext: string | Context) {
    if (_.isString(newContext)) {
      const contextParsed = this.tryParseContextFromString(newContext);
      this.contextContent = contextParsed;
    } else {
      this.contextContent = newContext;
    }
  }

  /**
   * Returns the current context
   */
  public getContext(): Context {
    const keys = this.getContextKeys();
    return _.object(keys, _.map(keys, key => this.getContextValue(key)));
  }

  /**
   * **Available since the [December 2017 Release](https://docs.coveo.com/en/373).**
   *
   * Sets a value for a context key, replacing the previous value if applicable.
   * @param contextKey
   * @param contextValue
   */
  public setContextValue(contextKey: string, contextValue: string | string[]) {
    this.contextContent[contextKey] = contextValue;
  }

  /**
   * Return all the context keys configured for context.
   * @returns {string[]}
   */
  public getContextKeys(): string[] {
    return _.keys(this.contextContent);
  }

  /**
   * Get the context value associated to the given key.
   *
   * If the global variable Coveo.context contains the requested key, this method will return the value contained in Coveo.context instead of the one contained internally.
   *
   * This is especially useful in a Coveo for Salesforce context, where context values can be extracted from a backend service.
   * @param key
   * @returns {string}
   */
  public getContextValue(key: string): string | string[] {
    const contextValue = this.contextContent[key];
    if (_.isArray(contextValue)) {
      const contextValues = [];
      _.each(this.contextContent[key], value => {
        contextValues.push(this.getModifiedData(value));
      });
      return contextValues;
    } else if (_.isString(contextValue)) {
      return this.getModifiedData(contextValue);
    }
    return '';
  }

  private handleBuildingQuery(args: IBuildingQueryEventArgs) {
    let keys = this.getContextKeys();
    _.each(keys, (key: string) => {
      args.queryBuilder.addContextValue(key, this.getContextValue(key));
    });
  }

  private tryParseContextFromString(contextAsString: string): Context {
    if (_.isEmpty(contextAsString)) {
      return {};
    }
    try {
      // Context could be HTML encoded (eg: Coveo for Salesforce)
      return JSON.parse(Utils.decodeHTMLEntities(contextAsString));
    } catch (e) {
      try {
        return JSON.parse(contextAsString);
      } catch (e) {
        this.logger.error(`Error while trying to parse context from the PipelineContext component`, e);
        return null;
      }
    }
  }

  private getModifiedData(value: string) {
    /* We need to modify the data to escape special salesforce characters. eg: {! }
     If we find the matching value in the global Coveo.context variable, we return that one instead of the one present locally.
     So, concretely, the component could contain : 
     {
       "productName" : "{! productValueFromSalesforce }"
     }

     This means that in those case, we would try to access Coveo.context.productValueFromSalesforce (which would in theory be a "real" product value from salesforce, and not a placeholder/variable)
    */
    return value.replace(/\{\!([^\}]+)\}/g, (all: string, contextKey: string) => {
      const trimmedKey = contextKey.trim();
      if (Coveo.context && trimmedKey in Coveo.context) {
        return Coveo.context[trimmedKey];
      } else if (trimmedKey == PipelineContext.CURRENT_URL) {
        return window.location.href;
      }
      return '';
    });
  }
}

Initialization.registerAutoCreateComponent(PipelineContext);

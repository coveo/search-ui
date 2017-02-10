import { Component } from '../Base/Component';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { Utils } from '../../utils/Utils';
import { QueryEvents, IBuildingQueryEventArgs } from '../../events/QueryEvents';
import { $$ } from '../../utils/Dom';
import { Initialization } from '../Base/Initialization';
import _ = require('underscore');

export var context: any;
declare var Coveo;

export interface IPipelineContextOptions {
}

/**
 * A PipelineContext is used to add contextual information about the environment inside which the query is executed.
 *
 * It allows to pass arbitrary key values pairs ( think `JSON` ), which can then be leveraged by the [Query Pipeline](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=108),
 * or by Reveal.
 *
 * This can be any arbitrary information that you can use to contextualize the query and help Coveo improve relevance by returning results tailored to a specific context.
 *
 * This component is meant to be configured using a script tag, with a JSON content.
 *
 * ```
 * <script class='CoveoPipelineContext' type='text/context'>
 *   {
 *      "foo" : "bar"
 *   }
 * </script>
 * ```
 *
 * You can also simply use JavaScript code to pass context values, using the {@link QueryBuilder.addContextValue} method.
 *
 * This mean you do not necessarily need to use this component to pass context.
 * ```
 * Coveo.$$(root).on('buildingQuery', function(args) {
 *     args.queryBuilder.addContextValue('foo', 'bar');
 * })
 * ```
 *
 * Using this component as opposed to JavaScript code means you will be able to leverage the interface editor.
 *
 * Regardless of if you use this component or JavaScript to add context, both will add the needed data in the [Query.Context]{@link IQuery.context} parameter.
 */
export class PipelineContext extends Component {
  static ID = 'PipelineContext';
  static CURRENT_URL = 'CurrentUrl';

  private content: { [id: string]: string };

  public constructor(public element: HTMLElement, public options?: IPipelineContextOptions, public bindings?: IComponentBindings) {
    super(element, PipelineContext.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, PipelineContext, options);

    if (this.element.tagName.toLowerCase() == 'script') {
      try {
        // Content can be HTML encoded for special char ({!})
        this.content = JSON.parse(Utils.decodeHTMLEntities($$(this.element).text()));
      } catch (e) {
        try {
          this.content = JSON.parse($$(this.element).text());
        } catch (e) {
          return;
        }
      }
    }
    this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => this.handleBuildingQuery(args));
  }

  /**
   * Return all the context keys configured for context.
   * @returns {string[]|Array}
   */
  public getContextKeys(): string[] {
    return this.content ? _.keys(this.content) : [];
  }

  /**
   * Get the context value associated to the given key.
   * @param key
   * @returns {string}
   */
  public getContextValue(key: string): string {
    return this.content[key].replace(/\{\!([^\}]+)\}/g, (all: string, contextKey: string) => {
      if (Coveo.context != null && contextKey in Coveo.context) {
        return Coveo.context[contextKey];
      } else if (contextKey == PipelineContext.CURRENT_URL) {
        return window.location.href;
      }
      return '';
    });
  }

  private handleBuildingQuery(args: IBuildingQueryEventArgs) {
    let keys = this.getContextKeys();
    _.each(keys, (key: string) => {
      args.queryBuilder.addContextValue(key, this.getContextValue(key));
    });
  }


}

Initialization.registerAutoCreateComponent(PipelineContext);

import {Component} from '../Base/Component';
import {IComponentBindings} from '../Base/ComponentBindings';
import {ComponentOptions} from '../Base/ComponentOptions';
import {QueryEvents, IBuildingQueryEventArgs} from '../../events/QueryEvents';
import {Utils} from '../../utils/Utils';
import {Initialization} from '../Base/Initialization';

export var context: any;
declare var Coveo;

export interface IPipelineContextOptions {
}

export class PipelineContext extends Component {
  static ID = 'PipelineContext';
  static CURRENT_URL = 'CurrentUrl';

  private content: { [id: string]: string };

  public constructor(public element: HTMLElement, public options?: IPipelineContextOptions, public bindings?: IComponentBindings) {
    super(element, PipelineContext.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, PipelineContext, options);
    if ($(this.element).is('script')) {
      try {
        // Content can be HTML encoded for special SF char ({!})
        this.content = JSON.parse(Utils.decodeHTMLEntities($(this.element).text()));
      } catch (e) {
        try {
          this.content = JSON.parse($(this.element).text());
        } catch (e) {
          return;
        }
      }
    }
    this.bind.onRoot(QueryEvents.buildingQuery, (e: JQueryEventObject, args: IBuildingQueryEventArgs) => this.handleBuildingQuery(e, args))
  }

  private handleBuildingQuery(e: JQueryEventObject, args: IBuildingQueryEventArgs) {
    if (args.queryBuilder.context == null) {
      args.queryBuilder.context = {};
    }
    var keys = this.getContextKeys();
    _.each(keys, (key: string) => {
      args.queryBuilder.context[key] = this.getContextValue(key);
    });
  }

  public getContextKeys(): string[] {
    return this.content ? _.keys(this.content) : [];
  }

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
}

Initialization.registerAutoCreateComponent(PipelineContext);

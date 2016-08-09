import {Component} from '../Base/Component';
import {ComponentOptions} from '../Base/ComponentOptions';
import {IComponentBindings} from '../Base/ComponentBindings';
import {Initialization} from '../Base/Initialization';
import {Assert} from '../../misc/Assert';
import {ResultListEvents, IChangeLayoutEventArgs} from '../../events/ResultListEvents';
import {$$} from '../../utils/Dom';

export interface IResultLayoutOptions {
  defaultLayout: string;
}

/**
 * This component allows to change the ResultList layout.<br/>
 * By default, it provides 3 layouts, `list`, `card` and `table`.
 */
export class ResultLayout extends Component {
  static ID = 'ResultLayout'

  public static validLayouts = ['list', 'card', 'table'];

  private currentLayout: string;

  /**
   * @componentOptions
   */
  static options: IResultLayoutOptions = {
    /**
     * Specifies the default ResultList layout to use.<br/>
     * Possible values are `list`, `card` and `table`.<br/>
     * By default, it is set to `list`.
     */
    defaultLayout: ComponentOptions.buildStringOption({
      defaultValue: 'list',
      postProcessing: v => _.contains(ResultLayout.validLayouts, v) ? v : 'list'
    })
  }

  constructor(public element: HTMLElement, public options?: IResultLayoutOptions, bindings?: IComponentBindings) {
    super(element, ResultLayout.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, ResultLayout, options);

    Assert.exists(this.options.defaultLayout);

    this.currentLayout = this.options.defaultLayout;

    // TODO: remove this --------------------------------------------------
    const switchLayoutBtns = _.map(ResultLayout.validLayouts, l => {
      const btn = $$('button', undefined, l);
      btn.on('click', () => this.changeLayout(l));
      return btn.el;
    })
    _.each(switchLayoutBtns, btn => $$(this.element).prepend(btn));
    // --------------------------------------------------------------------
  }

  /**
   * Change the current layout.<br/>
   * @param layout The new layout. Available values are `list`, `card` and `table`.
   */
  public changeLayout(layout: string) {
    Assert.check(_.contains(ResultLayout.validLayouts, layout), 'Invalid layout');
    if (layout !== this.currentLayout) {
      this.bind.trigger(this.root, ResultListEvents.changeLayout, <IChangeLayoutEventArgs>{
        layout: layout
      })
      this.currentLayout = layout;
    }
  }

  public getCurrentLayout() {
    return this.currentLayout;
  }
}

Initialization.registerAutoCreateComponent(ResultLayout);

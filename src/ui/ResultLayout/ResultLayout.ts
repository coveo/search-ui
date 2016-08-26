import {Component} from '../Base/Component';
import {ComponentOptions} from '../Base/ComponentOptions';
import {IComponentBindings} from '../Base/ComponentBindings';
import {QueryEvents} from '../../events/QueryEvents';
import {Initialization} from '../Base/Initialization';
import {Assert} from '../../misc/Assert';
import {ResultListEvents, IChangeLayoutEventArgs} from '../../events/ResultListEvents';
import {ResultLayoutEvents, IResultLayoutPopulateArgs} from '../../events/ResultLayoutEvents';
import {$$} from '../../utils/Dom';
import {IQueryErrorEventArgs, IQuerySuccessEventArgs} from '../../events/QueryEvents';
import {QueryStateModel, QUERY_STATE_ATTRIBUTES} from '../../models/QueryStateModel';
import {MODEL_EVENTS, IAttributesChangedEventArg} from '../../models/Model';

export interface IResultLayoutOptions {
}

// Please keep ResultLayout.validLayouts in sync with this
export type ValidLayout = 'list' | 'card' | 'table';

/**
 * This component allows to switch between multiple {@ ResultList}s with
 * different layouts.<br/>
 */
export class ResultLayout extends Component {
  static ID = 'ResultLayout';

  // Please keep ValidLayout in sync with this
  public static validLayouts = ['list', 'card', 'table'];

  private currentLayout: string;
  private buttons: { [key: string]: HTMLElement };
  private resultLayoutSection: HTMLElement;

  /**
   * @componentOptions
   */
  static options: IResultLayoutOptions = {
  };

  // TODO: add sticky url parameter
  constructor(public element: HTMLElement, public options?: IResultLayoutOptions, bindings?: IComponentBindings) {
    super(element, ResultLayout.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, ResultLayout, options);

    this.buttons = {};

    this.bind.onQueryState(MODEL_EVENTS.CHANGE_ONE, QUERY_STATE_ATTRIBUTES.LAYOUT, this.handleQueryStateChanged.bind(this));
    this.bind.onRootElement(QueryEvents.querySuccess, (args: IQuerySuccessEventArgs) => this.handleQuerySuccess(args));
    this.bind.onRootElement(QueryEvents.queryError, (args: IQueryErrorEventArgs) => this.handleQueryError(args));

    this.resultLayoutSection = $$(this.element).closest('.coveo-result-layout-section');

    this.populate();
  }

  /**
   * Change the current layout.<br/>
   * @param layout The new layout. Available values are `list`, `card` and `table`.
   */
  public changeLayout(layout: ValidLayout) {
    Assert.check(_.contains(_.keys(this.buttons), layout), 'Layout not available or invalid');
    if (layout !== this.currentLayout || this.getModelValue() === '') {
      this.bind.trigger(this.root, ResultListEvents.changeLayout, <IChangeLayoutEventArgs>{
        layout: layout
      });
      if (this.currentLayout) {
        $$(this.buttons[this.currentLayout]).removeClass('coveo-selected');
      }
      $$(this.buttons[layout]).addClass('coveo-selected');
      this.setQsmValue(layout);
      this.currentLayout = layout;
    }

  }

  private handleQuerySuccess(args: IQuerySuccessEventArgs) {
    if (args.results.results.length === 0 || !this.shouldShowSelector()) {
      this.hide();
    } else {
      this.show();
    }
  }

  private handleQueryStateChanged(args: IAttributesChangedEventArg) {
    const modelLayout = this.getModelValue();
    const newLayout = _.find(_.keys(this.buttons), l => l === modelLayout);
    if (newLayout !== undefined) {
      this.changeLayout(<ValidLayout>newLayout);
    } else {
      this.changeLayout(<ValidLayout>_.keys(this.buttons)[0]);
    }
  }

  private handleQueryError(args: IQueryErrorEventArgs) {
    this.hide();
  }

  private populate() {
    let populateArgs: IResultLayoutPopulateArgs = { layouts: [] };
    $$(this.root).trigger(ResultLayoutEvents.populateResultLayout, populateArgs);
    _.each(populateArgs.layouts, l => Assert.check(_.contains(ResultLayout.validLayouts, l), 'Invalid layout'));
    if (!_.isEmpty(populateArgs.layouts)) {
      _.each(populateArgs.layouts, l => this.addButton(l));
      if (!this.shouldShowSelector()) {
        this.hide();
      }
    }
  }

  public getCurrentLayout() {
    return this.currentLayout;
  }

  private addButton(layout?: string) {
    if (_.keys(this.buttons).length === 0) {
      setTimeout(() => {
        // If the QSM doesn't have any value for layout (doesn't call a state-change), we set the
        // active layout to the first one.
        if (this.getModelValue() === '') {
          this.bind.oneRootElement(QueryEvents.querySuccess, () => this.changeLayout(<ValidLayout>layout));
        }
      });
    }
    const btn = $$('span', { className: 'coveo-result-layout-selector' }, layout);
    // TODO: Icon classname temporary
    btn.prepend($$('span', { className: 'coveo-icon coveo-sprites-checkbox-exclusion' }).el);
    if (layout === this.currentLayout) {
      btn.addClass('coveo-selected');
    }
    btn.on('click', () => this.changeLayout(<ValidLayout>layout));
    $$(this.element).append(btn.el);
    this.buttons[layout] = btn.el;
  }

  private hide() {
    const elem = this.resultLayoutSection || this.element;
    $$(elem).addClass('coveo-result-layout-hidden');
  }

  private show() {
    const elem = this.resultLayoutSection || this.element;
    $$(elem).removeClass('coveo-result-layout-hidden');
  }

  private getModelValue(): string {
    return this.queryStateModel.get(QueryStateModel.attributesEnum.layout);
  }

  private setQsmValue(val: string) {
    this.queryStateModel.set(QueryStateModel.attributesEnum.layout, val);
  }

  private shouldShowSelector() {
    return _.keys(this.buttons).length > 1;
  }
}

Initialization.registerAutoCreateComponent(ResultLayout);

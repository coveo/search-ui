import {Component} from '../Base/Component';
import {ComponentOptions} from '../Base/ComponentOptions';
import {IResultsComponentBindings} from '../Base/ResultsComponentBindings';
import {IQueryResult} from '../../rest/QueryResult';
import {ChatterUtils} from '../../utils/ChatterUtils';
import {Initialization} from '../Base/Initialization';
import {l} from '../../strings/Strings';
import {Utils} from '../../utils/Utils';
import {$$} from '../../utils/Dom';

export interface IChatterPostedByOption {
  enablePostedOn: boolean;
  useFromInstead: boolean;
  openInPrimaryTab: boolean;
  openInSubTab: boolean;
}

export class ChatterPostedBy extends Component {
  static ID = 'ChatterPostedBy';
  static options: IChatterPostedByOption = {
    enablePostedOn: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    useFromInstead: ComponentOptions.buildBooleanOption({ defaultValue: false }),
    openInPrimaryTab: ComponentOptions.buildBooleanOption({ defaultValue: false }),
    openInSubTab: ComponentOptions.buildBooleanOption({ defaultValue: true }),
  };

  static fields = [
    'sfcreatedby',
    'sfcreatedbyid',
    'sffeeditemid',
    'sfuserid',
    'sfinsertedbyid',
    'sfparentid',
    'sfparentname'
  ]

  constructor(public element: HTMLElement, public options?: IChatterPostedByOption, public bindings?: IResultsComponentBindings, public result?: IQueryResult) {
    super(element, ChatterPostedBy.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, ChatterPostedBy, options);

    if (result.raw.sfcreatedby != null) {
      let from = $$('span');
      from.text(`${this.options.useFromInstead ? l('From') : l('PostedBy')} `);
      $$(element).append(from.el);
      $$(element).append(this.renderLink(result.raw.sfcreatedby, result.raw.sfcreatedbyid));

      if (this.options.enablePostedOn && !Utils.isNullOrUndefined(result.raw.sfparentname) && !Utils.isNullOrUndefined(result.raw.sfparentid)) {
        // Post on user's wall
        if (!Utils.isNullOrUndefined(result.raw.sfuserid) && result.raw.sfuserid != result.raw.sfinsertedbyid) {
          let onFeed = $$('span');
          let content = ` ${l('OnFeed', this.renderLink(result.raw.sfparentname, result.raw.sfparentid).outerHTML)}`;
          onFeed.el.innerHTML = content;
          $$(element).append(onFeed.el);

        } else if (Utils.isNullOrUndefined(result.raw.sfuserid)) {
          let onUser = $$('span');
          onUser.text(` ${l('On').toLowerCase()} `);
          $$(element).append(onUser.el);
          $$(element).append(this.renderLink(result.raw.sfparentname, result.raw.sfparentid));
        }
      }
    }
  }

  private renderLink(text: string, id: string): HTMLElement {
    let link = $$('a', {
      href: ChatterUtils.buildURI(this.result.clickUri, this.result.raw.sffeeditemid, id)
    });
    link.text(text);
    return ChatterUtils.bindClickEventToElement(link.el, this.options.openInPrimaryTab, this.options.openInSubTab);
  }
}

Initialization.registerAutoCreateComponent(ChatterPostedBy);

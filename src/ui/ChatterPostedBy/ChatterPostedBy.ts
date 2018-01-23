import { Component } from '../Base/Component';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IResultsComponentBindings } from '../Base/ResultsComponentBindings';
import { IQueryResult } from '../../rest/QueryResult';
import { ChatterUtils } from '../../utils/ChatterUtils';
import { Initialization } from '../Base/Initialization';
import { l } from '../../strings/Strings';
import { Utils } from '../../utils/Utils';
import { $$ } from '../../utils/Dom';
import { exportGlobally } from '../../GlobalExports';

export interface IChatterPostedByOption {
  enablePostedOn: boolean;
  useFromInstead: boolean;
  openInPrimaryTab: boolean;
  openInSubTab: boolean;
}

export class ChatterPostedBy extends Component {
  static ID = 'ChatterPostedBy';

  static doExport = () => {
    exportGlobally({
      ChatterPostedBy: ChatterPostedBy
    });
  };

  static options: IChatterPostedByOption = {
    enablePostedOn: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    useFromInstead: ComponentOptions.buildBooleanOption({ defaultValue: false }),
    openInPrimaryTab: ComponentOptions.buildBooleanOption({ defaultValue: false }),
    openInSubTab: ComponentOptions.buildBooleanOption({ defaultValue: true })
  };

  static fields = ['sfcreatedbyname', 'sfcreatedbyid', 'sffeeditemid', 'sfuserid', 'sfinsertedbyid', 'sfparentid', 'sfparentname'];

  constructor(
    public element: HTMLElement,
    public options?: IChatterPostedByOption,
    public bindings?: IResultsComponentBindings,
    public result?: IQueryResult
  ) {
    super(element, ChatterPostedBy.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, ChatterPostedBy, options);

    if (Utils.getFieldValue(this.result, 'sfcreatedbyname') != null) {
      let from = $$('span');
      from.text(`${this.options.useFromInstead ? l('From') : l('PostedBy')} `);
      $$(element).append(from.el);
      $$(element).append(
        this.renderLink(Utils.getFieldValue(this.result, 'sfcreatedbyname'), Utils.getFieldValue(this.result, 'sfcreatedbyid'))
      );

      if (
        this.options.enablePostedOn &&
        !Utils.isNullOrUndefined(Utils.getFieldValue(this.result, 'sfparentname')) &&
        !Utils.isNullOrUndefined(Utils.getFieldValue(this.result, 'sfparentid'))
      ) {
        // Post on user's wall
        if (
          !Utils.isNullOrUndefined(Utils.getFieldValue(this.result, 'sfuserid')) &&
          Utils.getFieldValue(this.result, 'sfuserid') != Utils.getFieldValue(this.result, 'sfinsertedbyid')
        ) {
          let onFeed = $$('span');
          let content = ` ${l(
            'OnFeed',
            this.renderLink(Utils.getFieldValue(this.result, 'sfparentname'), Utils.getFieldValue(this.result, 'sfparentid')).outerHTML
          )}`;
          onFeed.el.innerHTML = content;
          $$(element).append(onFeed.el);
        } else if (Utils.isNullOrUndefined(Utils.getFieldValue(this.result, 'sfuserid'))) {
          let onUser = $$('span');
          onUser.text(` ${l('On').toLowerCase()} `);
          $$(element).append(onUser.el);
          $$(element).append(
            this.renderLink(Utils.getFieldValue(this.result, 'sfparentname'), Utils.getFieldValue(this.result, 'sfparentid'))
          );
        }
      }
    }
  }

  private renderLink(text: string, id: string): HTMLElement {
    let link = $$('a', {
      href: ChatterUtils.buildURI(this.result.clickUri, Utils.getFieldValue(this.result, 'sffeeditemid'), id)
    });
    link.text(text);
    return ChatterUtils.bindClickEventToElement(link.el, this.options.openInPrimaryTab, this.options.openInSubTab);
  }
}

Initialization.registerAutoCreateComponent(ChatterPostedBy);

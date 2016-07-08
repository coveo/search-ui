import {Component} from '../Base/Component';
import {IResultsComponentBindings} from '../Base/ResultsComponentBindings';
import {IQueryResult} from '../../rest/QueryResult';
import {Utils} from '../../utils/Utils';
import {ChatterUtils} from '../../utils/ChatterUtils';
import {l} from '../../strings/Strings';
import {Initialization} from '../Base/Initialization';
import {$$} from '../../utils/Dom';

export interface IChatterPostAttachmentOption {
}

export class ChatterPostAttachment extends Component {
  static ID = 'ChatterPostAttachment';

  static fields = [
    'sfcontentversionid',
    'sffeeditemid',
    'sfcontentfilename'
  ]

  constructor(public element: HTMLElement, public options?: IChatterPostAttachmentOption, public bindings?: IResultsComponentBindings, public result?: IQueryResult) {
    super(element, ChatterPostAttachment.ID, bindings);

    if (!Utils.isNullOrUndefined(result.raw.sfcontentversionid)) {
      let rootElement = $$('div', {
        className: 'coveo-chatter-result-box-row'
      });
      $$(element).append(rootElement.el);

      let icon = $$('div', {
        className: 'coveo-sprites-common-system coveo-chatter-result-box-icon'
      });
      rootElement.append(icon.el);

      let linkElement = $$('a', {
        href: ChatterUtils.buildURI(result.clickUri, result.raw.sffeeditemid, result.raw.sfcontentversionid)
      });
      rootElement.append(linkElement.el);

      if (!Utils.isNullOrUndefined(result.raw.sfcontentfilename)) {
        linkElement.text(result.raw.sfcontentfilename);
      } else {
        linkElement.text(l('ShowAttachment'));
      }
    }
  }
}

Initialization.registerAutoCreateComponent(ChatterPostAttachment);

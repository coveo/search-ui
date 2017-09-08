import { Component } from '../Base/Component';
import { IResultsComponentBindings } from '../Base/ResultsComponentBindings';
import { IQueryResult } from '../../rest/QueryResult';
import { Utils } from '../../utils/Utils';
import { ChatterUtils } from '../../utils/ChatterUtils';
import { l } from '../../strings/Strings';
import { Initialization } from '../Base/Initialization';
import { $$ } from '../../utils/Dom';
import { exportGlobally } from '../../GlobalExports';

export interface IChatterPostAttachmentOption {}

export class ChatterPostAttachment extends Component {
  static ID = 'ChatterPostAttachment';

  static doExport = () => {
    exportGlobally({
      ChatterPostAttachment: ChatterPostAttachment
    });
  };

  constructor(
    public element: HTMLElement,
    public options?: IChatterPostAttachmentOption,
    public bindings?: IResultsComponentBindings,
    public result?: IQueryResult
  ) {
    super(element, ChatterPostAttachment.ID, bindings);

    if (!Utils.isNullOrUndefined(Utils.getFieldValue(result, 'sfcontentversionid'))) {
      let rootElement = $$('div', {
        className: 'coveo-chatter-result-box-row'
      });
      $$(element).append(rootElement.el);

      let icon = $$('div', {
        className: 'coveo-sprites-common-system coveo-chatter-result-box-icon'
      });
      rootElement.append(icon.el);

      let linkElement = $$('a', {
        href: ChatterUtils.buildURI(
          result.clickUri,
          Utils.getFieldValue(result, 'sffeeditemid'),
          Utils.getFieldValue(result, 'sfcontentversionid')
        )
      });
      rootElement.append(linkElement.el);

      if (!Utils.isNullOrUndefined(Utils.getFieldValue(result, 'sfcontentfilename'))) {
        linkElement.text(Utils.getFieldValue(result, 'sfcontentfilename'));
      } else {
        linkElement.text(l('ShowAttachment'));
      }
    }
  }
}

Initialization.registerAutoCreateComponent(ChatterPostAttachment);

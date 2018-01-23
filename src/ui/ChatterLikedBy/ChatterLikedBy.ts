import { Initialization } from '../Base/Initialization';
import { ComponentOptions } from '../Base/ComponentOptions';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { IQueryResult } from '../../rest/QueryResult';
import { Utils } from '../../utils/Utils';
import { $$ } from '../../utils/Dom';
import { l } from '../../strings/Strings';
import { ChatterUtils } from '../../utils/ChatterUtils';
import { exportGlobally } from '../../GlobalExports';

export interface IChatterLikedByOptions {
  nbLikesToRender: number;
  openInPrimaryTab: boolean;
  openInSubTab: boolean;
}

export class ChatterLikedBy extends Component {
  static ID = 'ChatterLikedBy';

  static doExport = () => {
    exportGlobally({
      ChatterLikedBy: ChatterLikedBy
    });
  };

  static options: IChatterLikedByOptions = {
    nbLikesToRender: ComponentOptions.buildNumberOption({ defaultValue: 2, min: 0 }),
    openInPrimaryTab: ComponentOptions.buildBooleanOption({ defaultValue: false }),
    openInSubTab: ComponentOptions.buildBooleanOption({ defaultValue: true })
  };

  constructor(
    public element: HTMLElement,
    public options?: IChatterLikedByOptions,
    public bindings?: IComponentBindings,
    public result?: IQueryResult
  ) {
    super(element, ChatterLikedBy.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, ChatterLikedBy, options);

    if (
      !Utils.isNullOrUndefined(Utils.getFieldValue(result, 'sflikedby')) &&
      !Utils.isNullOrUndefined(Utils.getFieldValue(result, 'sflikedbyid'))
    ) {
      let likeNames = Utils.getFieldValue(result, 'sflikedby').split(';');
      let likeIds = Utils.getFieldValue(result, 'sflikedbyid').split(';');

      let rootElement = $$('div', {
        className: 'coveo-chatter-result-box-row'
      });
      $$(element).append(rootElement.el);

      let thumbIcon = $$('div', {
        className: 'coveo-sprites-common-thumbup_inactive coveo-chatter-result-box-icon'
      });
      rootElement.append(thumbIcon.el);

      let fullListElement = $$('div', {
        className: 'coveo-chatter-result-likes'
      });
      rootElement.append(fullListElement.el);

      this.renderLikesList(fullListElement.el, result, likeNames, likeIds, this.options.nbLikesToRender);
    }
  }

  private renderLikesList(element: HTMLElement, result: IQueryResult, likeNames: string[], likeIds: string[], nbLikesToRender: number) {
    let tempElement = $$('div');

    for (let i = 0; i < likeIds.length - 1 && (nbLikesToRender == 0 || i < nbLikesToRender); i++) {
      tempElement.append(this.renderLikeLink(result, likeNames[i], likeIds[i]));

      if ((nbLikesToRender == 0 || i < nbLikesToRender - 1) && i < likeIds.length - 2) {
        tempElement.append($$('span', {}, ', ').el);
      } else if (i < likeIds.length - 1) {
        tempElement.append($$('span', {}, ` ${l('And').toLowerCase()} `).el);
      }
    }

    if (nbLikesToRender == 0 || likeIds.length <= nbLikesToRender) {
      tempElement.append(this.renderLikeLink(result, likeNames[likeIds.length - 1], likeIds[likeIds.length - 1]));
    } else {
      let othersCount = likeIds.length - nbLikesToRender;
      let clickableLink = $$('a');
      clickableLink.text(` ${l('Others', othersCount.toString(), othersCount)}`);
      clickableLink.on('click', (e: Event) => {
        e.preventDefault();
        $$(element).empty();
        this.renderLikesList(element, result, likeNames, likeIds, 0);
      });
      tempElement.append(clickableLink.el);
    }

    if (likeIds.length > 0) {
      let name = $$('span');
      name.el.innerHTML = l('LikesThis', tempElement.el.innerHTML, likeIds.length);
      $$(element).append(name.el);
    }
  }

  private renderLikeLink(result: IQueryResult, likeName: string, likeId: string): HTMLElement {
    let link = $$('a', {
      href: ChatterUtils.buildURI(result.clickUri, Utils.getFieldValue(result, 'sffeeditemid'), likeId)
    });
    link.text(likeName);
    return link.el;
  }
}

Initialization.registerAutoCreateComponent(ChatterLikedBy);

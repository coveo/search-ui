import { Component } from '../Base/Component';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { Utils } from '../../utils/Utils';
import { QueryEvents, IBuildingQueryEventArgs } from '../../events/QueryEvents';
import { Initialization } from '../Base/Initialization';
import { $$ } from '../../utils/Dom';
import * as _ from 'underscore';

export interface IRecommendationQueryOptions {}

export class RecommendationQuery extends Component {
  static ID = 'RecommendationQuery';

  /**
   * The options for the RecommendationQuery component
   * @componentOptions
   */
  static options: IRecommendationQueryOptions = {};

  private content: string;

  constructor(public element: HTMLElement, public options?: IRecommendationQueryOptions, bindings?: IComponentBindings) {
    super(element, RecommendationQuery.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, RecommendationQuery, options);

    if (this.element.tagName.toLowerCase() === 'script') {
      try {
        this.content = Utils.decodeHTMLEntities($$(this.element).text());
      } catch (e) {
        return;
      }
      if (!_.isUndefined(this.content) && this.content != '') {
        this.bind.onRootElement(QueryEvents.buildingQuery, this.handleBuildingQuery);
      }
    }
  }

  private handleBuildingQuery(data: IBuildingQueryEventArgs) {
    data.queryBuilder.advancedExpression.add(this.content);
  }
}

Initialization.registerAutoCreateComponent(RecommendationQuery);

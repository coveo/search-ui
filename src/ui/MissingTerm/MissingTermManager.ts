import 'styling/_MissingTermsBreadcrumb';
import { $$ } from '../../utils/Dom';
import { QueryEvents, BreadcrumbEvents, l } from '../../Core';
import { IDoneBuildingQueryEventArgs } from '../../events/QueryEvents';
import { IClearBreadcrumbEventArgs, IPopulateBreadcrumbEventArgs } from '../../events/BreadcrumbEvents';
import { SVGIcons } from '../../utils/SVGIcons';
import { IAnalyticsMissingTerm, analyticsActionCauseList } from '../Analytics/AnalyticsActionListMeta';
import { IMissingTermManagerArgs } from '../SearchInterface/SearchInterface';

export class MissingTermManager {
  static ID = 'MissingTermManager';
  private termForcedToAppear: Array<string>;
  constructor(private args: IMissingTermManagerArgs) {
    $$(args.element).on(QueryEvents.buildingQuery, (event, args: IDoneBuildingQueryEventArgs) => {
      return this.handleBuildingQuery(args);
    });

    $$(args.element).on(BreadcrumbEvents.populateBreadcrumb, (evt, args: IPopulateBreadcrumbEventArgs) => {
      this.handlePopulateBreadcrumb(args);
    });
    $$(args.element).on(BreadcrumbEvents.clearBreadcrumb, (evt, args: IClearBreadcrumbEventArgs) => this.handleClearBreadcrumb());
  }

  private handleBuildingQuery(data: IDoneBuildingQueryEventArgs) {
    const currentMissingTerm = this.args.queryStateModel.get('missingTerm');
    currentMissingTerm.forEach(term => {
      data.queryBuilder.advancedExpression.add(term);
    });
  }

  private updateTermsForcedToAppear() {
    this.termForcedToAppear = [...this.args.queryStateModel.get('missingTerm')];
  }

  private handlePopulateBreadcrumb(args: IPopulateBreadcrumbEventArgs) {
    this.updateTermsForcedToAppear();
    if (this.termForcedToAppear.length === 0) {
      return;
    }

    const missingTerms = this.buildTermForcedToAppear();
    const BreadcrumbContainer = this.buildBreadcrumbContainer();

    missingTerms.forEach(term => $$(BreadcrumbContainer).append(term.el));

    args.breadcrumbs.push({
      element: BreadcrumbContainer.el
    });
  }

  private buildTermForcedToAppear() {
    return this.termForcedToAppear.map(term => {
      const termContainer = $$(
        'button',
        {
          className: 'coveo-missing-term-breadcrumb-value coveo-accessible-button'
        },
        $$('span', { className: 'coveo-missing-term-breadcrumb-caption' }, term),
        $$('span', { className: 'coveo-missing-term-breadcrumb-clear' }, SVGIcons.icons.mainClear)
      );

      termContainer.on('click', () => this.removeTermForcedToAppear(term));
      return termContainer;
    });
  }

  private buildBreadcrumbContainer() {
    return $$(
      'div',
      {
        className: 'coveo-remove-term-container'
      },
      $$(
        'span',
        {
          className: 'coveo-missing-term-breadcrumb-title'
        },
        l('MustContain')
      )
    );
  }

  private removeTermForcedToAppear(term: string) {
    this.updateTermsForcedToAppear();
    const termIndex = this.termForcedToAppear.indexOf(term);
    this.termForcedToAppear.splice(termIndex, 1);
    this.args.queryStateModel.set('missingTerm', [...this.termForcedToAppear]);
    this.logAnalyticsRemoveMissingTerm(term);
    this.args.queryController.executeQuery();
  }

  private handleClearBreadcrumb() {
    this.args.queryStateModel.set('missingTerm', []);
  }

  private logAnalyticsRemoveMissingTerm(term: string) {
    this.args.usageAnalytics.logSearchEvent<IAnalyticsMissingTerm>(analyticsActionCauseList.removeMissingTerm, {
      missingTerm: term
    });
  }
}

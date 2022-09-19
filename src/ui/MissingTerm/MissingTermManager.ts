import 'styling/_MissingTermsBreadcrumb';
import { $$ } from '../../utils/Dom';
import { IAnalyticsMissingTerm, analyticsActionCauseList } from '../Analytics/AnalyticsActionListMeta';
import { IMissingTermManagerArgs } from '../SearchInterface/SearchInterface';
import { QueryEvents, BreadcrumbEvents, l, get } from '../../Core';
import { IDoneBuildingQueryEventArgs } from '../../events/QueryEvents';
import { IClearBreadcrumbEventArgs, IPopulateBreadcrumbEventArgs } from '../../events/BreadcrumbEvents';
import { SVGIcons } from '../../utils/SVGIcons';
import { MODEL_EVENTS, IAttributeChangedEventArg } from '../../models/Model';
import { QUERY_STATE_ATTRIBUTES } from '../../models/QueryStateModel';
import XRegExp = require('xregexp');
import { Breadcrumb } from '../Breadcrumb/Breadcrumb';
import { escape } from 'underscore';
import { getHeadingTag } from '../../utils/AccessibilityUtils';

export class MissingTermManager {
  static ID = 'MissingTermManager';
  // We only need to import one Asian characters script because what is important here is the space
  // between characters and any of those scripts will contain it.
  // p{Han}: import the unicode script for chinese caracter
  // List of script: https://www.fontspace.com/unicode/script
  static wordBoundary = '(([\\p{Han}])?([^(\\p{Latin}-)])|^|$)';

  constructor(private args: IMissingTermManagerArgs) {
    $$(args.element).on(QueryEvents.doneBuildingQuery, (event, args: IDoneBuildingQueryEventArgs) => {
      return this.handleBuildingQuery(args);
    });

    $$(args.element).on(`state:${MODEL_EVENTS.CHANGE_ONE}${QUERY_STATE_ATTRIBUTES.Q}`, (evt, args: IAttributeChangedEventArg) =>
      this.handleQueryChange(args)
    );

    $$(args.element).on(BreadcrumbEvents.populateBreadcrumb, (evt, args: IPopulateBreadcrumbEventArgs) => {
      this.handlePopulateBreadcrumb(args);
    });
    $$(args.element).on(BreadcrumbEvents.clearBreadcrumb, (evt, args: IClearBreadcrumbEventArgs) => this.handleClearBreadcrumb());
  }

  private handleBuildingQuery(data: IDoneBuildingQueryEventArgs) {
    const currentMissingTerm = this.args.queryStateModel.get('missingTerms');
    currentMissingTerm.forEach(term => {
      data.queryBuilder.advancedExpression.add(term);
    });
  }

  private get termsForcedToAppear(): string[] {
    return [...this.args.queryStateModel.get('missingTerms')];
  }

  private setUpdateTermsForcedToAppear(terms: string[]) {
    this.args.queryStateModel.set('missingTerms', [...terms]);
  }

  private handlePopulateBreadcrumb(args: IPopulateBreadcrumbEventArgs) {
    if (this.termsForcedToAppear.length === 0) {
      return;
    }

    const missingTerms = this.buildTermForcedToAppear();
    const BreadcrumbContainer = this.buildBreadcrumbContainer(args.headingLevel);

    missingTerms.forEach(term => $$(BreadcrumbContainer).append(term.el));

    args.breadcrumbs.push({
      element: BreadcrumbContainer.el
    });
  }

  private buildTermForcedToAppear() {
    return this.termsForcedToAppear.map(term => {
      const termContainer = $$(
        'button',
        {
          type: 'button',
          className: 'coveo-missing-term-breadcrumb-value coveo-accessible-button'
        },
        $$('span', { className: 'coveo-missing-term-breadcrumb-caption' }, escape(term)),
        $$('span', { className: 'coveo-missing-term-breadcrumb-clear' }, SVGIcons.icons.mainClear)
      );

      termContainer.on('click', () => this.removeTermForcedToAppear(term));
      return termContainer;
    });
  }

  private buildBreadcrumbContainer(headingLevel?: number) {
    return $$(
      'div',
      {
        className: 'coveo-remove-term-container'
      },
      $$(
        getHeadingTag(headingLevel, 'span'),
        {
          className: 'coveo-missing-term-breadcrumb-title'
        },
        l('MustContain')
      )
    );
  }

  private removeTermForcedToAppear(term: string) {
    const termsForcedToAppearCopy = this.termsForcedToAppear;
    const termIndex = termsForcedToAppearCopy.indexOf(term);
    termsForcedToAppearCopy.splice(termIndex, 1);
    this.setUpdateTermsForcedToAppear(termsForcedToAppearCopy);
    this.logAnalyticsRemoveMissingTerm(term);
    this.args.queryController.executeQuery();
  }

  private logAnalyticsRemoveMissingTerm(term: string) {
    this.args.usageAnalytics.logSearchEvent<IAnalyticsMissingTerm>(analyticsActionCauseList.removeMissingTerm, {
      missingTerm: term
    });
  }

  private handleClearBreadcrumb() {
    this.setUpdateTermsForcedToAppear([]);
  }

  private handleQueryChange(args: IAttributeChangedEventArg) {
    this.updateTermsForcedToAppearToOnlyIncludeWords(args);

    const breadcrumbSelector = document.querySelector('.CoveoBreadcrumb');
    if (!breadcrumbSelector) {
      return;
    }

    let breadcrumb = <Breadcrumb>get(<HTMLElement>breadcrumbSelector);
    if (breadcrumb) {
      breadcrumb.getBreadcrumbs();
      $$(this.args.element).trigger(BreadcrumbEvents.redrawBreadcrumb);
    }
  }

  private updateTermsForcedToAppearToOnlyIncludeWords(args) {
    let termForcedToAppearCopy = this.termsForcedToAppear;
    this.termsForcedToAppear.forEach(term => {
      const regex = XRegExp(`${MissingTermManager.wordBoundary}(${term})${MissingTermManager.wordBoundary}`, 'g');
      if (!regex.test(args.value)) {
        const termIndex = termForcedToAppearCopy.indexOf(term);
        termForcedToAppearCopy.splice(termIndex, 1);
      }
    });
    this.setUpdateTermsForcedToAppear(termForcedToAppearCopy);
  }
}

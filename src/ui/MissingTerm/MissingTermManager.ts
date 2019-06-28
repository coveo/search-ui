import 'styling/_MissingTermsBreadcrumb';
import { $$ } from '../../utils/Dom';
import { QueryEvents, QueryStateModel, BreadcrumbEvents, l, get } from '../../Core';
import { IDoneBuildingQueryEventArgs } from '../../events/QueryEvents';
import { IClearBreadcrumbEventArgs, IPopulateBreadcrumbEventArgs } from '../../events/BreadcrumbEvents';
import { SVGIcons } from '../../utils/SVGIcons';
import { QueryController } from '../../controllers/QueryController';
import { MODEL_EVENTS, IAttributeChangedEventArg } from '../../models/Model';
import { QUERY_STATE_ATTRIBUTES } from '../../models/QueryStateModel';
import XRegExp = require('xregexp');
import { Breadcrumb } from '../Breadcrumb/Breadcrumb';

export class MissingTermManager {
  static ID = 'MissingTermManager';
  // Used to split terms and phrases. Match character that can separate words or caracter for Chinese, Japanese and Korean.
  // Han: Unicode script for Chinesse character
  // We only need to import 1 Asian, charcaters script because what is important here is the space between the caracter and any script will contain it
  static wordBoundary = '(([\\p{Han}])?([^(\\p{Latin}-)])|^|$)';

  private termForcedToAppear: Array<string>;
  constructor(private root: HTMLElement, private queryStateModel: QueryStateModel, private queryController: QueryController) {
    $$(root).on(QueryEvents.doneBuildingQuery, (event, args: IDoneBuildingQueryEventArgs) => {
      return this.handleBuildingQuery(args);
    });

    $$(root).on(`state:${MODEL_EVENTS.CHANGE_ONE}${QUERY_STATE_ATTRIBUTES.Q}`, (evt, args: IAttributeChangedEventArg) =>
      this.handleQueryChange(args)
    );

    $$(root).on(BreadcrumbEvents.populateBreadcrumb, (evt, args: IPopulateBreadcrumbEventArgs) => {
      this.handlePopulateBreadcrumb(args);
    });
    $$(root).on(BreadcrumbEvents.clearBreadcrumb, (evt, args: IClearBreadcrumbEventArgs) => this.handleClearBreadcrumb());
  }

  private handleBuildingQuery(data: IDoneBuildingQueryEventArgs) {
    const currentMissingTerm = this.queryStateModel.get('missingTerms');
    currentMissingTerm.forEach(term => {
      data.queryBuilder.advancedExpression.add(term);
    });
  }

  private getUpdateTermsForcedToAppear() {
    this.termForcedToAppear = [...this.queryStateModel.get('missingTerms')];
  }

  private setUpdateTermsForcedToAppear(termForcedToAppear) {
    this.queryStateModel.set('missingTerms', [...termForcedToAppear]);
  }

  private handlePopulateBreadcrumb(args: IPopulateBreadcrumbEventArgs) {
    this.getUpdateTermsForcedToAppear();
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
    this.getUpdateTermsForcedToAppear();
    const termIndex = this.termForcedToAppear.indexOf(term);
    this.termForcedToAppear.splice(termIndex, 1);
    this.setUpdateTermsForcedToAppear(this.termForcedToAppear);
    this.queryController.executeQuery();
  }

  private handleClearBreadcrumb() {
    this.setUpdateTermsForcedToAppear([]);
  }

  private handleQueryChange(args: IAttributeChangedEventArg) {
    this.getUpdateTermsForcedToAppear();
    let termForcedToAppearCopy = [...this.termForcedToAppear];
    this.termForcedToAppear.forEach(term => {
      const regex = XRegExp(`${MissingTermManager.wordBoundary}(${term})${MissingTermManager.wordBoundary}`, 'g');
      if (!regex.test(args.value)) {
        const termIndex = termForcedToAppearCopy.indexOf(term);
        termForcedToAppearCopy.splice(termIndex, 1);
      }
    });
    this.setUpdateTermsForcedToAppear(termForcedToAppearCopy);
    const breadcrumb = get(document.querySelector('.CoveoBreadcrumb')) as Breadcrumb;
    if (breadcrumb) {
      breadcrumb.getBreadcrumbs();
      $$(this.root).trigger(BreadcrumbEvents.redrawBreadcrumb);
    }
  }
}

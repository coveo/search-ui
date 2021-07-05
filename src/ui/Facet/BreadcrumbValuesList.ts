import * as Globalize from 'globalize';
import { first, rest, filter } from 'underscore';
import { Assert } from '../../misc/Assert';
import { l } from '../../strings/Strings';
import { $$ } from '../../utils/Dom';
import { IBreadcrumbValueElementKlass } from './BreadcrumbValueElement';
import { Facet } from './Facet';
import { FacetValue } from './FacetValue';
import { AccessibleButton } from '../../utils/AccessibleButton';

export class BreadcrumbValueList {
  private expanded: FacetValue[];
  private collapsed: FacetValue[];
  protected elem: HTMLElement;
  private valueContainer: HTMLElement;

  constructor(public facet: Facet, public facetValues: FacetValue[], public breadcrumbValueElementKlass: IBreadcrumbValueElementKlass) {
    this.setExpandedAndCollapsed();
    this.elem = $$('div', {
      className: 'coveo-facet-breadcrumb'
    }).el;

    const title = $$('span');
    title.addClass('coveo-facet-breadcrumb-title');
    title.text(this.facet.options.title + ':');
    this.elem.appendChild(title.el);

    this.valueContainer = $$('ul', {
      className: 'coveo-facet-breadcrumb-values'
    }).el;

    this.elem.appendChild(this.valueContainer);
  }

  public build(): HTMLElement {
    this.buildExpanded();
    if (this.collapsed.length != 0) {
      this.buildCollapsed();
    }
    return this.elem;
  }

  public buildAsString(): string {
    this.build();
    if (this.elem) {
      return (
        `${this.facet.options.title}: ` +
        $$(this.elem)
          .findAll('.coveo-facet-breadcrumb-value')
          .map((value: HTMLElement) => {
            return $$(value).text();
          })
          .join(', ')
      );
    }
    return '';
  }

  private buildExpanded() {
    this.expanded.forEach((value: FacetValue) => {
      const elementBreadcrumb = new this.breadcrumbValueElementKlass(this.facet, value).build();
      this.valueContainer.appendChild(elementBreadcrumb.el);
    });
  }

  private buildCollapsed() {
    const numberOfSelected = filter(this.collapsed, (value: FacetValue) => value.selected).length;
    const numberOfExcluded = filter(this.collapsed, (value: FacetValue) => value.excluded).length;
    Assert.check(numberOfSelected + numberOfExcluded == this.collapsed.length);

    const nMoreElement = $$(
      'div',
      {
        className: 'coveo-facet-breadcrumb-value'
      },
      $$(
        'span',
        {
          className: 'coveo-facet-breadcrumb-multi-count'
        },
        l('NMore', Globalize.format(numberOfSelected + numberOfExcluded, 'n0'))
      )
    );

    const nMoreContainer = $$(
      'li',
      {
        className: 'coveo-facet-breadcrumb-value-list-item'
      },
      nMoreElement
    );

    const collapsedBreadcrumbs = this.collapsed.map((value: FacetValue) => new this.breadcrumbValueElementKlass(this.facet, value));
    const toolTip = collapsedBreadcrumbs.map(element => element.getBreadcrumbTooltip()).join('\n');

    new AccessibleButton()
      .withElement(nMoreElement)
      .withTitle(toolTip)
      .withSelectAction(() => {
        nMoreElement.remove();
        collapsedBreadcrumbs.forEach(breadcrumb => {
          this.valueContainer.appendChild(breadcrumb.build().el);
        });
      })
      .build();

    this.valueContainer.appendChild(nMoreContainer.el);
  }

  private setExpandedAndCollapsed() {
    if (this.facetValues.length > this.facet.options.numberOfValuesInBreadcrumb) {
      this.collapsed = rest(this.facetValues, this.facet.options.numberOfValuesInBreadcrumb);
      this.expanded = first(this.facetValues, this.facet.options.numberOfValuesInBreadcrumb);
    } else {
      this.collapsed = [];
      this.expanded = this.facetValues;
    }
  }
}

import { $$ } from '../../utils/Dom';
import { Logger } from '../../misc/Logger';
import { QueryEvents } from '../../events/QueryEvents';
import { every, find } from 'underscore';
import { get } from '../Base/RegisteredNamedMethods';

export interface IAutoLayoutAdjustableInsideFacetColumn {
  isCurrentlyDisplayed: () => boolean;
}

export class FacetColumnAutoLayoutAdjustment {
  public static autoLayoutAdjustmentComponent: Map<HTMLElement, IAutoLayoutAdjustableInsideFacetColumn[]> = new Map();
  public static autoLayoutAdjustmentHandlers: Map<HTMLElement, () => void> = new Map();

  public static isAutoLayoutAdjustable(component: any): component is IAutoLayoutAdjustableInsideFacetColumn {
    return 'isCurrentlyDisplayed' in component;
  }

  public static initializeAutoLayoutAdjustment(root: HTMLElement, component: IAutoLayoutAdjustableInsideFacetColumn) {
    if (!this.autoLayoutAdjustmentComponent.has(root)) {
      this.autoLayoutAdjustmentComponent.set(root, []);
    }

    this.autoLayoutAdjustmentComponent.get(root).push(component);

    if (this.autoLayoutAdjustmentHandlers.has(root)) {
      return;
    }
    const hiddenClass = 'coveo-no-visible-facet';

    const handler = () =>
      $$(root).on(QueryEvents.deferredQuerySuccess, () => {
        const column = this.findColumn(root);

        if (this.everyStandardComponentsAreInvisible(root) && this.columnsDoesNotContainVisibleCustomElement(column)) {
          $$(root).addClass(hiddenClass);
        } else {
          $$(root).removeClass(hiddenClass);
        }
      });

    handler();

    this.autoLayoutAdjustmentHandlers.set(root, handler);
  }

  private static columnsDoesNotContainVisibleCustomElement(column: HTMLElement) {
    if (!column) {
      return true;
    }

    const children = $$(column).children();
    const shouldBeIgnored = ['coveo-facet-header-filter-by-container', 'coveo-topSpace', 'coveo-bottomSpace'];

    const columnDoesNotContainVisibleCustomElement = every(children, child => {
      const willBeIgnored = find(shouldBeIgnored, toIgnore => {
        return $$(child).hasClass(toIgnore);
      });

      if (willBeIgnored != null) {
        return true;
      }

      try {
        const component = get(child);
        if (component && this.isAutoLayoutAdjustable(component)) {
          return true;
        }
      } catch (e) {}

      return !$$(child).isVisible();
    });

    return columnDoesNotContainVisibleCustomElement;
  }

  private static everyStandardComponentsAreInvisible(root: HTMLElement) {
    const components = this.autoLayoutAdjustmentComponent.get(root);
    return every(components, component => !component.isCurrentlyDisplayed());
  }

  private static findColumn(root: HTMLElement) {
    const column = $$(root).find('.coveo-facet-column');
    if (!column) {
      const logger = new Logger('ResponsiveFacets');
      logger.info('No element with class coveo-facet-column. Facet column auto layout adjustment cannot be enabled');
    }
    return column;
  }
}

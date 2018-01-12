import { Component } from './Component';
import { $$ } from '../../utils/Dom';
import * as _ from 'underscore';
import { Initialization } from './Initialization';
import { Utils } from '../../UtilsModules';

export type DOMElementToInitialize = { componentClassId: string; htmlElements: HTMLElement[] };

export class InitializationHelper {
  public static findDOMElementsToIgnore(container: HTMLElement, componentIdsToIgnore: string[]): HTMLElement[] {
    let htmlElementsToIgnore = [];

    _.each(componentIdsToIgnore, componentIdToIgnore => {
      const rootsToIgnore = this.findDOMElementsMatchingComponentId(container, componentIdToIgnore);
      htmlElementsToIgnore = Utils.concatWithoutDuplicate(htmlElementsToIgnore, rootsToIgnore);

      _.each(rootsToIgnore, rootToIgnore => {
        const childsElementsToIgnore = $$(rootToIgnore).findAll('*');
        htmlElementsToIgnore = Utils.concatWithoutDuplicate(htmlElementsToIgnore, childsElementsToIgnore);
      });
    });

    return htmlElementsToIgnore;
  }

  public static findDOMElementsToInitialize(container: HTMLElement, htmlElementsToIgnore: HTMLElement[]): DOMElementToInitialize[] {
    const elementsToInitialize: DOMElementToInitialize[] = [];

    _.each(Initialization.getListOfRegisteredComponents(), (componentClassId: string) => {
      let htmlElements = [];

      htmlElements = Utils.concatWithoutDuplicate(htmlElements, this.findDOMElementsMatchingComponentId(container, componentClassId));

      const aliases = Initialization.componentAliases[componentClassId];
      _.each(aliases, alias => {
        htmlElements = Utils.concatWithoutDuplicate(htmlElements, this.findDOMElementsMatchingComponentId(container, alias as string));
      });

      if (
        $$(container).hasClass(Component.computeCssClassNameForType(`${componentClassId}`)) &&
        !_.contains(htmlElementsToIgnore, container)
      ) {
        htmlElements.push(container);
      }

      elementsToInitialize.push({
        componentClassId,
        htmlElements: _.difference(htmlElements, htmlElementsToIgnore)
      });
    });

    return elementsToInitialize;
  }

  private static findDOMElementsMatchingComponentId(container: HTMLElement, componentId: string): HTMLElement[] {
    const classname = Component.computeCssClassNameForType(`${componentId}`);
    return $$(container).findAll(`.${classname}`);
  }
}

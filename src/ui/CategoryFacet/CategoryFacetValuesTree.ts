import { ICategoryFacetValue } from '../../rest/CategoryFacetValue';
import { ICategoryFacetResult } from '../../rest/CategoryFacetResult';
import { find } from 'underscore';

export type ISeenValue = { result: ICategoryFacetValue; children: ISeenValue[] };

export class CategoryFacetValuesTree {
  public seenValues: ISeenValue[] = [];

  public getValueForLastPartInPath(path: string[]) {
    const nullCategoryFacetValue: ICategoryFacetValue = { value: '', numberOfResults: 0 };
    let currentNode: ISeenValue;

    for (const part of path) {
      const nodesToSearch = currentNode ? currentNode.children : this.seenValues;
      const node = this.findNodeWithValue(nodesToSearch, part);

      if (!node) {
        return nullCategoryFacetValue;
      }

      currentNode = node;
    }

    return currentNode ? currentNode.result : nullCategoryFacetValue;
  }

  public storeNewValues(categoryFacetResult: ICategoryFacetResult) {
    let currentNodes = this.seenValues;

    for (const parent of categoryFacetResult.parentValues) {
      const node = this.findNodeWithValue(currentNodes, parent.value);

      if (!node) {
        const newNode: ISeenValue = { result: parent, children: [] };
        currentNodes.push(newNode);
      }

      currentNodes = this.findNodeWithValue(currentNodes, parent.value).children;
    }

    categoryFacetResult.values
      .filter(result => !this.findNodeWithValue(currentNodes, result.value))
      .forEach(result => currentNodes.push({ result, children: [] }));
  }

  private findNodeWithValue(nodes: ISeenValue[], value: string) {
    return find(nodes, node => node.result.value === value);
  }
}

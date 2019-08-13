import { ICategoryFacetValue } from '../../rest/CategoryFacetValue';
import { ICategoryFacetResult } from '../../rest/CategoryFacetResult';
import { find } from 'underscore';

type ITreeNode = { result: ICategoryFacetValue; children: ITreeNode[] };

export class CategoryFacetValuesTree {
  private seenValues: ITreeNode[] = [];

  public getValueForLastPartInPath(path: string[]) {
    let currentNode: ITreeNode;

    for (const part of path) {
      const searchThrough = currentNode ? currentNode.children : this.seenValues;
      const node = this.getNodeInTreeOfSeenValues(searchThrough, part);

      if (node) {
        currentNode = node;
      }
    }

    return currentNode.result;
  }

  public storeNewValues(categoryFacetResult: ICategoryFacetResult) {
    let currentNodes = this.seenValues;

    for (const parent of categoryFacetResult.parentValues) {
      const node = this.getNodeInTreeOfSeenValues(currentNodes, parent.value);

      if (!node) {
        const newNode: ITreeNode = { result: parent, children: [] };
        currentNodes.push(newNode);
      }

      currentNodes = this.getNodeInTreeOfSeenValues(currentNodes, parent.value).children;
    }

    categoryFacetResult.values
      .filter(value => !this.getNodeInTreeOfSeenValues(currentNodes, value.value))
      .forEach(value => currentNodes.push({ result: value, children: [] }));
  }

  private getNodeInTreeOfSeenValues(nodes: ITreeNode[], value: string) {
    return find(nodes, node => node.result.value === value);
  }
}

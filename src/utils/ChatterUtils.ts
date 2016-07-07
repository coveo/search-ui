export class ChatterUtils {
  static buildURI(objectURI: string, objectId: string, newObjectId: string) {
    return objectURI.replace(objectId, newObjectId);
  }

  static bindClickEventToElement(element: HTMLElement, openInPrimaryTab: boolean, openInSubTab: boolean) {
    return element;
  }
}

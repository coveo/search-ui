export function expectChildren(element: HTMLElement | DocumentFragment, classNames: string[]) {
  expect(element.childNodes.length).toEqual(classNames.length, `Expected only ${classNames.length} children.`);
  return classNames.map((className, index) => {
    const childAtIndex = element.childNodes.item(index) as HTMLElement;
    if (className) {
      expect(childAtIndex.classList).toContain(className, `Expected element at index ${index} to contain class ${className}.`);
    }
    return childAtIndex;
  });
}

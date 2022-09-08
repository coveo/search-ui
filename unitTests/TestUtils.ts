import { toArray } from 'underscore';

export function expectChildren(element: HTMLElement | DocumentFragment, classNames: (string | null)[]) {
  expect(element.childNodes.length).toEqual(classNames.length, `Expected only ${classNames.length} children.`);
  return classNames.map((className, index) => {
    const childAtIndex = element.childNodes.item(index) as HTMLElement;
    if (className) {
      expect(childAtIndex.classList).toContain(className, `Expected element at index ${index} to contain class ${className}.`);
    }
    return childAtIndex;
  });
}

export function expectEquivalentDOM(
  actual: HTMLElement,
  expected: HTMLElement,
  options?: { ignoreRoot?: boolean; ignoreAttributes?: string[] | boolean }
): boolean {
  const getAttributes = (element: HTMLElement) => {
    let attributes = toArray<Attr>(element.attributes).map(({ name, value }) => ({ name, value }));
    if (options) {
      if (options.ignoreAttributes === true) {
        attributes = [];
      } else if (Array.isArray(options.ignoreAttributes) && options.ignoreAttributes.length) {
        const attributesToIgnore = options.ignoreAttributes;
        attributes = attributes.filter(attribute => attributesToIgnore.indexOf(attribute.name) === -1);
      }
    }
    return attributes;
  };

  if (!options || !options.ignoreRoot) {
    if (expect(actual.tagName).toEqual(expected.tagName)) {
      return true;
    }
    if (expect(getAttributes(actual)).toEqual(getAttributes(expected))) {
      return true;
    }
  }
  const actualChildren = toArray<HTMLElement>(actual.children);
  const expectedChildren = toArray<HTMLElement>(expected.children);
  if (
    expect(actualChildren.length).toEqual(
      expectedChildren.length,
      `${actual.tagName} is expected to have ${expectedChildren.length} children but has ${actualChildren.length}.`
    )
  ) {
    return true;
  }
  return actualChildren.some((actualChild, index) =>
    expectEquivalentDOM(actualChild, expectedChildren[index], {
      ignoreRoot: false,
      ignoreAttributes: options && options.ignoreAttributes
    })
  );
}

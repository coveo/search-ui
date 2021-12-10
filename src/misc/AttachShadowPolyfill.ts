import { $$ } from '../utils/Dom';
import 'styling/_AttachShadowPolyfill';

export interface IShadowOptions {
  title: string;
  onSizeChanged?: Function;
  useIFrame?: Boolean;
}

export async function attachShadow(element: HTMLElement, options: IShadowOptions & ShadowRootInit): Promise<HTMLElement> {
  const elementOptions = { className: 'coveo-shadow-iframe', scrolling: 'no', title: options.title };
  let autoUpdateContainer: HTMLIFrameElement | HTMLElement;
  let contentBody: HTMLElement;
  if (options.useIFrame) {
    autoUpdateContainer = $$('iframe', elementOptions).el;
    autoUpdateContainer.setAttribute('tabindex', '-1');
    const onLoad = new Promise(resolve => autoUpdateContainer.addEventListener('load', () => resolve()));
    element.appendChild(autoUpdateContainer);
    await onLoad;
    contentBody = (autoUpdateContainer as HTMLIFrameElement).contentDocument.body;
  } else {
    autoUpdateContainer = $$('div', elementOptions).el;
    contentBody = autoUpdateContainer;
    element.appendChild(autoUpdateContainer);
  }

  contentBody.style.margin = '0';
  const shadowRootContainer = $$('div', { style: 'overflow: auto;' }).el;
  contentBody.appendChild(shadowRootContainer);
  autoUpdateHeight(autoUpdateContainer, shadowRootContainer, options.onSizeChanged);
  if (options.mode === 'open') {
    Object.defineProperty(element, 'shadowRoot', { get: () => shadowRootContainer });
  }

  return shadowRootContainer;
}

function autoUpdateHeight(elementToResize: HTMLElement, content: HTMLElement, onUpdate?: Function) {
  let lastWidth = content.clientWidth;
  let lastHeight = content.clientHeight;

  const heightObserver = new MutationObserver(() => {
    if (lastWidth === content.clientWidth && lastHeight === content.clientHeight) {
      return;
    }
    lastWidth = content.clientWidth;
    lastHeight = content.clientHeight;
    elementToResize.style.width = `${content.clientWidth}px`;
    elementToResize.style.height = `${content.clientHeight}px`;
    if (onUpdate) {
      onUpdate();
    }
  });
  heightObserver.observe(content, {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true
  });
}

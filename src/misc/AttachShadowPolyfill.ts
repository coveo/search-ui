import { $$ } from '../utils/Dom';
import 'styling/_AttachShadowPolyfill';

export interface IShadowOptions {
  title: string;
  onSizeChanged?: Function;
}

export async function attachShadow(element: HTMLElement, options: IShadowOptions & ShadowRootInit): Promise<HTMLElement> {
  const iframe = $$('iframe', { className: 'coveo-shadow-iframe', scrolling: 'no', title: options.title }).el as HTMLIFrameElement;
  const onLoad = new Promise(resolve => iframe.addEventListener('load', () => resolve()));
  element.appendChild(iframe);
  await onLoad;

  const iframeBody = iframe.contentDocument.body as HTMLBodyElement;
  iframeBody.style.margin = '0';
  const shadowRoot = $$('div', { style: 'overflow: auto;' }).el;
  iframeBody.appendChild(shadowRoot);
  autoUpdateHeight(iframe, shadowRoot, options.onSizeChanged);
  if (options.mode === 'open') {
    Object.defineProperty(element, 'shadowRoot', { get: () => shadowRoot });
  }

  return shadowRoot;
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

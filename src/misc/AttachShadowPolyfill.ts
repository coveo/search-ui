import { $$ } from '../utils/Dom';
import 'styling/_AttachShadowPolyfill';

export async function attachShadow(element: HTMLElement, init: ShadowRootInit & { title: string }): Promise<HTMLElement> {
  const iframe = $$('iframe', { className: 'coveo-shadow-iframe', scrolling: 'no', title: init.title }).el as HTMLIFrameElement;
  const onLoad = new Promise(resolve => iframe.addEventListener('load', () => resolve()));
  element.appendChild(iframe);
  await onLoad;

  const iframeBody = iframe.contentDocument.body as HTMLBodyElement;
  iframeBody.style.margin = '0';
  const shadowRoot = $$('div').el;
  iframeBody.appendChild(shadowRoot);
  autoUpdateHeight(iframe, shadowRoot);
  if (init.mode === 'open') {
    Object.defineProperty(element, 'shadowRoot', { get: () => shadowRoot });
  }

  return shadowRoot;
}

function autoUpdateHeight(elementToResize: HTMLElement, content: HTMLElement) {
  const heightObserver = new MutationObserver(() => {
    elementToResize.style.height = `${content.clientHeight}px`;
  });
  heightObserver.observe(content, {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true
  });
}

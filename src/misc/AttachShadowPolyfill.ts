import { $$ } from '../utils/Dom';
import 'styling/_AttachShadowPolyfill';

export async function attachShadow(element: HTMLElement, init: ShadowRootInit): Promise<ShadowRoot | HTMLBodyElement> {
  if (element.attachShadow) {
    return element.attachShadow(init);
  }
  const iframe = $$('iframe', { className: 'coveo-shadow-iframe', scrolling: 'no' }).el as HTMLIFrameElement;
  const onLoad = new Promise(resolve => iframe.addEventListener('load', () => resolve()));
  element.appendChild(iframe);
  await onLoad;

  const shadowRoot = iframe.contentDocument.body as HTMLBodyElement;
  autoUpdateHeight(iframe, shadowRoot);
  if (init.mode === 'open') {
    Object.defineProperty(element, 'shadowRoot', { get: () => shadowRoot });
  }

  return shadowRoot;
}

function autoUpdateHeight(elementToResize: HTMLElement, content: HTMLElement) {
  const heightObserver = new MutationObserver(() => {
    elementToResize.style.height = `${content.scrollHeight}px`;
  });
  heightObserver.observe(content, {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true
  });
}

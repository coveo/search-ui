import { $$ } from '../utils/Dom';
import 'styling/_AttachShadowPolyfill';

export async function attachShadow(element: HTMLElement, init: ShadowRootInit): Promise<ShadowRoot | HTMLElement> {
  if (element.attachShadow) {
    return element.attachShadow(init);
  }
  const iframe = $$('iframe', { className: 'coveo-shadow-iframe', scrolling: 'no' }).el as HTMLIFrameElement;
  const onLoad = new Promise(resolve => iframe.addEventListener('load', () => resolve()));
  element.appendChild(iframe);
  await onLoad;

  const iframeBody = iframe.contentDocument.body as HTMLBodyElement;
  iframeBody.style.margin = '0';
  inheritStyle(iframeBody, document.body, ['fontFamily', 'fontSize', 'fontWeight']);
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

function inheritStyle(target: HTMLElement, reference: HTMLElement, styles: (keyof CSSStyleDeclaration)[]) {
  const referenceStyle = window.getComputedStyle(reference);
  styles.forEach(style => {
    (target.style as any)[style] = referenceStyle[style];
  });
}

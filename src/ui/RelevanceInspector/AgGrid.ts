import { $$ } from '../../utils/Dom';

let isAgGridLoaded = false;
let isAgGridLoading: Promise<boolean> | null = null;
const agGridLibUrl = 'https://cdnjs.cloudflare.com/ajax/libs/ag-grid/16.0.1/ag-grid.min.noStyle.js';
const agGridStyleBaseUrl = 'https://cdnjs.cloudflare.com/ajax/libs/ag-grid/16.0.1/styles/ag-grid.css';
const agGridStyleFreshUrl = 'https://cdnjs.cloudflare.com/ajax/libs/ag-grid/16.0.1/styles/ag-theme-fresh.css';

declare const agGrid: any;

// Should only be used for UT
export const reset = (doc = document) => {
  isAgGridLoaded = false;
  isAgGridLoading = null;
};

export const loadAgGridLibrary = (doc = document) => {
  return new Promise((resolve, reject) => {
    if (isAgGridLoaded) {
      resolve(true);
    } else if (typeof agGrid !== 'undefined') {
      isAgGridLoaded = true;
      resolve(true);
    } else {
      addAgGridScriptsToDocument(doc);
      isAgGridLoading.then(() => resolve(true));
      isAgGridLoading.catch(() => reject(false));
    }
  });
};

const addAgGridScriptsToDocument = (doc = document) => {
  if (!isAgGridLoading) {
    const script = $$('script', {
      src: agGridLibUrl,
      type: 'text/javascript',
      async: true
    }).el as HTMLScriptElement;

    const styleBase = $$('link', {
      href: agGridStyleBaseUrl,
      rel: 'stylesheet',
      type: 'text/css'
    }).el as HTMLLinkElement;

    const style = $$('link', {
      href: agGridStyleFreshUrl,
      rel: 'stylesheet',
      type: 'text/css'
    }).el as HTMLLinkElement;

    doc.head.appendChild(script);
    doc.head.appendChild(styleBase);
    doc.head.appendChild(style);

    isAgGridLoading = new Promise((resolveScriptLoaded, rejectScriptLoaded) => {
      script.onload = () => {
        resolveScriptLoaded(true);
      };
      script.onerror = () => {
        isAgGridLoaded = false;
        rejectScriptLoaded(false);
      };
    });
  }
};

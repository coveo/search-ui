import { $$ } from '../../utils/Dom';
import * as _ from 'underscore';

/**
 * Represent a single cell of data in the {@link Matrix} component.
 */
export class Cell {
  private value: any;
  private element: HTMLElement;
  private previewActive = false;

  constructor(value: any = 0, el?: HTMLElement) {
    this.element = el;
    this.value = value;
  }

  /**
   * Return the value of the cell.
   * @returns {any}
   */
  public getValue(): any {
    return this.value;
  }

  /**
   * Return the `HTMLElement` for the cell.
   * @returns {HTMLElement}
   */
  public getHTML(): HTMLElement {
    return this.element;
  }

  /**
   * Set the value if the cell.
   * @param value
   */
  public setValue(value: any) {
    this.value = value;
  }

  /**
   * Set the `HTMLElement` for the cell.
   * @param html
   */
  public setHTML(html: HTMLElement) {
    this.element = html;
  }

  /**
   * Show the preview of the cell.
   * @param minWidth css minWidth property : eg 100px
   * @param maxWidth css maxWidth property : eg 100px
   */
  public addPreview(minWidth: string, maxWidth: string) {
    this.previewActive = true;
    let previewContainer = $$('div', {
      className: 'matrix-results-preview-container'
    });
    previewContainer.el.style.minWidth = minWidth;
    previewContainer.el.style.maxWidth = maxWidth;
    previewContainer.on('click', (e: MouseEvent) => {
      e.stopPropagation();
    });
    this.element.appendChild(previewContainer.el);
    let container = $$(this.element).findAll('.matrix-results-preview-container');
    _.each(container, (c: HTMLElement) => {
      $$(c).hide();
    });
  }

  /**
   * Remove the preview of the cell
   */
  public removePreview() {
    this.previewActive = false;
    let container = $$(this.element).find('.matrix-results-preview-container');
    if (container) {
      $$(container).detach();
    }
  }

  /**
   * Update the preview with a new template
   * @param template
   */
  public updatePreview(template: string) {
    if (this.previewActive) {
      let preview = $$(this.element).find('.matrix-results-preview-container');
      preview.innerHTML += template;
      $$(preview).show();
    }
  }
}

import { QuickviewDocumentIframe } from './QuickviewDocumentIframe';
import { $$ } from '../../utils/Dom';
import { QuickviewDocumentWord } from './QuickviewDocumentWord';

export class QuickviewDocumentWordButton {
  public el: HTMLElement;
  constructor(public word: QuickviewDocumentWord, public iframe: QuickviewDocumentIframe) {
    this.el = this.render();
  }

  private buildName() {
    const name = $$(
      'span',
      {
        className: 'coveo-term-for-quickview-name'
      },
      `${this.word.text} (${this.word.count})`
    );

    name.on('click', () => this.navigate(false));
    return name;
  }

  private navigate(backward: boolean) {
    const element = backward ? this.word.navigateBackward() : this.word.navigateForward();

    // pdf2html docs hide the non-visible frames by default, to speed up browsers.
    // But this prevents keyword navigation from working so we must force show it. This
    // is done by adding the 'opened' class to it (defined by pdf2html).
    if (this.iframe.isNewQuickviewDocument()) {
      const pdf = $$(element).closest('.pc');
      $$(pdf).addClass('opened');
    }

    element.scrollIntoView();
  }

  public render() {
    const wordHtml = $$('span', {
      className: 'coveo-term-for-quickview'
    });

    wordHtml.append(this.buildName().el);

    wordHtml.append(this.renderArrow('up').el);

    wordHtml.append(this.renderArrow('down').el);

    wordHtml.el.style.backgroundColor = this.word.color.htmlColor;
    wordHtml.el.style.borderColor = this.word.color.saturate();

    return wordHtml.el;
  }

  private renderArrow(direction: 'up' | 'down') {
    const arrow = $$('span', {
      className: `coveo-term-for-quickview-${direction}-arrow`
    });

    const arrowIcon = $$('span', {
      className: `coveo-term-for-quickview-${direction}-arrow-icon`
    });

    arrow.append(arrowIcon.el);

    arrow.on('click', () => this.navigate(direction == 'up'));
    return arrow;
  }
}

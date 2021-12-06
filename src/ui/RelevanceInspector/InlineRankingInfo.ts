import { IQueryResult } from '../../rest/QueryResult';
import { parseRankingInfo, IRankingInfo, buildListOfTermsElement } from './RankingInfoParser';
import { $$, Dom } from '../../utils/Dom';
import { each } from 'underscore';
import { Utils } from '../../utils/Utils';

export class InlineRankingInfo {
  private rankingInfo: IRankingInfo;
  constructor(public result: IQueryResult) {
    this.rankingInfo = parseRankingInfo(result.rankingInfo);
  }

  public build(): Dom {
    const container = $$('div', {
      className: 'coveo-relevance-inspector-inline-ranking'
    });

    each(this.rankingInfo.documentWeights, (value: any, key: string) => {
      const section = $$('div', { className: 'coveo-relevance-inspector-inline-ranking-section' }, `${key}: ${value}`);
      container.append(section.el);
    });

    const total = $$(
      'div',
      { className: 'coveo-relevance-inspector-highlight coveo-relevance-inspector-inline-ranking-section' },
      `Total: ${this.rankingInfo.totalWeight}`
    );
    container.append(total.el);

    if (this.rankingInfo.termsWeight) {
      this.buildTogglableTermsSection(container);
    }

    if (Utils.isNonEmptyArray(this.rankingInfo.qreWeights)) {
      this.buildTogglableQRESection(container);
    }

    return container;
  }

  private buildTogglableTermsSection(container: Dom) {
    const termsButton = $$(
      'button',
      { className: 'coveo-button coveo-relevance-inspector-inline-ranking-button', type: 'button' },
      'Toggle Terms Relevancy Breakdown'
    );
    container.append(termsButton.el);

    const termsSection = $$('div', { className: 'coveo-relevance-inspector-inline-ranking-terms' });

    container.append(termsSection.el);
    each(this.rankingInfo.termsWeight || {}, (value, key) => {
      const builtKey = `Keyword: ${key}`;
      termsSection.append($$('h2', undefined, builtKey).el);
      termsSection.append(buildListOfTermsElement(value.Weights).el);
    });

    termsButton.on('click', () => termsSection.toggleClass('coveo-active'));
  }

  private buildTogglableQRESection(container: Dom) {
    const qreButton = $$(
      'button',
      { className: 'coveo-button coveo-relevance-inspector-inline-ranking-button', type: 'button' },
      'Toggle QRE Breakdown'
    );
    container.append(qreButton.el);
    const qreSection = $$('ul', { className: 'coveo-relevance-inspector-inline-ranking-terms' });

    container.append(qreSection.el);
    each(this.rankingInfo.qreWeights, value => {
      qreSection.append($$('dd', { className: 'coveo-relevance-inspector-inline-ranking-qre-expression' }, `${value.expression}`).el);
      qreSection.append($$('dt', undefined, `Score: ${value.score}`).el);
    });

    qreButton.on('click', () => qreSection.toggleClass('coveo-active'));
  }
}

import { $$, Dom } from '../../utils/Dom';
import { find } from 'underscore';

export class RelevanceInspectorTabs {
  public navigationSection: Dom;
  public tabContentSection: Dom;
  private navigationElements: Dom[];
  private tabContentElements: Dom[];

  constructor(public onTabChange: (id: string) => void) {
    this.navigationSection = $$('div', {
      className: 'coveo-relevance-inspector-tab-navigation-section'
    });

    this.tabContentSection = $$('div', {
      className: 'coveo-relevance-inspector-tab-content-section'
    });

    this.navigationElements = [];
    this.tabContentElements = [];
  }

  public select(id: string) {
    const navElementToActivate = this.findNavigationById(id);
    const tabContentToActivate = this.findTabContentById(id);

    if (navElementToActivate && tabContentToActivate) {
      this.activateTabNavigation(navElementToActivate);
      this.activateTabContent(tabContentToActivate);
      if (this.onTabChange) {
        this.onTabChange(id);
      }
    }
  }

  public addNavigation(caption: string, id: string) {
    const navigationElement = $$(
      'div',
      {
        id,
        className: 'coveo-relevance-inspector-tab'
      },
      caption
    );

    navigationElement.on('click', () => this.select(id));

    this.navigationElements.push(navigationElement);
    this.navigationSection.append(navigationElement.el);

    return this;
  }

  public addContent(content: Dom, targetId: string) {
    const tabContent = $$('div', {
      className: 'coveo-relevance-inspector-tab-content',
      'data-target-tab': targetId
    });
    tabContent.append(content.el);

    this.tabContentElements.push(tabContent);
    this.tabContentSection.append(tabContent.el);

    return this;
  }

  public addSection(caption: string, content: Dom, id: string) {
    return this.addNavigation(caption, id).addContent(content, id);
  }

  private findNavigationById(id: string) {
    return find(this.navigationElements, element => element.getAttribute('id') == id);
  }

  private findTabContentById(id: string) {
    return find(this.tabContentElements, tabContentElement => tabContentElement.getAttribute('data-target-tab') == id);
  }

  private activateTabNavigation(navigationElement: Dom) {
    this.navigationElements.forEach(element => {
      element.removeClass('coveo-selected');
    });
    navigationElement.addClass('coveo-selected');
  }

  private activateTabContent(contentElement: Dom) {
    this.tabContentElements.forEach(element => {
      element.removeClass('coveo-selected');
    });
    contentElement.addClass('coveo-selected');
  }
}

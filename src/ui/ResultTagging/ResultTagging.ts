import { Component } from '../Base/Component';
import { ComponentOptions, IFieldOption } from '../Base/ComponentOptions';
import { IFieldDescription } from '../../rest/FieldDescription';
import { IComponentBindings } from '../Base/ComponentBindings';
import { Assert } from '../../misc/Assert';
import { Utils } from '../../utils/Utils';
import { Initialization } from '../Base/Initialization';
import { IIndexFieldValue } from '../../rest/FieldValue';
import { StringUtils } from '../../utils/StringUtils';
import { l } from '../../strings/Strings';
import { KEYBOARD, KeyboardUtils } from '../../utils/KeyboardUtils';
import { QueryStateModel } from '../../models/QueryStateModel';
import { ITaggingRequest } from '../../rest/TaggingRequest';
import { $$ } from '../../utils/Dom';
import { analyticsActionCauseList } from '../Analytics/AnalyticsActionListMeta';
import { IQueryResult } from '../../rest/QueryResult';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';

import 'styling/_ResultTagging';
import { SVGIcons } from '../../utils/SVGIcons';
import { SVGDom } from '../../utils/SVGDom';

export interface IResultTaggingOptions {
  field: IFieldOption;
  suggestBoxSize?: number;
  autoCompleteTimer?: number;
}

export interface IAnalyticsResultTaggingMeta {
  facetId: string;
  facetValue?: string;
  facetTitle?: string;
}

/**
 * The ResultTagging component lists the current tag field values of its associated result and renders a control that
 * allows the end user to add values to a tag field.
 *
 * This component is a result template component (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 *
 * **Note:**
 * > The ResultTagging component is not supported with Coveo Cloud V2. To implement the ResultTagging component in Coveo Cloud V1, contact [Coveo Support](https://support.coveo.com/s/).
 * 
 * @notSupportedIn salesforcefree
 */
export class ResultTagging extends Component {
  static ID = 'ResultTagging';
  static autoCompleteClass = 'coveo-result-tagging-auto-complete';

  static doExport = () => {
    exportGlobally({
      ResultTagging: ResultTagging
    });
  };

  /**
   * @componentOptions
   */
  static options: IResultTaggingOptions = {
    /**
     * Specifies the tag field that the component will use.
     *
     * Specifying a value for this options is necessary for this component to work.
     */
    field: ComponentOptions.buildFieldOption({
      match: (field: IFieldDescription) => field.type == 'Tag',
      required: true
    }),

    /**
     * Specifies the number of items to show in the list of suggested items.
     *
     * Default value is `5`. Minimum value is `0 `.
     */
    suggestBoxSize: ComponentOptions.buildNumberOption({ defaultValue: 5, min: 0 }),

    /**
     * Specifies how much time (in milliseconds) it takes for the list of suggested items to disappear when it loses
     * focus.
     *
     * Default value is `2000`. Minimum value is `0`.
     */
    autoCompleteTimer: ComponentOptions.buildNumberOption({ defaultValue: 2000, min: 0 })
  };

  static AUTO_COMPLETE_CLASS = 'coveo-result-tagging-auto-complete';

  private autoCompleteZone: HTMLElement;
  private textBox: HTMLInputElement;
  private autoCompletePopup: HTMLElement;
  private tagZone: HTMLElement;
  private tags: string[];

  /**
   * Creates a new ResultTagging component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the ResultTagging component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   * @param result The result to associate the component with.
   */
  constructor(
    public element: HTMLElement,
    public options?: IResultTaggingOptions,
    bindings?: IComponentBindings,
    public result?: IQueryResult
  ) {
    super(element, ResultTagging.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, ResultTagging, options);
    this.result = result || this.resolveResult();
    Assert.exists(this.componentOptionsModel);
    Assert.exists(this.result);

    if (!this.options.field) {
      this.logger.error('You must specify a field to the ResultTagging component');
      return;
    }
    let fieldValue = Utils.getFieldValue(this.result, <string>this.options.field);
    if (fieldValue && Utils.isNonEmptyString(fieldValue)) {
      this.tags = fieldValue.split(';');
    } else if (fieldValue && Utils.isNonEmptyArray(fieldValue)) {
      this.tags = fieldValue;
    } else {
      this.tags = [];
    }
    this.tags = _.map(this.tags, t => {
      return t.trim();
    });
    this.tagZone = $$('div', {
      className: 'coveo-result-tagging-tag-zone'
    }).el;
    element.appendChild(this.tagZone);
    element.appendChild(this.buildTagIcon());

    this.autoCompleteZone = $$('div', {
      className: 'coveo-result-tagging-auto-complete-zone'
    }).el;
    element.appendChild(this.autoCompleteZone);
    this.autoCompleteZone.appendChild(this.buildTextBox());
    this.autoCompleteZone.appendChild(this.buildAddIcon());
    this.autoCompleteZone.appendChild(this.buildClearIcon());
    this.buildExistingTags();
  }

  private buildExistingTags() {
    if (this.tags) {
      _.each(this.tags, (tag: string) => {
        this.tagZone.appendChild(this.buildTagValue(tag));
      });
    }
  }

  private buildTagIcon(): HTMLElement {
    let tagZone = $$('div', {
      className: 'coveo-result-tagging-add-tag'
    });
    let tagTextBox = $$('span', {
      className: 'coveo-result-tagging-add-tag-text'
    });
    tagTextBox.text(l('EnterTag'));
    let tagIcon = $$('span', {
      className: 'coveo-result-tagging-add-tag-icon'
    });
    tagIcon.on('click', () => {
      _.defer(() => {
        this.focusOnTextBox();
      }, 20);
    });
    tagZone.el.appendChild(tagIcon.el);
    tagZone.append(tagTextBox.el);
    tagZone.setAttribute('title', l('EnterTag'));
    return tagZone.el;
  }

  private focusOnTextBox() {
    this.textBox.focus();
  }

  private buildTagValue(tagValue: string): HTMLElement {
    let tag = $$('div', {
      className: 'coveo-result-tagging-coveo-tag'
    });
    tag.el.appendChild(this.buildShortenedTagWithTitle(tagValue));
    let deleteIcon = $$(
      'span',
      {
        className: 'coveo-result-tagging-delete-icon'
      },
      SVGIcons.icons.checkboxHookExclusionMore
    );
    SVGDom.addClassToSVGInContainer(deleteIcon.el, 'coveo-result-tagging-delete-icon-svg');
    tag.el.appendChild(deleteIcon.el);
    deleteIcon.on('click', () => {
      this.doRemoveTag(tag.el, tagValue.toLowerCase());
    });
    return tag.el;
  }

  private buildShortenedTagWithTitle(tagValue: string): HTMLElement {
    let shortenedTag = StringUtils.removeMiddle(tagValue, 16, '...');
    let clickableValue = $$('a', {
      title: tagValue,
      href: 'javascript:void(0);'
    });
    clickableValue.text(shortenedTag);

    this.bindFacetEventOnValue(clickableValue.el, tagValue);
    return clickableValue.el;
  }

  private buildTextBox(): HTMLInputElement {
    this.textBox = <HTMLInputElement>$$('input', {
      type: 'text',
      className: 'coveo-add-tag-textbox',
      placeholder: l('EnterTag')
    }).el;

    this.autoCompletePopup = $$('div', {
      className: ResultTagging.autoCompleteClass
    }).el;
    this.autoCompleteZone.appendChild(this.autoCompletePopup);
    this.manageAutocompleteAutoHide();
    $$(this.textBox).on('keyup', (e: KeyboardEvent) => {
      if (e.keyCode == KEYBOARD.UP_ARROW || e.keyCode == KEYBOARD.DOWN_ARROW || e.keyCode == KEYBOARD.ENTER) {
        this.manageUpDownEnter(e.keyCode);
      } else if (!KeyboardUtils.isArrowKeyPushed(e.keyCode)) {
        this.populateSuggestions();
      }
      $$(this.element).removeClass('coveo-error');
    });
    $$(this.textBox).on('click', () => {
      this.populateSuggestions();
    });
    return this.textBox;
  }

  private buildAddIcon(): HTMLElement {
    let icon = $$(
      'div',
      {
        className: 'coveo-result-tagging-add-tag-tick-icon'
      },
      SVGIcons.icons.taggingOk
    );
    SVGDom.addClassToSVGInContainer(icon.el, 'coveo-result-tagging-add-tag-tick-icon-svg');
    let clickable = $$('span');
    clickable.on('click', () => {
      this.doAddTag();
    });
    icon.el.appendChild(clickable.el);
    return icon.el;
  }

  private buildClearIcon(): HTMLElement {
    let icon = $$(
      'div',
      {
        className: 'coveo-result-tagging-clear-icon'
      },
      SVGIcons.icons.checkboxHookExclusionMore
    );
    SVGDom.addClassToSVGInContainer(icon.el, 'coveo-result-tagging-clear-icon-svg');
    let clickable = $$('span');
    clickable.on('click', () => {
      this.textBox.value = '';
    });
    icon.el.appendChild(clickable.el);
    return icon.el;
  }

  private bindFacetEventOnValue(element: HTMLElement, value: string) {
    let facetAttributeName = QueryStateModel.getFacetId(<string>this.options.field);
    let facetModel: string[] = this.queryStateModel.get(facetAttributeName);
    let facets: Component[] = this.componentStateModel.get(facetAttributeName);
    let atLeastOneFacetIsEnabled = _.filter(facets, (value: Component) => !value.disabled).length > 0;

    if (facetModel != null && atLeastOneFacetIsEnabled) {
      $$(element).on('click', () => {
        if (_.contains(facetModel, value)) {
          this.queryStateModel.set(facetAttributeName, _.without(facetModel, value));
        } else {
          this.queryStateModel.set(facetAttributeName, _.union(facetModel, [value]));
        }
        this.queryController.deferExecuteQuery({
          beforeExecuteQuery: () =>
            this.usageAnalytics.logSearchEvent<IAnalyticsResultTaggingMeta>(analyticsActionCauseList.documentTag, {
              facetId: <string>this.options.field,
              facetValue: value
            })
        });
      });

      if (_.contains(facetModel, value)) {
        $$(element).addClass('coveo-selected');
      }
      $$(element).addClass('coveo-clickable');
    }
  }

  private clearPopup() {
    $$(this.autoCompletePopup).hide();
    $$(this.autoCompletePopup).empty();
  }

  private showPopup() {
    $$(this.autoCompletePopup).show();
  }

  private populateSuggestions() {
    let endpoint = this.queryController.getEndpoint();
    let searchText = this.textBox.value;
    let searchOptions = {
      field: <string>this.options.field,
      ignoreAccents: true,
      sortCriteria: 'occurences',
      maximumNumberOfValues: this.options.suggestBoxSize,
      queryOverride: '@uri',
      pattern: this.buildRegEx(searchText),
      patternType: 'RegularExpression'
    };
    endpoint.listFieldValues(searchOptions).then((fieldValues: IIndexFieldValue[]) => {
      this.clearPopup();
      _.each(fieldValues, (fieldValue: IIndexFieldValue) => {
        this.autoCompletePopup.appendChild(this.buildSelectableValue(fieldValue.lookupValue));
      });
      this.showPopup();
      this.autoCompletePopup.style.width = this.textBox.offsetWidth + ' px';
    });
  }

  private manageAutocompleteAutoHide() {
    let timeout: any;

    $$(this.textBox).on('mouseover', () => {
      clearTimeout(timeout);
    });

    $$(this.autoCompletePopup).on('mouseout', e => {
      if ($$(<HTMLElement>e.target).hasClass(ResultTagging.autoCompleteClass)) {
        timeout = setTimeout(() => {
          this.clearPopup();
        }, this.options.autoCompleteTimer);
      }
    });

    $$(this.autoCompletePopup).on('mouseenter', () => {
      clearTimeout(timeout);
    });

    $$(this.element).on('mouseenter', () => {
      this.clearPopup();
      $$(this.element).addClass('coveo-opened');
    });

    $$($$(this.element).closest('.CoveoResult')).on('mouseleave', () => {
      this.clearPopup();
      if (this.textBox.value == '') {
        $$(this.element).removeClass('coveo-opened');
      }
    });

    $$($$(this.element).closest('.CoveoResult')).on('focusout', e => {
      if (this.textBox.value != '' && $$(<HTMLElement>e.target).closest('.CoveoResult') != $$(this.element).closest('.CoveoResult')) {
        $$(this.element).addClass('coveo-error');
      }
    });

    $$($$(this.element).closest('.CoveoResult')).on('focusin', () => {
      $$(this.element).removeClass('coveo-error');
    });
  }

  // Exclude tags that are already on the result (Since we can tag with the same value twice.
  private buildRegEx(searchTerm: string) {
    return '(?=.*' + searchTerm + ')' + _.map(this.tags, (tag: string) => this.buildTermToExclude(tag)).join('') + '.*';
  }

  private buildTermToExclude(term: string) {
    return '(?!^' + term + '$)';
  }

  private manageUpDownEnter(code: number) {
    let selectableArray = $$(this.element).findAll('.coveo-selectable');
    if (code == KEYBOARD.ENTER) {
      this.doAddTag();
      return;
    }

    if (selectableArray.length > 0) {
      let newIndex = this.computeNextIndex(code, selectableArray);
      newIndex = Math.max(0, newIndex);
      newIndex = Math.min(selectableArray.length - 1, newIndex);
      let selected = $$(selectableArray[newIndex]);
      selected.addClass('coveo-selected');
      this.textBox.value = selected.text();
    }
  }

  private computeNextIndex(code: number, selectableArray: HTMLElement[]): number {
    let nextIndex = 0;
    _.each(selectableArray, (selectable: HTMLElement, index) => {
      if ($$(selectable).hasClass('coveo-selected')) {
        if (code == KEYBOARD.UP_ARROW) {
          nextIndex = index - 1;
        } else if (code == KEYBOARD.DOWN_ARROW) {
          nextIndex = index + 1;
        }
        $$(selectable).removeClass('coveo-selected');
      }
    });
    return nextIndex;
  }

  private buildSelectableValue(lookupValue: string): HTMLElement {
    let line = $$('div', {
      className: 'coveo-selectable'
    });
    line.el.appendChild(this.buildShortenedTagWithTitle(lookupValue));
    line.on('click', () => {
      this.doAddTagWithValue(lookupValue);
    });
    return line.el;
  }

  private doRemoveTag(element: HTMLElement, tagValue: string) {
    let request: ITaggingRequest = {
      fieldName: <string>this.options.field,
      fieldValue: tagValue,
      doAdd: false,
      uniqueId: this.result.uniqueId
    };
    this.queryController
      .getEndpoint()
      .tagDocument(request)
      .then(() => {
        this.tags.splice(_.indexOf(this.tags, tagValue), 1);
        $$(element).detach();
      });
  }

  private doAddTagWithValue(tagValue: string) {
    _.each(tagValue.split(','), (tag: string) => {
      this.doAddSingleTagValue(tag);
    });
  }

  private doAddSingleTagValue(tagValue: string) {
    this.clearPopup();
    if (_.indexOf(this.tags, tagValue) > -1) {
      $$(this.element).addClass('coveo-error');
      return;
    }
    this.tags.push(tagValue);
    let request: ITaggingRequest = {
      fieldName: <string>this.options.field,
      fieldValue: tagValue,
      doAdd: true,
      uniqueId: this.result.uniqueId
    };
    this.queryController
      .getEndpoint()
      .tagDocument(request)
      .then(() => {
        this.tagZone.appendChild(this.buildTagValue(tagValue));
        this.textBox.value = '';
        $$(this.element).removeClass('coveo-error');
      })
      .catch(() => {
        // We do this otherwise it's possible to add the same tag while we wait for the server's response
        this.tags = _.without(this.tags, _.findWhere(this.tags, tagValue));
      });
  }

  private doAddTag() {
    let tagValue = Utils.trim(this.textBox.value.toLowerCase());
    this.doAddTagWithValue(tagValue);
  }
}
Initialization.registerAutoCreateComponent(ResultTagging);

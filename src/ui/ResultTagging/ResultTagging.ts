



module Coveo {
  export interface IResultTaggingOptions {
    field: string;
    suggestBoxSize?: number;
    autoCompleteTimer?: number;
  }

  export interface AnalyticsResultTaggingMeta {
    facetId: string;
    facetValue?: string;
    facetTitle?: string;
  }

  export class ResultTagging extends Component {
    static ID = 'ResultTagging';

    static options: IResultTaggingOptions = {
      field: ComponentOptions.buildFieldOption({ match: (field: IFieldDescription) => field.type == 'Tag', required: true }),
      suggestBoxSize: ComponentOptions.buildNumberOption({ defaultValue: 5, min: 0 }),
      autoCompleteTimer: ComponentOptions.buildNumberOption({ defaultValue: 2000, min: 0 })
    }

    static AUTO_COMPLETE_CLASS = 'coveo-result-tagging-auto-complete';

    private autoCompleteZone: JQuery;
    private textBox: JQuery;
    private autoCompletePopup: JQuery;
    private tagZone: JQuery;
    private tags: string[];

    constructor(public element: HTMLElement, public options?: IResultTaggingOptions, bindings?: IComponentBindings, public result?: IQueryResult, public os?: OSUtils.NAME) {
      super(element, ResultTagging.ID, bindings);

      this.options = ComponentOptions.initComponentOptions(element, ResultTagging, options);

      this.options = $.extend({}, this.options)
      this.result = result || this.resolveResult();
      Assert.exists(this.componentOptionsModel);
      Assert.exists(this.result);

      if (!this.options.field) {
        this.logger.error('You must specify a field to the ResultTagging component');
      }

      this.tags = Utils.getFieldValue(this.result, this.options.field) || [];
      this.tagZone = $('<div></div>').addClass('coveo-result-tagging-tag-zone').appendTo($(element));
      $(element).append(this.buildTagIcon());
      this.autoCompleteZone = $('<div></div>').addClass('coveo-result-tagging-auto-complete-zone').appendTo($(element));
      $(this.autoCompleteZone).append(this.buildTextBox());
      $(this.autoCompleteZone).append(this.buildAddIcon());
      $(this.autoCompleteZone).append(this.buildClearIcon());
      this.buildExistingTags();
    }

    private buildExistingTags() {
      if (this.tags) {
        _.each(this.tags, (tag: string) => {
          $(this.tagZone).append(this.buildTagValue(tag));
        });
      }
    }

    private buildTagIcon(): JQuery {
      var tagZone = $('<div></div>').addClass('coveo-result-tagging-add-tag');
      var tagTextBox = $('<span></span>').text(l('EnterTag')).addClass('coveo-result-tagging-add-tag-text');
      tagZone.append($('<span></span>').addClass('coveo-result-tagging-add-tag-icon').click(() => setTimeout($.proxy(this.focusOnTextBox, this), 20)));
      tagZone.append(tagTextBox);
      tagZone.attr('title', l('EnterTag'));
      return tagZone;
    }

    private focusOnTextBox() {
      this.textBox.focus();
    }

    private buildTagValue(tagValue: string): JQuery {
      var tag = $('<div></div>').addClass('coveo-result-tagging-coveo-tag');
      this.buildShortenedTagWithTitle(tagValue).appendTo(tag);
      var deleteIcon = $('<span></span>').addClass('coveo-result-tagging-delete-icon').appendTo(tag);
      deleteIcon.click(() => this.doRemoveTag(tag, tagValue.toLowerCase()));
      return tag;
    }

    private buildShortenedTagWithTitle(tagValue: string): JQuery {
      var shortenedTag = StringUtils.removeMiddle(tagValue, 16, '...');
      var clickableValue = $('<a></a>').text(shortenedTag).attr('title', tagValue).attr('href', 'javascript:void;');
      this.bindFacetEventOnValue(clickableValue, tagValue);
      return clickableValue;
    }

    private buildTextBox(): JQuery {
      this.textBox = $('<input/>').attr('type', 'text').addClass('coveo-add-tag-textbox').attr('placeholder', l('EnterTag'));
      this.autoCompletePopup = $('<div></div>').addClass(ResultTagging.AUTO_COMPLETE_CLASS).appendTo($(this.autoCompleteZone));
      this.manageAutocompleteAutoHide();
      this.textBox.keyup((e: JQueryEventObject) => {
        if (e.keyCode == KEYBOARD.UP_ARROW || e.keyCode == KEYBOARD.DOWN_ARROW || e.keyCode == KEYBOARD.ENTER) {
          this.manageUpDownEnter(e.keyCode);
        } else if (!KeyboardUtils.isArrowKeyPushed(e.keyCode)) {
          this.populateSuggestions();
        }
        $(this.element).removeClass('coveo-error');
      });
      this.textBox.click(() => {
        this.populateSuggestions();
      });
      return this.textBox;
    }

    private buildAddIcon(): JQuery {
      return $('<div></div>').addClass('coveo-result-tagging-add-tag-tick-icon').append($('<span></span>')).click(() => this.doAddTag());
    }

    private buildClearIcon(): JQuery {
      return $('<div></div>').addClass('coveo-result-tagging-clear-icon').append($('<span></span>')).click(() => this.textBox.val(''));
    }

    private bindFacetEventOnValue(element: JQuery, value: string) {
      var facetAttributeName = QueryStateModel.getFacetId(this.options.field)
      var facetModel: string[] = this.queryStateModel.get(facetAttributeName);
      var facets: Component[] = this.componentStateModel.get(facetAttributeName);
      var atLeastOneFacetIsEnabled = _.filter(facets, (value: Component) => !value.disabled).length > 0;

      if (facetModel != null && atLeastOneFacetIsEnabled) {
        $(element).on('click', () => {
          if (_.contains(facetModel, value)) {
            this.queryStateModel.set(facetAttributeName, _.without(facetModel, value))
          } else {
            this.queryStateModel.set(facetAttributeName, _.union(facetModel, [value]))
          }
          this.queryController.deferExecuteQuery({
            beforeExecuteQuery: () => this.usageAnalytics.logSearchEvent<AnalyticsResultTaggingMeta>(AnalyticsActionCauseList.documentTag, {
              facetId: this.options.field,
              facetValue: value
            })
          });
        })

        if (_.contains(facetModel, value)) {
          $(element).addClass('coveo-selected')
        }
        $(element).addClass('coveo-clickable')
      }
    }

    private clearPopup() {
      this.autoCompletePopup.hide();
      this.autoCompletePopup.empty();
    }

    private showPopup() {
      this.autoCompletePopup.show();
    }

    private populateSuggestions() {
      var endpoint = this.queryController.getEndpoint();
      var searchText = this.textBox.val();
      var searchOptions = {
        field: this.options.field,
        ignoreAccents: true,
        sortCriteria: 'occurences',
        maximumNumberOfValues: this.options.suggestBoxSize,
        queryOverride: '@uri',
        pattern: this.buildRegEx(searchText),
        patternType: 'RegularExpression'
      };
      endpoint.listFieldValues(searchOptions)
        .then((fieldValues: IIndexFieldValue[]) => {
          this.clearPopup();
          _.each(fieldValues, (fieldValue: IIndexFieldValue) => {
            this.autoCompletePopup.append(this.buildSelectableValue(fieldValue.lookupValue));
          });
          this.showPopup();
          this.autoCompletePopup.width(this.textBox.outerWidth());
        });
    }

    private manageAutocompleteAutoHide() {
      var timeout: any;
      this.textBox.on('mouseover', () => {
        window.clearTimeout(timeout);
      });
      this.autoCompletePopup.mouseout((e: JQueryEventObject) => {
        if ($(e.target).hasClass(ResultTagging.AUTO_COMPLETE_CLASS)) {
          timeout = window.setTimeout($.proxy(this.clearPopup, this), this.options.autoCompleteTimer);
        }
      })
      this.autoCompletePopup.mouseenter(() => {
        window.clearTimeout(timeout);
      });

      $(this.element).mouseenter(() => {
        this.clearPopup();
        $(this.element).addClass('coveo-opened');
      });
      $(this.element).closest('.CoveoResult').mouseleave(() => {
        this.clearPopup();
        if (this.textBox.val() == '') {
          $(this.element).removeClass('coveo-opened');
        }
      });
      $(this.element).closest('.CoveoResult').focusout((e: JQueryEventObject) => {
        if (this.textBox.val() != '' && ($(e.target).closest('.CoveoResult') != $(this.element).closest('.CoveoResult'))) {
          $(this.element).addClass('coveo-error');
        }
      });
      $(this.element).closest('.CoveoResult').focusin(() => {
        $(this.element).removeClass('coveo-error');
      });
    }

    /**
     * Exclude tags that are already on the result (Since we can tag with the same value twice)
     * */
    private buildRegEx(searchTerm: string) {
      return '(?=.*' + searchTerm + ')' + _.map(this.tags, (tag: string) => this.buildTermToExclude(tag)).join('') + '.*';
    }

    private buildTermToExclude(term: string) {
      return '(?!^' + term + '$)';
    }

    private manageUpDownEnter(code: number) {
      var selectableArray = $(this.element).find('.coveo-selectable');
      if (code == KEYBOARD.ENTER) {
        this.doAddTag()
        return;
      }

      if (selectableArray.length > 0) {
        var newIndex = this.computeNextIndex(code, selectableArray);
        newIndex = Math.max(0, newIndex);
        newIndex = Math.min(selectableArray.length - 1, newIndex);
        var selected = $(selectableArray.get(newIndex));
        selected.addClass('coveo-selected');
        this.textBox.val(selected.text());
      }
    }

    private computeNextIndex(code: number, selectableArray: JQuery): number {
      var nextIndex = 0;
      _.each(selectableArray, (selectable: JQuery, index) => {
        if ($(selectable).hasClass('coveo-selected')) {
          if (code == KEYBOARD.UP_ARROW) {
            nextIndex = index - 1;
          } else if (code == KEYBOARD.DOWN_ARROW) {
            nextIndex = index + 1;
          }
          $(selectable).removeClass('coveo-selected');
        }
      });
      return nextIndex;
    }

    private buildSelectableValue(lookupValue: string): JQuery {
      var line = $('<div></div>').append(this.buildShortenedTagWithTitle(lookupValue));
      line.addClass('coveo-selectable');
      line.click(() => {
        this.doAddTagWithValue(lookupValue);
      });
      return line;
    }

    private doRemoveTag(element: JQuery, tagValue: string) {
      var request: ITaggingRequest = {
        fieldName: this.options.field,
        fieldValue: tagValue,
        doAdd: false,
        uniqueId: this.result.uniqueId
      };
      this.queryController.getEndpoint().tagDocument(request)
        .then(() => {
          this.tags.splice($.inArray(tagValue, this.tags), 1);
          element.remove()
        });
    }

    private doAddTagWithValue(tagValue: string) {
      _.each(tagValue.split(','), (tag: string) => {
        this.doAddSingleTagValue(tag);
      });
    }

    private doAddSingleTagValue(tagValue: string) {
      this.clearPopup();
      if ($.inArray(tagValue, this.tags) > -1) {
        $(this.element).addClass('coveo-error');
        return;
      }
      this.tags.push(tagValue);
      var request: ITaggingRequest = {
        fieldName: this.options.field,
        fieldValue: tagValue,
        doAdd: true,
        uniqueId: this.result.uniqueId
      };
      this.queryController.getEndpoint().tagDocument(request)
        .then(() => {
          this.tagZone.append(this.buildTagValue(tagValue));
          this.textBox.val('');
          $(this.element).removeClass('coveo-error');
        })
        .catch(() => {
          // We do this otherwise it's possible to add the same tag while we wait for the server's response
          this.tags = _.without(this.tags, _.findWhere(this.tags, tagValue));
        });
    }

    private doAddTag() {
      var tagValue = Coveo.Utils.trim(this.textBox.val().toLowerCase());
      this.doAddTagWithValue(tagValue);
    }
  }
  Initialization.registerAutoCreateComponent(ResultTagging);
}

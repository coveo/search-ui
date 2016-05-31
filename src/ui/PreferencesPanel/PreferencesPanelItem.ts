import {$$} from '../../utils/Dom';
import {Assert} from '../../misc/Assert';
import {Utils} from '../../utils/Utils';

export interface IPreferencePanelInputToBuild {
  label: string;
  placeholder?: string;
  tab?: string[];
  expression?: string;
  otherAttribute?: string;
}

export class PreferencesPanelBoxInput {
  public inputs: { [label: string]: HTMLElement } = {};

  private inputTemplate = _.template('<div class=\'coveo-choice-container\'>\
      <div class=\'coveo-section coveo-section-input\'>\
        <input <%- otherAttribute %> class=\'coveo-<%- label %>\' id=\'coveo-<%- label %>\' type=\'<%- type %>\' name=\'<%- name%>\' value=\'<%- label %>\' ></input><span class=\'coveo-input-icon\'></span><label class=\'coveo-preferences-panel-item-label\' for=\'coveo-<%- label %>\'><%- label %></label>\
      </div>\
      <div class=\'coveo-section coveo-section-tab\'><%- tab %></div>\
    <div class=\'coveo-section coveo-section-expression\'><%- expression %></div>\
    </div>');

  constructor(private boxInputToBuild: IPreferencePanelInputToBuild[], private nameOfInput: string, private type: string) {
  }

  public build(): HTMLElement {
    return _.reduce(_.map(this.boxInputToBuild, (toBuild) => {
      this.inputs[toBuild.label] = $$('div', undefined, this.inputTemplate({
        label: toBuild.label,
        name: this.nameOfInput,
        type: this.type,
        otherAttribute: toBuild.otherAttribute,
        tab: toBuild.tab,
        expression: toBuild.expression
      })).el;
      return this.inputs[toBuild.label];
    }), (memo: HTMLElement, input: HTMLElement) => {
      memo.appendChild(input);
      return memo;
    }, $$('div').el)
  }

  public select(toSelect: string) {
    Assert.exists(this.inputs[toSelect]);
    var input = <HTMLInputElement>$$(this.inputs[toSelect]).find('input');
    input.checked = true;
    $$($$(this.inputs[toSelect]).find('.coveo-input-icon')).addClass('coveo-selected');
  }

  public unselect(toUnselect: string) {
    Assert.exists(this.inputs[toUnselect]);
    var input = <HTMLInputElement>$$(this.inputs[toUnselect]).find('input');
    input.checked = false;
    $$($$(this.inputs[toUnselect]).find('.coveo-input-icon')).removeClass('coveo-selected');
  }

  public getSelected(): string {
    var checked = _.find(this.inputs, (el: HTMLElement) => {
      var input = <HTMLInputElement>$$(el).find('input');
      return input.checked;
    })
    return (<HTMLInputElement>$$(checked).find('input')).value;
  }

  public getSelecteds(): string[] {
    var checkeds = _.filter(this.inputs, (el: HTMLElement) => {
      var input = <HTMLInputElement>$$(el).find('input');
      return input.checked;
    })

    return _.map(checkeds, (checked) => {
      return (<HTMLInputElement>$$(checked).find('input')).value;
    })
  }
}

export class PreferencesPanelRadioInput extends PreferencesPanelBoxInput {
  constructor(private radioElementToBuild: IPreferencePanelInputToBuild[], private name: string) {
    super(radioElementToBuild, name, 'radio');
  }
}

export class PreferencesPanelCheckboxInput extends PreferencesPanelBoxInput {
  constructor(private checkboxElementToBuild: IPreferencePanelInputToBuild[], public name: string) {
    super(checkboxElementToBuild, name, 'checkbox');
  }

  public build(): HTMLElement {
    var build = super.build();
    var icons = $$(build).findAll('.coveo-input-icon');
    _.each(icons, (icon: HTMLElement) => {
      var input = <HTMLInputElement>$$(icon.parentElement).find('input');
      $$(input).on('change', () => {
        var checked = input.checked;
        $$(icon).toggleClass('coveo-selected', checked);
      })

      $$(icon).on('click', () => {
        input.checked = !input.checked;
        $$(input).trigger('change');
      })
    })
    return build;
  }
}

export class PreferencesPanelTextInput {
  public inputs: { [label: string]: HTMLElement } = {};
  public inputTemplate = _.template('<div class=\'coveo-choice-container\'><input <%- otherAttribute %> class=\'coveo-<%- label %>\' id=\'coveo-<%- label %>\' type=\'<%- type %>\' name=\'<%- name%>\' placeholder=\'<%- placeholder %>\' ></input></div>');

  constructor(public textElementToBuild: IPreferencePanelInputToBuild[], public name: string) {
  }

  public build(): HTMLElement {
    return _.reduce(_.map(this.textElementToBuild, (toBuild) => {
      this.inputs[toBuild.label] = $$('div', undefined, this.inputTemplate({
        label: toBuild.label,
        name: this.name,
        type: 'text',
        otherAttribute: toBuild.otherAttribute,
        placeholder: toBuild.placeholder || toBuild.label
      })).el;

      return this.inputs[toBuild.label];
    }), (memo: HTMLElement, input: HTMLElement) => {
      memo.appendChild(input);
      return memo;
    }, $$('div').el);
  }

  public getValues(): string[] {
    return _.map(this.inputs, (input, key) => {
      return (<HTMLInputElement>this.getInput(key)).value;
    })
  }

  public setValue(input: string, value: string) {
    Assert.exists(this.inputs[input]);
    (<HTMLInputElement>this.getInput(input)).value = value;
  }

  public reset(): void {
    _.each(this.inputs, (input: HTMLElement) => {
      var inputElement: HTMLInputElement | HTMLTextAreaElement = (<HTMLInputElement>$$(input).find('input'));
      if (!inputElement) {
        inputElement = (<HTMLTextAreaElement>$$(input).find('textarea'));
      }
      inputElement.value = '';
    })
  }

  private getInput(input: string): HTMLElement {
    Assert.exists(this.inputs[input]);
    var found = $$(this.inputs[input]).find('input');
    if (!found) {
      found = $$(this.inputs[input]).find('textarea');
    }
    return found;
  }
}

export class PreferencesPanelTextAreaInput extends PreferencesPanelTextInput {
  public inputTemplate = _.template('<div class=\'coveo-choice-container\'><textarea <%- otherAttribute %> class=\'coveo-<%- label %>\' id=\'coveo-<%- label %>\' name=\'<%- name%>\' placeholder=\'<%- placeholder %>\' ></textarea></div>');

  public build(): HTMLElement {
    return _.reduce(_.map(this.textElementToBuild, (toBuild) => {
      this.inputs[toBuild.label] = $$('div', undefined, this.inputTemplate({
        label: toBuild.label,
        name: this.name,
        otherAttribute: toBuild.otherAttribute,
        placeholder: toBuild.placeholder || toBuild.label
      })).el;
      return this.inputs[toBuild.label];
    }), (memo: HTMLElement, input: HTMLElement) => {
      memo.appendChild(input);
      return memo;
    }, $$('div').el)
  }
}

export class PreferencePanelMultiSelectInput {
  private textInput: PreferencesPanelTextAreaInput;
  private select: HTMLSelectElement;

  constructor(private toBuild: IPreferencePanelInputToBuild, public options: string[], public name: string) {
    this.textInput = new PreferencesPanelTextAreaInput([{ label: toBuild.label, otherAttribute: 'readonly' }], name);
  }

  public build() {
    this.select = <HTMLSelectElement>$$('select').el;
    this.select.setAttribute('multiple', 'multiple');
    _.each(this.options, (option) => {
      var optEl = $$('option', undefined, option).el;
      this.select.appendChild(optEl);
    });
    $$(this.select).on('change', () => {
      var values: string[] = _.chain(<any>this.select.options)
        .filter((opt: HTMLOptionElement) => {
          return opt.selected;
        })
        .map((opt: HTMLOptionElement) => {
          return opt.value;
        })
        .value();

      if (!Utils.isNullOrUndefined(values) && !Utils.isEmptyArray(values)) {
        this.textInput.setValue(this.toBuild.label, values.join(','));
      } else {
        this.reset();
      }
    })
    var el = this.textInput.build()
    el.appendChild(this.select);
    return el;
  }

  public getValues() {
    return this.textInput.getValues()[0].split(',');
  }

  public setValues(values: string[]) {
    this.textInput.setValue(this.toBuild.label, values.join(','));
  }

  public reset() {
    this.textInput.setValue(this.toBuild.label, '');
  }
}

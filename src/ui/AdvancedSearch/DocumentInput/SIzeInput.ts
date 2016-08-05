import {Dropdown} from '../Form/Dropdown';
import {NumericSpinner} from '../Form/NumericSpinner';
import {l} from '../../../strings/Strings';
import {$$} from '../../../utils/Dom';
import {DocumentInput} from './DocumentInput';


export class SizeInput extends DocumentInput {

  public static modes = ['AtLeast', 'AtMost'];
  public static sizes = ['KB', 'MB', 'Bytes'];

  protected element: HTMLElement;
  public modeSelect: Dropdown;
  public sizeInput: NumericSpinner;
  public sizeSelect: Dropdown;

  constructor() {
    super('Size');
  }

  public build(): HTMLElement {
    let document = $$(super.build());
    this.modeSelect = new Dropdown(SizeInput.modes, 'coveo-size-input-mode');
    document.append(this.modeSelect.getElement());
    this.sizeInput = new NumericSpinner();
    document.append(this.sizeInput.getElement());
    this.sizeSelect = new Dropdown(SizeInput.sizes, 'coveo-size-input-select');
    document.append(this.sizeSelect.getElement());
    this.element = document.el;
    return this.element;
  }

  public getValue(): string {
    let size = this.getSizeInBytes();
    if (size) {
      switch (this.modeSelect.getValue()) {
        case 'AtLeast':
          return '@size>=' + this.getSizeInBytes()
        default:
          return '@size<=' + this.getSizeInBytes();
      }
    }
    return '';
  }

  private getSizeInBytes(): number {
    let size = this.sizeInput.getFloatValue();
    switch (this.sizeSelect.getValue()) {
      case 'KB':
        return size * 1024;
      case 'MB':
        return size * Math.pow(1024, 2)
      default:
        return size;
    }
  }

}

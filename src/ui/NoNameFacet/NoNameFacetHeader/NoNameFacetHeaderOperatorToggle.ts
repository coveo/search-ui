import { $$ } from '../../../utils/Dom';
import { NoNameFacetHeaderAnd } from './NoNameFacetHeaderAnd';
import { NoNameFacetHeaderOr } from './NoNameFacetHeaderOr';

export interface INoNameFacetOperatorToggleOptions {
  useAnd: boolean;
}

export class NoNameFacetHeaderOperatorToggle {
  private andButton: NoNameFacetHeaderAnd;
  private orButton: NoNameFacetHeaderOr;

  constructor(private options: INoNameFacetOperatorToggleOptions) {
    this.andButton = new NoNameFacetHeaderAnd({ onClick: this.switchToOr });
    this.orButton = new NoNameFacetHeaderOr({ onClick: this.switchToAnd });
  }

  public create() {
    const parent = $$('div');
    parent.append(this.andButton.create());
    parent.append(this.orButton.create());
    this.toggle(this.options.useAnd);

    return parent.el;
  }

  private toggle = (useAnd: boolean) => {
    this.andButton.toggle(useAnd);
    this.orButton.toggle(!useAnd);
  };

  private switchToAnd = () => {
    this.toggle(true);
    // TODO: change operator
  };

  private switchToOr = () => {
    this.toggle(false);
    // TODO: change operator
  };
}

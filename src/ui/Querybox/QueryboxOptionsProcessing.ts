import { Omnibox, IOmniboxOptions } from '../Omnibox/Omnibox';
import { Querybox, IQueryboxOptions } from './Querybox';
import { ComponentOptionsModel } from '../../models/ComponentOptionsModel';

export class QueryboxOptionsProcessing {
  constructor(public owner: Omnibox | Querybox) {}

  private get options() {
    return this.owner.options;
  }

  private set options(options: IOmniboxOptions | IQueryboxOptions) {
    this.owner.options = options;
  }

  public postProcess() {
    this.options = { ...this.options, ...this.owner.componentOptionsModel.get(ComponentOptionsModel.attributesEnum.searchBox) };
    this.processQueryOnClearVersusEmptyQuery();
    this.processQueryOnClearVersusSearchAsYouType();
  }

  private processQueryOnClearVersusEmptyQuery() {
    if (this.options.triggerQueryOnClear && this.owner.searchInterface.options.allowQueriesWithoutKeywords === false) {
      this.owner.logger.warn(
        'Forcing option triggerQueryOnClear to false, as it is not supported when the search interface is configured to not allow queries without keywords (data-allow-queries-without-keywords="false")',
        this.owner
      );
      this.options.triggerQueryOnClear = false;
    }
  }

  private processQueryOnClearVersusSearchAsYouType() {
    if (
      this.owner.searchInterface.options.allowQueriesWithoutKeywords === true &&
      this.options.triggerQueryOnClear === false &&
      this.options.enableSearchAsYouType === true
    ) {
      this.owner.logger.warn('Forcing option triggerQueryOnClear to true, since search-as-you-type is enabled', this.owner);
      this.options.triggerQueryOnClear = true;
    }
  }
}

import { ISearchEndpoint } from '../../rest/SearchEndpointInterface';
import { AllKeywordsInput } from './KeywordsInput/AllKeywordsInput';
import { ExactKeywordsInput } from './KeywordsInput/ExactKeywordsInput';
import { AnyKeywordsInput } from './KeywordsInput/AnyKeywordsInput';
import { NoneKeywordsInput } from './KeywordsInput/NoneKeywordsInput';
import { AnytimeDateInput } from './DateInput/AnytimeDateInput';
import { InTheLastDateInput } from './DateInput/InTheLastDateInput';
import { BetweenDateInput } from './DateInput/BetweenDateInput';
import { IAdvancedSearchInput } from './AdvancedSearchInput';
import { SimpleFieldInput } from './DocumentInput/SimpleFieldInput';
import { AdvancedFieldInput } from './DocumentInput/AdvancedFieldInput';
import { SizeInput } from './DocumentInput/SizeInput';
import { IFieldInputParameters } from './AdvancedSearchInput';

export class AdvancedSearchInputFactory {
  constructor(private endpoint: ISearchEndpoint, private root: HTMLElement) {}

  public create(name: string, options?: IFieldInputParameters): IAdvancedSearchInput {
    switch (name) {
      case 'keywords_all':
        return this.createAllKeywordsInput();
      case 'keywords_exact':
        return this.createExactKeywordsInput();
      case 'keywords_any':
        return this.createAnyKeywordsInput();
      case 'keywords_none':
        return this.createNoneKeywordsInput();
      case 'date_any':
        return this.createAnytimeDateInput();
      case 'date_last':
        return this.createInTheLastDateInput();
      case 'date_between':
        return this.createBetweenDateInput();
      case 'document_field':
        return this.createSimpleFieldInput(options.name, options.field);
      case 'document_advanced_field':
        return this.createAdvancedFieldInput(options.name, options.field);
      case 'document_size':
        return this.createSizeInput();
      default:
        return null;
    }
  }

  public createAllKeywordsInput(): AllKeywordsInput {
    return new AllKeywordsInput(this.root);
  }

  public createExactKeywordsInput(): ExactKeywordsInput {
    return new ExactKeywordsInput(this.root);
  }

  public createAnyKeywordsInput(): AnyKeywordsInput {
    return new AnyKeywordsInput(this.root);
  }

  public createNoneKeywordsInput(): NoneKeywordsInput {
    return new NoneKeywordsInput(this.root);
  }

  public createAnytimeDateInput(): AnytimeDateInput {
    return new AnytimeDateInput(this.root);
  }

  public createInTheLastDateInput(): InTheLastDateInput {
    return new InTheLastDateInput(this.root);
  }

  public createBetweenDateInput(): BetweenDateInput {
    return new BetweenDateInput(this.root);
  }

  public createSimpleFieldInput(name: string, field: string): SimpleFieldInput {
    return new SimpleFieldInput(name, field, this.endpoint, this.root);
  }

  public createAdvancedFieldInput(name: string, field: string): AdvancedFieldInput {
    return new AdvancedFieldInput(name, field, this.root);
  }

  public createSizeInput() {
    return new SizeInput(this.root);
  }
}

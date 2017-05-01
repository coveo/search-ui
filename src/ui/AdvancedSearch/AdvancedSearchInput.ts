import { QueryBuilder } from '../Base/QueryBuilder';
import { NumericSpinner } from '../FormWidgets/NumericSpinner';
import { DatePicker } from '../FormWidgets/DatePicker';
import { Dropdown } from '../FormWidgets/Dropdown';
import { TextInput } from '../FormWidgets/TextInput';
import { RadioButton } from '../FormWidgets/RadioButton';

/**
 * The basic types of form available to build an advanced search section.
 */
export type BaseFormTypes = NumericSpinner | DatePicker | Dropdown | TextInput | RadioButton;

export interface IAdvancedSearchInput {
  build: () => HTMLElement;
  updateQuery: (queryBuilder: QueryBuilder) => void;
  reset: () => void;
}

export interface IAdvancedSearchPrebuiltInput {
  name: string;
  parameters?: IFieldInputParameters;
}

export interface IFieldInputParameters {
  name: string;
  field: string;
}

/**
 * Describe a section in the {@link AdvancedSearch} component
 */
export interface IAdvancedSearchSection {
  /**
   * The name of the section.
   */
  name: string;
  /**
   * The array of inputs to populate.
   *
   * External code should only push inputs that match the type {@link BaseFormTypes}.
   */
  inputs: (IAdvancedSearchInput | IAdvancedSearchPrebuiltInput)[];
}

/**
 * Describe a section populated by external code, using the {@link AdvancedSearchEvents.buildingAdvancedSearch}
 */
export interface IExternalAdvancedSearchSection extends IAdvancedSearchSection {
  /**
   * An handler to execute every time a new query is launched.
   *
   * The handler will receive the inputs used to build the external section, as well as the queryBuilder object to allow to modify the query.
   * @param inputs
   * @param queryBuilder
   */
  updateQuery: (inputs: BaseFormTypes[], queryBuilder: QueryBuilder) => void;
  /**
   * The content to add to the external section, as an HTMLElement.
   */
  content: HTMLElement;
}

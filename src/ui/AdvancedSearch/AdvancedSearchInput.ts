import {QueryBuilder} from '../Base/QueryBuilder';
import {NumericSpinner} from "./Form/NumericSpinner";
import {DatePicker} from "./Form/DatePicker";
import {Dropdown} from "./Form/Dropdown";
import {TextInput} from "./Form/TextInput";

export type BaseFormTypes = NumericSpinner | DatePicker | Dropdown | TextInput;

export interface IAdvancedSearchInput {
  build: () => HTMLElement;
  updateQuery: (queryBuilder: QueryBuilder) => void;
}

export interface IAdvancedSearchPrebuiltInput {
  name: string;
  parameters?: IFieldInputParameters;
}

export interface IFieldInputParameters {
  name: string;
  field: string;
}

export interface IAdvancedSearchSection {
  name: string;
  inputs: (IAdvancedSearchInput | IAdvancedSearchPrebuiltInput)[];
}

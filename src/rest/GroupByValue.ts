import {IIndexFieldValue} from './FieldValue';

export interface IGroupByValue extends IIndexFieldValue {
  value: string;
  lookupValue?: string;
  numberOfResults: number;
  score: number;
  computedFieldResults?: number[];
}

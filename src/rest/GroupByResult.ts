import {IGroupByValue} from './GroupByValue';

export interface IGroupByResult {
  field: string;
  values: IGroupByValue[];
  globalComputedFieldResults?: number[];
}

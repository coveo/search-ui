import {IGroupByValue} from './GroupByValue';

export interface GroupByResult {
  field: string;
  values: IGroupByValue[];
  globalComputedFieldResults?: number[];
}
import { IAPIAnalyticsFacetSelection } from './APIAnalyticsFacetSelection';

export interface IAPIAnalyticsFacet {
  name: string;
  fieldName: string;
  sort: string;
  mode: string;
  selections: IAPIAnalyticsFacetSelection[];
}

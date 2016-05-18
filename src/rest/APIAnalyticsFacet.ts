import {APIAnalyticsFacetSelection} from './APIAnalyticsFacetSelection';

export interface APIAnalyticsFacet {
  name: string;
  fieldName: string;
  sort: string;
  mode: string;
  selections: APIAnalyticsFacetSelection[];
}

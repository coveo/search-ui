import {IAdvancedSearchSection} from '../ui/AdvancedSearch/AdvancedSearchInput'

export interface IBuildingAdvancedSearchEventArgs {
  sections: IAdvancedSearchSection[];
}

export class AdvancedSearchEvents {
  public static buildingAdvancedSearch = 'buildingAdvancedSearch';
}

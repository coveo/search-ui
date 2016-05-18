import {OmniboxData, OmniboxDataRow} from '../ui/Omnibox/OmniboxInterface';

export interface IPopulateOmniboxEventArgs extends OmniboxData {
}

export interface IPopulateOmniboxEventRow extends OmniboxDataRow {
}

export interface IOmniboxPreprocessResultForQueryEventArgs {
  result: Coveo.MagicBox.Result;
}

export interface ICloseOmniboxEventArgs {
}

export class OmniboxEvents {
  public static populateOmnibox = 'populateOmnibox';
  public static openOmnibox = 'openOmnibox';
  public static closeOmnibox = 'closeOmnibox';

  public static populateOmniboxSuggestions = 'populateOmniboxSuggestions';
  public static omniboxPreprocessResultForQuery = 'omniboxPreprocessResultForQuery';
}

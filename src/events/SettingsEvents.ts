



module Coveo {
  export interface ISettingsPopulateMenuArgs {
    settings: Settings;
    menuData: MenuItem[];
  }

  export class SettingsEvents {
    public static settingsPopulateMenu = 'settingsPopulateMenu';
  }
}
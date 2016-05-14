/// <reference path='../Base.ts' />
/// <reference path='../ui/Menu/MenuItem.ts' />
/// <reference path='../ui/Settings/Settings.ts' />

module Coveo {
  export interface ISettingsPopulateMenuArgs {
    settings: Settings;
    menuData: MenuItem[];
  }

  export class SettingsEvents {
    public static settingsPopulateMenu = 'settingsPopulateMenu';
  }
}
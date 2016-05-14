/// <reference path='../Base.ts' />

module Coveo {
  export interface SavePreferencesEventArgs {
  }

  export class PreferencesPanelEvents {
    public static savePreferences = 'savePreferences';
    public static exitPreferencesWithoutSave = 'exitPreferencesWithoutSave';
  }
}
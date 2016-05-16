

module Coveo {
  export interface StatusBarPhonegapPlugin {
    //https://github.com/phonegap-build/StatusBarPlugin
    overlaysWebView(toggle: boolean): void;
    styleDefault(): void;
    styleLightContent(): void;
    styleBlackTranslucent(): void;
    styleBlackOpaque(): void;
    backgroundColorByName(name: string): void;
    backgroundColorByHexString(hexColor: string): void;
    hide(): void;
    show(): void;
  }

  export interface EmailComposerPhonegapPlugin_0_8_1 {
    //https://github.com/katzer/cordova-plugin-email-composer/tree/f4fcee88c47c7ac642cceb27d3d8b31edd26a8f6
    open: (opener: EmailComposerPhonegapPlugin_0_8_1_opener_object) => void;
  }

  export interface EmailComposerPhonegapPlugin_0_8_1_opener_object {
    to?: string[];
    cc?: string[];
    bcc?: string[];
    attachments?: string[];
    subject?: string;
    body?: string;
    isHtml?: boolean;
  }

  export interface NetworkNetworkInformationPhonegapPluginState_0_2_7 {
    UNKNOWN : number;
    ETHERNET : number;
    WIFI: number;
    CELL_2G: number;
    CELL_3G: number;
    CELL_4G: number;
    CELL: number;
    NONE: number;
  }

  export interface NetworkInformationPhonegapPlugin_0_2_7 {
    type : any;
  }
  export interface PhonegapIonicKeyboard_1_0_3 {
    //https://github.com/driftyco/ionic-plugins-keyboard/tree/ca27ecf
    hideKeyboardAccessoryBar(boolean): void;
    close(): void;
    show(): void;
    disableScroll(boolean): void;
  }
}

interface Window {
  Connection: Coveo.NetworkNetworkInformationPhonegapPluginState_0_2_7;
  plugins: any;
  plugin: {
    email?: Coveo.EmailComposerPhonegapPlugin_0_8_1;
  };
  cordova: {
    plugins: {
      Keyboard?: Coveo.PhonegapIonicKeyboard_1_0_3;
    }
  }
}
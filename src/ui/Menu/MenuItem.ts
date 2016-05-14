/// <reference path="../../Base.ts" />

module Coveo {
  export interface MenuItem {
    text: string;
    className:string;
    tooltip?: string;
    index?: number;
    onOpen: () => void;
    onClose?: () => void;
  }
}
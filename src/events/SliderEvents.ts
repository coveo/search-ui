

module Coveo {
  export interface StartSlideEventArgs {
    slider: Slider;
    button: SliderButton;
  }

  export interface DuringSlideEventArgs {
    slider: Slider;
    button: SliderButton;
  }

  export interface EndSlideEventArgs {
    slider: Slider;
    button: SliderButton;
  }

  export interface GraphValueSelectedArgs {
    start: any;
    end: any;
    value: any;
  }

  export class SliderEvents {
    public static startSlide = 'startSlide';
    public static duringSlide = 'duringSlide';
    public static endSlide = 'endSlide';
    public static graphValueSelected = 'graphValueSelected';
  }
}
export interface IGraphValueSelectedArgs {
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

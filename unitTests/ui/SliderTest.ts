import { Slider } from '../../src/ui/Misc/Slider';
import { $$ } from '../../src/utils/Dom';
import { ISliderGraphData } from '../../src/ui/Misc/Slider';
import { SearchInterface } from '../../src/ui/SearchInterface/SearchInterface';
import * as Globalize from 'globalize';
import _ = require('underscore');

export function SliderTest() {
  describe('Slider', () => {
    var slider: Slider;
    var el: HTMLElement;
    var root: HTMLElement;

    function getSliderButton(sliderElement: HTMLElement) {
      return $$(sliderElement).findAll('.coveo-slider-button');
    }

    function getSliderCaption(sliderElement: HTMLElement) {
      return $$(sliderElement).find('.coveo-slider-caption');
    }

    function getSliderGraph(sliderElement: HTMLElement) {
      return $$(sliderElement).find('svg');
    }

    function buildGraphData(): ISliderGraphData[] {
      let graphData: ISliderGraphData[] = _.map(_.range(0, 10, 1), range => {
        return {
          start: range * 10,
          end: (range + 1) * 10,
          y: Math.random()
        };
      });
      return graphData;
    }

    beforeEach(() => {
      el = document.createElement('div');
      el.style.width = '100px';
      root = document.createElement('div');
    });

    afterEach(() => {
      el = null;
      slider = null;
      root = null;
    });

    describe('with position calculation', () => {
      // Unfortunately, in a UT context, many of this component methods relies heavily on width calculation inside the browser
      // Since it's all simulated, those test cannot give the correct position value.
      // Instead for those methods, we simply test that it does not throw, at least ...
      beforeEach(() => {
        slider = new Slider(
          el,
          {
            start: 0,
            end: 100,
            rangeSlider: true
          },
          root
        );

        slider.element.style.width = '100px';
        slider.element.style.height = '100px';
      });

      it('should not throw on moving', () => {
        expect(() => slider.onMoving()).not.toThrow();
      });

      it('should give position on initializing state', () => {
        expect(() => slider.initializeState([25, 75])).not.toThrow();
        expect(() => slider.getPosition()).not.toThrow();
        expect(() => slider.getPercentPosition()).not.toThrow();
        expect(() => slider.getValues()).not.toThrow();
        expect(slider.getValues()).toEqual([25, 75]);
      });

      it('should give position when initializing state with no value', () => {
        expect(() => slider.initializeState()).not.toThrow();
        expect(() => slider.getPosition()).not.toThrow();
        expect(() => slider.getPercentPosition()).not.toThrow();
        expect(() => slider.getValues()).not.toThrow();
        expect(slider.getValues()).toEqual([0, 100]);
      });

      it('should give the caption from the requested values', () => {
        expect(slider.getCaptionFromValue([50, 70])).toEqual('50  - 70 ');
      });

      it('should allow to set values', () => {
        slider.setValues([10, 24]);
        expect(slider.getValues()).toEqual([10, 24]);
      });
    });

    describe('exposes options', () => {
      it('rangeSlider allows to have one or two button', () => {
        slider = new Slider(
          el,
          {
            start: 0,
            end: 100,
            rangeSlider: false
          },
          root
        );

        expect(getSliderButton(slider.element).length).toBe(1);
        slider = new Slider(
          document.createElement('div'),
          {
            start: 0,
            end: 100,
            rangeSlider: true
          },
          root
        );

        expect(getSliderButton(slider.element).length).toBe(2);
      });

      it('start and end allow to set the max values', () => {
        slider = new Slider(
          el,
          {
            start: 10,
            end: 156
          },
          root
        );

        slider.initializeState();
        expect(slider.currentValues).toEqual(jasmine.arrayContaining([10, 156]));

        slider.setValues([0, 1000]);
        expect(slider.currentValues).toEqual(jasmine.arrayContaining([10, 156]));

        slider.setValues([0, 100]);
        expect(slider.currentValues).toEqual(jasmine.arrayContaining([10, 100]));

        slider.setValues([50, 51]);
        expect(slider.currentValues).toEqual(jasmine.arrayContaining([50, 51]));
      });

      it('step allows to divide the range by a number of steps', () => {
        slider = new Slider(
          el,
          {
            start: 0,
            end: 100,
            steps: 2
          },
          root
        );

        expect(slider.steps).toEqual(jasmine.arrayContaining([0, 50, 100]));

        slider = new Slider(
          el,
          {
            start: 0,
            end: 100,
            steps: 25
          },
          root
        );
        expect(slider.steps).toEqual(jasmine.arrayContaining(_.range(0, 104, 4)));
      });

      it('step should not go above 100 for performance reason', () => {
        slider = new Slider(
          el,
          {
            start: 0,
            end: 1000,
            steps: 1000
          },
          root
        );

        expect(slider.steps).toEqual(jasmine.arrayContaining(_.range(0, 1000, 10)));
      });

      it('getSteps allow to provide a function to generate steps', () => {
        var getStep = jasmine.createSpy('getStep');
        slider = new Slider(
          el,
          {
            start: 0,
            end: 100,
            getSteps: getStep
          },
          root
        );

        expect(getStep).toHaveBeenCalledWith(0, 100);
      });

      it('displayAsValue allows to modify the caption', () => {
        slider = new Slider(
          el,
          {
            start: 0,
            end: 100,
            displayAsValue: {
              unitSign: 'GIGAFLOPETABYTE',
              separator: '!!',
              enable: true
            }
          },
          root
        );
        slider.initializeState();
        expect($$(getSliderCaption(slider.element)).text()).toBe('0 GIGAFLOPETABYTE !! 100 GIGAFLOPETABYTE');
      });

      it('valueCaption allow to provide a function to generate captions', () => {
        var valueCaption = jasmine.createSpy('valueCaption');
        slider = new Slider(
          el,
          {
            start: 0,
            end: 100,
            valueCaption: valueCaption
          },
          root
        );
        slider.initializeState();
        expect(valueCaption).toHaveBeenCalledWith(jasmine.arrayContaining([0, 100]));
      });

      it('dateField and dateFormat allow to render the values as date', () => {
        var start = new Date(1, 1, 1),
          end = new Date(2, 2, 2);

        slider = new Slider(
          el,
          {
            start: start,
            end: end,
            dateField: true,
            dateFormat: 'm/d/yyyy'
          },
          root
        );

        slider.initializeState();
        expect($$(getSliderCaption(slider.element)).text()).toBe(
          Globalize.format(start, 'm/d/yyyy') + '  - ' + Globalize.format(end, 'm/d/yyyy') + ' '
        );
      });

      describe('with graph data', () => {
        let graphData: ISliderGraphData[];

        beforeEach(() => {
          slider = new Slider(
            el,
            {
              start: 0,
              end: 100,
              graph: {
                steps: 10,
                margin: {
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0
                }
              }
            },
            root
          );
          new SearchInterface(root);

          slider.element.style.width = '100px';
          slider.element.style.height = '100px';

          graphData = buildGraphData();
        });

        afterEach(() => {
          graphData = null;
        });

        it('should not throw on moving', () => {
          expect(() => slider.onMoving()).not.toThrow();
        });

        it('graph steps allow draw graph data', () => {
          slider.drawGraph(graphData);
          expect($$(getSliderGraph(slider.element)).findAll('rect').length).toBe(10);
        });

        it('graph data where the start equals the end should be modified to something logical', () => {
          graphData[0] = { start: 5, end: 5, y: 1, isDate: false };
          slider.drawGraph(graphData);
          expect(graphData[0].start).toEqual(0);
          expect(graphData[0].end).toEqual(10);
        });

        it('graph data that does not match the total range of the slider should be padded at the beginning', () => {
          // remove 2 from the beginning of the data
          graphData = graphData.slice(2);
          expect(graphData.length).toEqual(8);
          slider.drawGraph(graphData);
          // draw 10 rect, even if there's only 8 values to render
          expect($$(getSliderGraph(slider.element)).findAll('rect').length).toBe(10);
        });

        it('graph data that does not match the total range of the slider should be padded at the end', () => {
          // remove 2 from the end of the data
          graphData = graphData.slice(0, graphData.length - 2);
          expect(graphData.length).toEqual(8);
          slider.drawGraph(graphData);
          // draw 10 rect, even if there's only 8 values to render
          expect($$(getSliderGraph(slider.element)).findAll('rect').length).toBe(10);
        });
      });
    });
  });
}

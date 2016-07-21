/// <reference path="../Test.ts" />

module Coveo {
  describe('Slider', function () {
    var slider: Slider;
    var el: HTMLElement;
    var root: HTMLElement;

    function getSliderLine(sliderElement: HTMLElement) {
      return $$(sliderElement).findAll('.coveo-slider-line');
    }

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
      let graphData: ISliderGraphData[] = _.map(_.range(0, 10, 1), (range) => {
        return {
          start: range * 10,
          end: (range + 1) * 10,
          y: Math.random()
        }
      })
      return graphData;
    }

    beforeEach(function () {
      el = document.createElement('div');
      el.style.width = '100px';
      root = document.createElement('div');
    })

    afterEach(function () {
      el = null;
      slider = null;
      root = null;
    })

    describe('exposes options', function () {

      it('rangeSlider allows to have one or two button', function () {
        slider = new Slider(el, {
          start: 0,
          end: 100,
          rangeSlider: false
        }, root)

        expect(getSliderButton(slider.element).length).toBe(1);

        slider = new Slider(document.createElement('div'), {
          start: 0,
          end: 100,
          rangeSlider: true
        }, root)

        expect(getSliderButton(slider.element).length).toBe(2);
      })

      it('start and end allow to set the max values', function () {
        slider = new Slider(el, {
          start: 10,
          end: 156
        }, root)

        slider.initializeState();
        expect(slider.currentValues).toEqual(jasmine.arrayContaining([10, 156]));

        slider.setValues([0, 1000]);
        expect(slider.currentValues).toEqual(jasmine.arrayContaining([10, 156]));

        slider.setValues([0, 100]);
        expect(slider.currentValues).toEqual(jasmine.arrayContaining([10, 100]));

        slider.setValues([50, 51]);
        expect(slider.currentValues).toEqual(jasmine.arrayContaining([50, 51]));
      })

      it('step allows to divide the range by a number of steps', function () {
        slider = new Slider(el, {
          start: 0,
          end: 100,
          steps: 2
        }, root)

        expect(slider.steps).toEqual(jasmine.arrayContaining([0, 50, 100]))

        slider = new Slider(el, {
          start: 0,
          end: 100,
          steps: 25
        }, root)
        expect(slider.steps).toEqual(jasmine.arrayContaining(_.range(0, 104, 4)));
      })

      it('getSteps allow to provide a function to generate steps', function () {
        var getStep = jasmine.createSpy('getStep');
        slider = new Slider(el, {
          start: 0,
          end: 100,
          getSteps: getStep
        }, root)

        expect(getStep).toHaveBeenCalledWith(0, 100);
      })

      it('displayAsValue allows to modify the caption', function () {
        slider = new Slider(el, {
          start: 0,
          end: 100,
          displayAsValue: {
            unitSign: 'GIGAFLOPETABYTE',
            separator: '!!',
            enable: true
          }
        }, root)
        slider.initializeState();
        expect($$(getSliderCaption(slider.element)).text()).toBe('0 GIGAFLOPETABYTE !! 100 GIGAFLOPETABYTE');
      })

      it('valueCaption allow to provide a function to generate captions', function () {
        var valueCaption = jasmine.createSpy('valueCaption');
        slider = new Slider(el, {
          start: 0,
          end: 100,
          valueCaption: valueCaption
        }, root)
        slider.initializeState();
        expect(valueCaption).toHaveBeenCalledWith(jasmine.arrayContaining([0, 100]));
      })

      it('dateField and dateFormat allow to render the values as date', function () {
        var start = new Date(1, 1, 1),
          end = new Date(2, 2, 2)
        slider = new Slider(el, {
          start: start,
          end: end,
          dateField: true,
          dateFormat: 'm/d/yyyy'
        }, root)

        slider.initializeState();
        expect($$(getSliderCaption(slider.element)).text()).toBe(Globalize.format(start, 'm/d/yyyy') + '  - ' + Globalize.format(end, 'm/d/yyyy') + ' ');
      })

      it('graph allow to add a svg graph', function () {
        slider = new Slider(el, {
          start: 0,
          end: 100,
          graph: {
            steps: 10
          }
        }, root)

        expect(getSliderGraph(slider.element)).toBeDefined();
      })

      it('graph steps allow draw graph data', function () {
        slider = new Slider(el, {
          start: 0,
          end: 100,
          graph: {
            steps: 10
          }
        }, root);
        new SearchInterface(root);

        slider.element.style.width = '100px';
        slider.element.style.height = '100px';
        let graphData: ISliderGraphData[] = buildGraphData();
        slider.drawGraph(graphData);
        expect($$(getSliderGraph(slider.element)).findAll('rect').length).toBe(10);
      })
    })
  })
}

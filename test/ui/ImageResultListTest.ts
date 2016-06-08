/// <reference path="../Test.ts" />

module Coveo {
  describe('ImageResultList', () => {
    var test: Mock.IBasicComponentSetup<ImageResultList>

    beforeEach(function () {
      test = Mock.basicComponentSetup<ImageResultList>(ImageResultList);
    });

    afterEach(function () {
      $$(test.env.root).trigger(InitializationEvents.nuke);
      clearDOM();
      test = null;
    })

    it('should put only one div under the ImageResultList element', () => {
      expect($$(test.cmp.element).findAll('div').length).toEqual(1);
    })

    it('should not put results at the same position', () => {
      createImageResultList('row');

      Simulate.query(test.env);
      $$(test.cmp.root).trigger(ResultListEvents.newResultsDisplayed);

      expectAllDifferentPositions();
    })

    it('it should not overlap results', () => {
      createImageResultList('row');

      Simulate.query(test.env);
      $$(test.cmp.root).trigger(ResultListEvents.newResultsDisplayed);

      expectResultsAreNotOverlapping();
    })

    it('should keep the original image ratio', () => {
      let imageWidth = 150.0;
      let imageHeight = 250.0;
      let initialRatio = imageWidth / imageHeight;
      createImageResultList('row', undefined, undefined, imageWidth, imageHeight);

      Simulate.query(test.env);
      $$(test.cmp.root).trigger(ResultListEvents.newResultsDisplayed);

      let image = $$(test.cmp.element).find('img');
      expect($$(image).width() / $$(image).height()).toBeCloseTo(initialRatio, 0.01);
    })

    describe('exposes column width option', () => {
      it('should set the width in the column layout', () => {
        let width = 100;
        createImageResultList('column', width, undefined, undefined, undefined, 'div');

        Simulate.query(test.env);
        $$(test.cmp.root).trigger(ResultListEvents.newResultsDisplayed);

        expect($$($$(test.cmp.element).find('.CoveoResult')).width()).toEqual(width);
      })
    })

    describe('exposes option heightThreshold', () => {
      it('should set the max height for the row', () => {
        let maxHeight = 10;
        createImageResultList('row', undefined, maxHeight, 20, maxHeight + 50);

        Simulate.query(test.env);
        $$(test.cmp.root).trigger(ResultListEvents.newResultsDisplayed);

        expect($$($$(test.cmp.element).find('.CoveoResult img')).height()).toEqual(maxHeight);
      })
    })

    function createImageResultList(layoutType?: string, columnWidth?: number, heightThreshold?: number, maxImageWidth: number = 200, maxImageHeight: number = 300, resultLayoutElement: string = 'span') {
      test = Mock.optionsComponentSetup<ImageResultList, IImageResultListOptions>(ImageResultList, {
        resultTemplate: new Template((object: any) => {
          return `<${resultLayoutElement}>
                    <img width='${maxImageWidth}px' height='${maxImageHeight}px'></img>
                  </${resultLayoutElement}>`;
        }),
        layoutType: layoutType,
        heightThreshold: heightThreshold,
        columnWidth: columnWidth
      });
      $$(document.body).append(test.cmp.element);
    }

    function clearDOM() {
      let body = $$(document.body);
      if (body.findClass('CoveoImageResultList').length > 0) {
        document.body.removeChild(test.cmp.element);
      }
    }

    function expectAllDifferentPositions() {
      let lastPosition = null;
      let images = $$(test.cmp.element).findAll('.CoveoResult');
      _.each(images, (image: HTMLElement) => {
        let position = {
          top: image.offsetTop,
          left: image.offsetLeft
        }

        if (lastPosition != null) {
          expect(position).not.toEqual(lastPosition);
        }

        lastPosition = position;
      })

    }

    function expectResultsAreNotOverlapping() {
      let lastPosition = null;
      let lastWidth = null;
      let lastHeight = null;
      let images = $$(test.cmp.element).findAll('.CoveoResult');
      _.each(images, (image: HTMLElement) => {
        let position = {
          top: image.offsetTop,
          left: image.offsetLeft
        }

        if (lastPosition != null) {
          expect(position).not.toEqual(lastPosition);

          if (lastPosition.top == position.top) {
            expect(position.left + 2).toBeGreaterThan(lastPosition.left + lastWidth);
          } else if (lastPosition.left == position.left) {
            expect(position.top + 2).toBeGreaterThan(lastPosition.top + lastHeight)
          }
        }

        lastPosition = position;
        lastWidth = $$(image).width();
        lastHeight = $$(image).height();

      })
    }

  })
}

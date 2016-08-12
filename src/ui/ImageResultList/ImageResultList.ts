import {ResultList, IResultListOptions} from '../ResultList/ResultList';
import {ComponentOptions} from '../Base/ComponentOptions';
import {IComponentBindings} from '../Base/ComponentBindings';
import {ImageResultListEvents} from '../../events/ImageResultListEvents';
import {ResultListEvents} from '../../events/ResultListEvents';
import {Initialization} from '../Base/Initialization';
import {InitializationEvents} from '../../events/InitializationEvents';
import {$$} from '../../utils/Dom';

export interface IImageResultListOptions extends IResultListOptions {
  layoutType?: string;
  heightThreshold?: number;
  columnWidth?: number;
}

/**
 * This component is an extension of the ResultList component to display image results.
 */
export class ImageResultList extends ResultList {
  static ID = 'ImageResultList';
  static rowLayoutTypeStr = 'row';
  static columnLayoutTypeStr = 'column';

  /**
   * The options for the component.
   * This component inherits the options of the {@link ResultList} component.
   * @componentOptions
   */
  static options: IImageResultListOptions = {
    /**
     * Specifies the type of layout used to display images results.
     * The available values are:
     *    row - Displays resized images that fit to the width of the container and have the same height for a row.
     *    column - Displays the images in fixed-size columns.
     * The default value is row.
     */
    layoutType: ComponentOptions.buildStringOption({
      defaultValue: 'row',
      postProcessing: (value: string) => value.toLowerCase()
    }),
    /**
     * Specifies the maximum height of a row in a row layout.
     * The default value is 250.
     */
    heightThreshold: ComponentOptions.buildNumberOption({ defaultValue: 250, min: 16 }),
    /**
     * Specifies the width of a column in a column layout.
     * The default value is 170.
     */
    columnWidth: ComponentOptions.buildNumberOption({ defaultValue: 225, min: 16 })
  }

  private columnResultsArray: number[] = [];
  private imagesInCurrentRow: number[] = [];
  private resultIndex: number = 0;
  private lastRowHeight: number = 0;

  constructor(public element: HTMLElement, public options?: IImageResultListOptions, bindings?: IComponentBindings, elementClassId: string = ResultList.ID) {

    super(element, options, bindings, ImageResultList.ID);

    this.options = ComponentOptions.initComponentOptions(element, ImageResultList, options);

    this.lastRowHeight = this.options.heightThreshold;

    this.bind.onRootElement(ResultListEvents.newResultsDisplayed, this.handleProcessNewResultsDisplayed);
    this.bind.onRootElement(InitializationEvents.nuke, this.handleNuke);
    this.bindWindowResizeEvent();
  }

  private getResultsElement(): HTMLElement[] {
    return $$(this.element).findAll('.CoveoResult');
  }

  private getResultsElementImages(): HTMLElement[] {
    return $$(this.element).findAll('.CoveoResult img');
  }

  private getResultsContainerDiv(): HTMLElement {
    return $$(this.element).find('div');
  }

  private bindWindowResizeEvent() {
    window.addEventListener('resize', this.resize);
  }

  private handleNuke() {
    window.removeEventListener('resize', this.resize);
  }

  private resize() {
    let timeout;
    clearTimeout(timeout);
    timeout = setTimeout(this.retrieveLayoutMethod(), 250);
  }

  private handleProcessNewResultsDisplayed() {
    if (this.disabled) {
      $$(this.element).hide();
    } else {
      $$(this.element).show();
    }
    this.onImageProxy(this.retrieveLayoutMethod());
  }

  private addTransitionAllToElement(elements: HTMLElement[]) {
    _.defer(() => {
      _.each(elements, (element) => {
        $$(element).addClass('coveo-transition-all');
      })
    });
  }

  private retrieveLayoutMethod(): () => void {
    if (!this.disabled) {
      if (this.options.layoutType.toLowerCase() == ImageResultList.columnLayoutTypeStr) {
        return () => this.setupColumns();
      } else if (this.options.layoutType.toLowerCase() == ImageResultList.rowLayoutTypeStr) {
        return () => this.setupRows();
      }
    }
    return () => {
    };
  }

  private onImageProxy(callback: () => void) {
    _.each(this.getResultsElement(), (element: HTMLElement) => {
      if ($$(element).findAll('img').length == 0) {
        $$(element).detach();
      }
    });

    let images = this.getResultsElementImages();
    let loaded = 0;
    let onImageLoad = (image: HTMLImageElement) => {
      if ($$(image).height() > 0) {
        if ($$(image).getAttribute('width') == null && $$(image).getAttribute('height') == null) {
          $$(image).setAttribute('height', $$(image).height().toString());
          $$(image).setAttribute('width', $$(image).width().toString());
        }
        loaded++;
        if (loaded == images.length) {
          callback()
        }
      } else {
        $$(image.parentElement).detach();
        images = _.filter(images, (img) => {
          return !img.isEqualNode(image);
        })
        if (loaded == images.length) {
          callback()
        }
      }
    }
    _.each(images, (e: HTMLImageElement) => {
      if ((e.src && e.complete) || /*for IE 10-*/ $$(e).height() > 0) {
        onImageLoad(e);
      } else {
        $$(e).one('load', () => { onImageLoad(e) });
      }
    });
  }

  private getHorizontalMargin(element: HTMLElement) {
    let elementDom = $$(element);
    return parseInt(elementDom.css('margin-left')) + parseInt(elementDom.css('margin-right'));
  }

  private getVerticalMargin(element: HTMLElement) {
    let elementDom = $$(element);
    return parseInt(elementDom.css('margin-top')) + parseInt(elementDom.css('margin-bottom'));
  }

  private setupColumns() {
    let containerWidth = $$(this.getResultsContainerDiv()).width();
    let result = this.getResultsElement();
    let colWidth = this.options.columnWidth;
    let margin = this.getHorizontalMargin(result[0]);

    let numberOfColumns = Math.floor(containerWidth / (colWidth + margin));

    this.columnResultsArray = [];
    for (let i = 0; i < numberOfColumns; i++) {
      this.columnResultsArray.push(margin);
    }

    this.positionColumns(colWidth, margin);
    $$(this.element).trigger(ImageResultListEvents.imageResultsLayoutComplete, {});

    if (this.options.enableInfiniteScroll) {
      this.adjustNumberOfResults();
    }
  }

  private positionColumns(colWidth: number, margin: number) {
    let results = this.getResultsElement();

    _.each(results, result => {
      let minTopOffset = _.min(this.columnResultsArray);
      let resultIndex = this.columnResultsArray.indexOf(minTopOffset);
      let leftOffset = margin + (resultIndex * (colWidth + margin));

      result.style.left = leftOffset + 'px';
      result.style.top = minTopOffset + 'px';
      result.style.width = colWidth + 'px';

      this.columnResultsArray[resultIndex] = minTopOffset + $(result).outerHeight() + margin;
    });
    this.setResultsContainerHeight(_.max(this.columnResultsArray));

    this.addTransitionAllToElement(results);
  }

  private setResultsContainerHeight(height: number) {
    $$(this.element).setAttribute('height', (Math.ceil(height).toString()));
  }

  private setupRows() {
    let results = this.getResultsElement();
    let containerWidth = $$(this.element).width();
    this.resultIndex = 0;
    let topOffset = 0;
    while (this.resultIndex < results.length) {
      this.imagesInCurrentRow = [];
      let rowHeight = this.getCurrentRowHeight(results, containerWidth);
      this.setCurrentRowImagesDimensions(results, rowHeight, topOffset);
      topOffset += rowHeight;
    }
    this.setResultsContainerHeight(topOffset);
    $$(this.element).trigger(ImageResultListEvents.imageResultsLayoutComplete, {});
    this.addTransitionAllToElement(results);

    if (this.options.enableInfiniteScroll) {
      this.adjustNumberOfResults();
    }
  }

  private getCurrentRowHeight(results: HTMLElement[], containerWidth: number): number {
    let divider = 0;
    let height: number = null;
    while ((this.resultIndex < results.length) && (height == null || height >= this.options.heightThreshold)) {
      let imageDimensions = this.getImageDimensionsFromResult(results[this.resultIndex]);
      if (imageDimensions != null) {
        divider += imageDimensions.width / imageDimensions.height;
        height = containerWidth / divider;
      }
      this.imagesInCurrentRow.push(this.resultIndex);
      this.resultIndex++;
    }
    // correct height for last element if it can't be as wide as the container
    if (height > this.options.heightThreshold) {
      height = this.lastRowHeight;
    }
    this.lastRowHeight = height;
    return height;
  }

  private getImageDimensionsFromResult(result: HTMLElement) {
    let image = $$(result).find('img');
    let height = parseInt(image.getAttribute('height'));
    let width = parseInt(image.getAttribute('width'));

    return {
      height: height,
      width: width
    };
  }

  private setCurrentRowImagesDimensions(images: HTMLElement[], height: number, top: number) {
    let leftOffset = 0;
    _.each(this.imagesInCurrentRow, imageIndex => {
      let image = $$(images[imageIndex]).find('img');
      let oldWidth = parseInt(image.getAttribute('width'));
      let oldHeight = parseInt(image.getAttribute('height'));
      let width = oldWidth * height / oldHeight;
      let widthMargin = this.getHorizontalMargin(image);
      let heightMargin = this.getVerticalMargin(image);

      image.setAttribute('height', Math.round(height - heightMargin).toString());
      image.setAttribute('width', Math.round(width - widthMargin).toString());
      image.setAttribute('left', Math.round(leftOffset).toString());
      image.setAttribute('top', Math.round(top).toString());

      leftOffset += width;
    });
  }

  private adjustNumberOfResults() {
    let elementHeight = Number($$(this.element).getAttribute('data-height'));

    if (_.isNumber(elementHeight) == false) {
      elementHeight = $$(this.element).height();
    }

    if ((elementHeight < $$(<HTMLElement>this.options.infiniteScrollContainer).height()) && super.hasPotentiallyMoreResultsToDisplay()) {
      super.displayMoreResults(this.options.infiniteScrollPageSize);
    }
  }
}

Initialization.registerAutoCreateComponent(ImageResultList);

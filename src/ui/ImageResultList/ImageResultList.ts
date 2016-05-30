export interface ImageResultListOptions extends IResultListOptions {
  layoutType?: string;
  heightThreshold?: number;
  columnWidth?: number;
}

export class ImageResultList extends ResultList {
  static ID = 'ImageResultList';
  static rowLayoutTypeStr = 'row';
  static columnLayoutTypeStr = 'column';

  static options: ImageResultListOptions = {
    layoutType: ComponentOptions.buildStringOption({
      defaultValue: 'row',
      postProcessing: (value: string) => value.toLowerCase()
    }),
    heightThreshold: ComponentOptions.buildNumberOption({ defaultValue: 250, min: 16 }),
    columnWidth: ComponentOptions.buildNumberOption({ defaultValue: 225, min: 16 })
  }

  private columnResultsArray: number[] = [];
  private imagesInCurrentRow: number[] = [];
  private imagesLoaded = 0;
  private resultIndex: number = 0;
  private lastRowHeight: number = 0;

  constructor(public element: HTMLElement,
    public options?: ImageResultListOptions,
    bindings?: IComponentBindings,
    elementClassId: string = Coveo.ResultList.ID) {

    super(element, options, bindings, ImageResultList.ID);

    this.options = ComponentOptions.initComponentOptions(element, ImageResultList, options);

    this.lastRowHeight = this.options.heightThreshold;

    $(this.root).on(ResultListEvents.newResultsDisplayed, $.proxy(this.handleProcessNewResultsDisplayed, this));
    this.bind.onRoot(InitializationEvents.nuke, this.handleNuke);
    this.bindWindowResizeEvent();
  }

  private getResultsElement(): JQuery {
    return $(this.element).find('.CoveoResult');
  }

  private getResultsElementImages(): JQuery {
    return $(this.element).find('.CoveoResult img');
  }

  private getResultsContainerDiv(): JQuery {
    return $(this.element).find('> div');
  }

  private bindWindowResizeEvent() {
    $(window).on('resize', this.resize);
  }

  private handleNuke() {
    $(window).off('resize', this.resize);
  }

  private resize() {
    let timeout;
    clearTimeout(timeout);
    timeout = setTimeout(this.retrieveLayoutMethod(), 250);
  }

  private handleProcessNewResultsDisplayed() {
    if (this.disabled) {
      $(this.element).fadeOut();
    } else {
      $(this.element).fadeIn();
    }
    this.onImageProxy(this.retrieveLayoutMethod());
  }

  private addTransitionAllToElement(element: JQuery) {
    _.defer(() => {
      element.addClass('coveo-transition-all');
    });
  }

  private retrieveLayoutMethod(): () => void {
    let oncomplete: () => any;
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
    let results = this.getResultsElement().each((i, e) => {
      if ($(e).find('img').length == 0) {
        $(e).detach();
      }
    });

    let images = this.getResultsElementImages();
    let loaded = 0;
    let onImageLoad = (image: HTMLImageElement) => {
      if ($(image).height() > 0) {
        if ($(image).attr('width') == null && $(image).attr('height') == null) {
          $(image).attr('height', $(image).height());
          $(image).attr('width', $(image).width());
        }
        loaded++;
        if (loaded == images.length) {
          callback()
        }
      } else {
        $(image).parent().detach();
        images = images.not(image);
        if (loaded == images.length) {
          callback()
        }
      }
    }
    images.each(function(i, e: HTMLImageElement) {
      if ((this.src && this.complete) || /*for IE 10-*/ $(e).height() > 0) {
        onImageLoad(e);
      } else {
        $(e).off('load').one('load', function() {
          onImageLoad(e);
        });
      }
    });
  }

  private getHorizontalMargin(element: JQuery) {
    return parseInt(element.css('margin-left')) + parseInt(element.css('margin-right'));
  }

  private getVerticalMargin(element: JQuery) {
    return parseInt(element.css('margin-top')) + parseInt(element.css('margin-bottom'));
  }

  private setupColumns() {
    let containerWidth = this.getResultsContainerDiv().width();
    let result = this.getResultsElement();
    let colWidth = this.options.columnWidth;
    let margin = this.getHorizontalMargin(result);

    let numberOfColumns = Math.floor(containerWidth / (colWidth + margin));

    this.columnResultsArray = [];
    for (let i = 0; i < numberOfColumns; i++) {
      this.columnResultsArray.push(margin);
    }

    this.positionColumns(colWidth, margin);
    $(this.element).trigger(ImageResultListEvents.imageResultsLayoutComplete, {});

    if (this.options.enableInfiniteScroll) {
      this.adjustNumberOfResults();
    }
  }

  private positionColumns(colWidth: number, margin: number) {
    let results = this.getResultsElement();

    _.each(results, result => {
      let minTopOffset = _.min(this.columnResultsArray);
      let resultIndex = $.inArray(minTopOffset, this.columnResultsArray);
      let leftOffset = margin + (resultIndex * (colWidth + margin));

      $(result).css({
        'left': leftOffset + 'px',
        'top': minTopOffset + 'px',
        'width': colWidth + 'px'
      });

      this.columnResultsArray[resultIndex] = minTopOffset + $(result).outerHeight() + margin;
    });
    this.setResultsContainerHeight(_.max(this.columnResultsArray));

    this.addTransitionAllToElement(results);
  }

  private setResultsContainerHeight(height: number) {
    $(this.element).height(Math.ceil(height));
    $(this.element).attr('data-height', Math.ceil(height));
  }

  private setupRows() {
    let results = this.getResultsElement();
    let containerWidth = $(this.element).width();
    this.resultIndex = 0;
    let topOffset = 0;

    while (this.resultIndex < results.length) {
      this.imagesInCurrentRow = [];
      let rowHeight = this.getCurrentRowHeight(results, containerWidth);
      this.setCurrentRowImagesDimensions(results, rowHeight, topOffset);
      topOffset += rowHeight;
    }
    this.setResultsContainerHeight(topOffset);
    $(this.element).trigger(ImageResultListEvents.imageResultsLayoutComplete, {});
    this.addTransitionAllToElement(results);

    if (this.options.enableInfiniteScroll) {
      this.adjustNumberOfResults();
    }
  }

  private getCurrentRowHeight(results: JQuery, containerWidth: number): number {
    let divider = 0;
    let height: number = null;
    while ((this.resultIndex < results.length) && (height == null || height >= this.options.heightThreshold)) {
      let imageDimensions = this.getImageDimensionsFromResult(results.eq(this.resultIndex));
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

  private getImageDimensionsFromResult(result: JQuery) {
    let image = result.find('img');
    let height = parseInt(image.attr('height'));
    let width = parseInt(image.attr('width'));

    return {
      height: height,
      width: width
    };
  }

  private setCurrentRowImagesDimensions(images: JQuery, height: number, top: number) {
    let leftOffset = 0;
    _.each(this.imagesInCurrentRow, imageIndex => {
      let oldWidth = parseInt(images.eq(imageIndex).find('img').attr('width'));
      let oldHeight = parseInt(images.eq(imageIndex).find('img').attr('height'));
      let width = oldWidth * height / oldHeight;
      let widthMargin = this.getHorizontalMargin(images.eq(imageIndex));
      let heightMargin = this.getVerticalMargin(images.eq(imageIndex));

      images.eq(imageIndex).css({
        'height': Math.round(height - heightMargin),
        'width': Math.round(width - widthMargin),
        'left': Math.round(leftOffset),
        'top': Math.round(top)
      });

      leftOffset += width;
    });
  }

  private adjustNumberOfResults() {
    let elementHeight = Number($(this.element).attr('data-height'));

    if ($.isNumeric(elementHeight) == false) {
      elementHeight = $(this.element).height();
    }

    if ((elementHeight < $(this.options.infiniteScrollContainer).height()) && super.hasPotentiallyMoreResultsToDisplay()) {
      super.displayMoreResults(this.options.infiniteScrollPageSize);
    }
  }
}

Coveo.Initialization.registerAutoCreateComponent(ImageResultList);

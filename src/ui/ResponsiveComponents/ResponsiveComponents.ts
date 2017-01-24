export const MEDIUM_SCREEN_WIDTH = 800;
export const SMALL_SCREEN_WIDTH = 480;
export const SMALL_SCREEN_HEIGHT = 640;

export class ResponsiveComponents {
  private smallScreenWidth: number;
  private mediumScreenWidth: number;

  public setSmallScreenWidth(width: number) {
    this.smallScreenWidth = width;
  }

  public setMediumScreenWidth(width: number) {
    this.mediumScreenWidth = width;
  }

  public getSmallScreenWidth() {
    if (this.smallScreenWidth == null) {
      return SMALL_SCREEN_WIDTH;
    }
    return this.smallScreenWidth;
  }

  public getMediumScreenWidth() {
    if (this.mediumScreenWidth == null) {
      return MEDIUM_SCREEN_WIDTH;
    }
    return this.mediumScreenWidth;
  }

  public isSmallScreenWidth() {
    if (window['clientWidth'] != null && window['clientWidth'] <= this.getSmallScreenWidth()) {
      return true;
    }
    return document.body.clientWidth <= this.getSmallScreenWidth();
  }

  public isMediumScreenWidth() {
    if (this.isSmallScreenWidth()) {
      return false;
    }
    if (window['clientWidth'] != null && window['clientWidth'] <= this.getMediumScreenWidth()) {
      return true;
    }
    return document.body.clientWidth <= this.getMediumScreenWidth();
  }

  public isLargeScreenWidth() {
    return !this.isSmallScreenWidth() && !this.isMediumScreenWidth();
  }
}

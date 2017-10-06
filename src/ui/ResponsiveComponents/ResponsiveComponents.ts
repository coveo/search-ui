import { Assert } from '../../misc/Assert';
import 'styling/_ResponsiveComponents';

export const MEDIUM_SCREEN_WIDTH = 800;
export const SMALL_SCREEN_WIDTH = 480;

/**
 * This class serves as a way to get and set the different screen size breakpoints for the interface.
 *
 * By setting those, you can impact, amongst others, the {@link Facet}'s, {@link Tab}'s or the {@link ResultList}'s behaviour.
 *
 * For example, the {@link Facet} components of your interface will switch to a dropdown menu when the screen size reaches 800px or less.
 *
 * You could modify this value using `this` calls
 *
 * Normally, you would interact with this class using the instance bound to {@link SearchInterface.responsiveComponents}
 */
export class ResponsiveComponents {
  private smallScreenWidth: number;
  private mediumScreenWidth: number;

  constructor(public windoh: Window = window) {}

  /**
   * Set the breakpoint for small screen size.
   * @param width
   */
  public setSmallScreenWidth(width: number) {
    Assert.check(
      width < this.getMediumScreenWidth(),
      `Cannot set small screen width (${width}) larger or equal to the current medium screen width (${this.getMediumScreenWidth()})`
    );
    this.smallScreenWidth = width;
  }

  /**
   * Set the breakpoint for medium screen size
   * @param width
   */
  public setMediumScreenWidth(width: number) {
    Assert.check(
      width > this.getSmallScreenWidth(),
      `Cannot set medium screen width (${width}) smaller or equal to the current small screen width (${this.getSmallScreenWidth()})`
    );
    this.mediumScreenWidth = width;
  }

  /**
   * Get the current breakpoint for small screen size.
   *
   * If it was not explicitly set by {@link ResponsiveComponents.setSmallScreenWidth}, the default value is `480`.
   * @returns {number}
   */
  public getSmallScreenWidth() {
    if (this.smallScreenWidth == null) {
      return SMALL_SCREEN_WIDTH;
    }
    return this.smallScreenWidth;
  }

  /**
   * Get the current breakpoint for medium screen size.
   *
   * If it was not explicitly set by {@link ResponsiveComponents.setMediumScreenWidth}, the default value is `800`.
   * @returns {number}
   */
  public getMediumScreenWidth() {
    if (this.mediumScreenWidth == null) {
      return MEDIUM_SCREEN_WIDTH;
    }
    return this.mediumScreenWidth;
  }

  /**
   * Return true if the current screen size is smaller than the current breakpoint set for small screen width.
   * @returns {boolean}
   */
  public isSmallScreenWidth() {
    if (this.windoh['clientWidth'] != null) {
      return this.windoh['clientWidth'] <= this.getSmallScreenWidth();
    } else {
      return document.body.clientWidth <= this.getSmallScreenWidth();
    }
  }

  /**
   * Return true if the current screen size is smaller than the current breakpoint set for medium screen width.
   * @returns {boolean}
   */
  public isMediumScreenWidth() {
    if (this.isSmallScreenWidth()) {
      return false;
    }
    if (this.windoh['clientWidth'] != null) {
      return this.windoh['clientWidth'] <= this.getMediumScreenWidth();
    }
    return document.body.clientWidth <= this.getMediumScreenWidth();
  }

  /**
   * Return true if the current screen size is larger than the current breakpoint set for medium and small.
   * @returns {boolean}
   */
  public isLargeScreenWidth() {
    return !this.isSmallScreenWidth() && !this.isMediumScreenWidth();
  }
}

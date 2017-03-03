import { Assert } from '../misc/Assert';

/**
 * The possible options to use when calculating a timespan
 */
export interface ITimeSpanUtilsOptions {
  /**
   * Specify if the given timespan is in seconds or milliseconds
   */
  isMilliseconds: boolean;
}

export class TimeSpan {
  private milliseconds: number;

  constructor(time: number, isMilliseconds = true) {
    if (isMilliseconds) {
      this.milliseconds = time;
    } else {
      this.milliseconds = time * 1000;
    }
  }

  getMilliseconds() {
    return this.milliseconds;
  }

  getSeconds() {
    return this.getMilliseconds() / 1000;
  }

  getMinutes() {
    return this.getSeconds() / 60;
  }

  getHours() {
    return this.getMinutes() / 60;
  }

  getDays() {
    return this.getHours() / 24;
  }

  getWeeks() {
    return this.getDays() / 7;
  }

  getHHMMSS(): string {
    var hours = Math.floor(this.getHours());
    var minutes = Math.floor(this.getMinutes()) % 60;
    var seconds = Math.floor(this.getSeconds()) % 60;
    var hoursString, minutesString, secondsString;
    if (hours == 0) {
      hoursString = '';
    } else {
      hoursString = hours < 10 ? '0' + hours.toString() : hours.toString();
    }
    minutesString = minutes < 10 ? '0' + minutes.toString() : minutes.toString();
    secondsString = seconds < 10 ? '0' + seconds.toString() : seconds.toString();
    var hhmmss = (hoursString != '' ? hoursString + ':' : '') + minutesString + ':' + secondsString;
    return hhmmss;
  }

  static fromDates(from: Date, to: Date): TimeSpan {
    Assert.exists(from);
    Assert.exists(to);
    return new TimeSpan(to.valueOf() - from.valueOf());
  }
}

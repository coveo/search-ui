import { QueryController } from '../controllers/QueryController';
import { ISentryLog } from '../rest/SentryLog';
import { DeviceUtils } from '../utils/DeviceUtils';
import * as _ from 'underscore';

export class SentryLogger {
  constructor(private queryController: QueryController, private windoh: Window = window) {
    this.bindErrorHandler();
  }

  private bindErrorHandler() {
    // take care of not overriding any existing onerror handler that might be already present in the page.
    let oldHandler = this.windoh.onerror;
    if (_.isFunction(oldHandler)) {
      this.windoh.onerror = (...args: any[]) => {
        oldHandler.apply(oldHandler, args);
        this.handleError.apply(this, args);
      };
    } else {
      this.windoh.onerror = this.handleError.bind(this);
    }
  }

  private handleError(message: string, filename?: string, lineno?: number, colno?: number, error?: Error) {
    // try not to log irrelevant errors ...
    if (!filename.toLowerCase().match(/coveo/) || this.windoh.location.host.toLowerCase().match(/localhost/)) {
      return;
    }

    let errorInfo = {
      message: message,
      filename: filename,
      line: lineno,
      column: colno,
      error: error.toString(),
      errorStack: error['stack'], // Not all browser will return this,
      device: DeviceUtils.getDeviceName()
    };

    let sentryLog: ISentryLog = {
      level: 'DEBUG',
      title: this.windoh.location.href,
      message: JSON.stringify(errorInfo)
    };

    this.queryController.getEndpoint().logError(sentryLog);
  }
}

import {QueryController} from '../controllers/QueryController';
import {Utils} from '../utils/Utils';
import {Logger} from './Logger';
import {ISentryLog} from '../rest/SentryLog';
import {DeviceUtils} from '../utils/DeviceUtils';

export class SentryLogger {
  private logger: Logger;

  constructor(private queryController: QueryController, private windoh: Window = window) {
    this.logger = new Logger(this);
    this.bindErrorHandler();
  }

  private bindErrorHandler() {
    // Do not override any onerror function that might be already present in the page.
    if (Utils.isNullOrUndefined(this.windoh.onerror)) {
      this.windoh.onerror = this.handleError.bind(this);
    } else {
      this.logger.info('SentryLogger will be deactivated since there is already an onerror function in the page');
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

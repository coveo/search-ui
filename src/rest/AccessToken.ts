import { IErrorResponse } from './EndpointCaller';
import { Logger } from '../misc/Logger';
import { debounce } from 'underscore';

export type onRenew = (newToken: string) => void;

export class AccessToken {
  private subscribers: onRenew[] = [];
  private logger: Logger = new Logger(this);
  private stopAllRenewalAttempt = false;
  private triedRenewals: number = 0;
  private resetRenewalTriesAfterDelay;

  constructor(public token: string, public renew?: () => Promise<string>) {
    this.resetRenewalTriesAfterDelay = debounce(
      () => {
        this.triedRenewals = 0;
      },
      500,
      false
    );
  }

  public isExpired(error: IErrorResponse) {
    return true;
    //return this.canDoRenew() && error != null && error.statusCode != null && error.statusCode == 419;
  }

  public async doRenew(onError?: (error: Error) => void): Promise<Boolean> {
    this.triedRenewals++;
    this.resetRenewalTriesAfterDelay();

    if (!this.canDoRenew()) {
      return false;
    }

    try {
      this.logger.info('Renewing expired access token');
      this.token = await this.renew();
      this.logger.info('Access token renewed', this.token);
      this.subscribers.forEach(subscriber => subscriber(this.token));
      return true;
    } catch (error) {
      this.logger.error('Failed to renew access token', error);

      if (onError) {
        onError(error);
      } else {
        throw error;
      }

      return false;
    }
  }

  public afterRenew(afterRenew: onRenew) {
    if (this.canDoRenew()) {
      this.subscribers.push(afterRenew);
    }
  }

  public canDoRenew() {
    if (this.stopAllRenewalAttempt) {
      return false;
    }

    if (this.renew == null) {
      this.logger.error(`AccessToken tried to renew, but no function is configured on initialization to provide acess token renewal`);
      return false;
    }
    if (this.triedRenewals >= 5) {
      this.stopAllRenewalAttempt = true;
      this.logger.error('AccessToken tried to renew itself extremely fast in a short period of time');
      this.logger.error('There is most probably an authentication error, or a bad implementation of the custom renew function');
      this.logger.error('Inspect the developer console of your browser to find out the root cause');
      return false;
    }
    return true;
  }
}

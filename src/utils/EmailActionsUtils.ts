import { IQueryResult } from '../rest/QueryResult';
import { l } from '../strings/Strings';
import _ = require('underscore');

export interface IMailToOptions {
  currentUserEmail?: string;
  originalFrom?: string;
  to?: string;
  subject?: string;
  cc?: string;
  bcc?: string;
  body?: string;
  bodyIsHTML?: boolean;
}

export class EmailActionsUtils {
  static buildMailToString(options: IMailToOptions): string {
    var mailTo = options.to ? 'mailto:' + encodeURIComponent(options.to) : 'mailto:';
    var parameters = EmailActionsUtils.buildMailToParametersString(options.subject, options.cc, options.bcc, options.body, mailTo);
    if (parameters) {
      mailTo += '?' + parameters;
    }
    return mailTo;
  }

  static buildMailToParametersString(subject: string, cc: string, bcc: string, body: string, mailTo: string): string {
    var parametersArray = [];
    if (subject) {
      parametersArray.push(EmailActionsUtils.buildMailToParameter('subject', subject));
    }
    if (cc) {
      parametersArray.push(EmailActionsUtils.buildMailToParameter('cc', cc));
    }
    if (bcc) {
      parametersArray.push(EmailActionsUtils.buildMailToParameter('bcc', bcc));
    }
    if (body) {
      var shortenBody = EmailActionsUtils.getShortenBody(body, mailTo + '?' + parametersArray.join('&'));
      if (shortenBody) {
        parametersArray.push(EmailActionsUtils.buildMailToParameter('body', shortenBody));
      }
    }
    return parametersArray.join('&');
  }

  static getShortenBody(body: string, mailTo: string) {
    var shortenBody = body;
    if (mailTo.length < MailTo.maxLength) {
      var maxBodyLength = MailTo.maxLength - mailTo.length - '&body='.length;
      shortenBody = EmailActionsUtils.shortenString(body, maxBodyLength);
    }
    return shortenBody;
  }

  static buildMailToParameter(name: string, param: string): string {
    return param ? encodeURIComponent(name) + '=' + encodeURIComponent(param) : '';
  }

  static shortenString(str: string, maxLength: number, encodeShortenBodyIndication: boolean = false): string {
    /* There is a size limit on mailto url,
     * Depending on the browser, the mailto will not open if too large. */
    var shortenBodyIndicator = encodeShortenBodyIndication ? encodeURIComponent(MailTo.shortenBodyIndicator) : MailTo.shortenBodyIndicator;
    maxLength = maxLength - MailTo.shortenBodyIndicator.length;
    var sliced = str.length > maxLength ? true : false;
    var shortenStr = str.substring(0, maxLength);
    shortenStr += sliced ? shortenBodyIndicator : '';
    return shortenStr;
  }

  static appendShortenBodyToMailToString(mailTo: string, body: string): string {
    var shortenBody = EmailActionsUtils.getShortenBody(body, mailTo);
    return mailTo.indexOf('?') >= 0 ? mailTo + '&body=' + shortenBody : mailTo + '?body=' + shortenBody;
  }

  static removeCurrentUserEmailFromString(currentUserEmail: string, str: string): string {
    if (str && currentUserEmail) {
      return _.filter<string>(str.split(';'), (email) => {
        return email.indexOf(currentUserEmail) == -1;
      }).join(';');
    } else {
      return str;
    }
  }

  static buildReplyMailToFromResult(result: IQueryResult, currentUserEmail: string): MailTo {
    return new MailTo({
      currentUserEmail: currentUserEmail,
      originalFrom: result.raw.from,
      to: result.raw.from,
      subject: result.raw.conversationsubject,
    });
  }

  static buildReplyAllMailToFromResult(result: IQueryResult, currentUserEmail: string): MailTo {
    return new MailTo({
      currentUserEmail: currentUserEmail,
      originalFrom: result.raw.from,
      to: result.raw.from + ';' + result.raw.to,
      subject: result.raw.conversationsubject,
      cc: result.raw.cc,
    });
  }

  static buildForwardMailToFromResult(result: IQueryResult, currentUserEmail: string): MailTo {
    return new MailTo({
      currentUserEmail: currentUserEmail,
      originalFrom: result.raw.from,
      subject: result.raw.conversationsubject,
    });
  }

  static encodeMailToBody(body: string): string {
    var linesArray = body.split('\n');
    _.each(linesArray, (line, index) => {
      linesArray[index] = encodeURIComponent(linesArray[index]);
    });
    return linesArray.join(MailTo.enter);
  }
}

export class DefaultMailToOptions implements IMailToOptions {
  currentUserEmail: string = '';
  originalFrom: string = '';
  to: string = '';
  subject: string = '';
  cc: string = '';
  bcc: string = '';
  body: string = '';
}

export class MailTo {
  private value: string;
  private body: string;
  private bodyHeader: string = '';
  static enter: string = '%0D%0A'; // \r\n
  static shortenBodyIndicator: string = '\r\n\r\n...';
  // Arbitrary numbers :
  static maxLength: number = 1000;

  constructor(public options?: IMailToOptions) {
    this.options = _.extend(new DefaultMailToOptions(), options);
    this.removeCurrentUserFromParameters();
    if (this.options.originalFrom) {
      this.bodyHeader = this.options.bodyIsHTML ? '<p><br/><br/><br/>' + l('From') + ': ' + this.options.originalFrom + '<hr></p>' :
        '\n\n\n' + l('From') + ': ' + this.options.originalFrom + '\n_________________________________\n';
    }
  }

  private removeCurrentUserFromParameters() {
    this.options.to = EmailActionsUtils.removeCurrentUserEmailFromString(this.options.currentUserEmail, this.options.to);
    this.options.cc = EmailActionsUtils.removeCurrentUserEmailFromString(this.options.currentUserEmail, this.options.cc);
    this.options.bcc = EmailActionsUtils.removeCurrentUserEmailFromString(this.options.currentUserEmail, this.options.bcc);
  }

  public open() {
    this.ensureValueIsSet();
    window.location.href = this.value;
  }

  private ensureValueIsSet() {
    if (!this.value) {
      this.setValue();
    } else if (!this.valueBodyIsSet()) {
      this.setValueBody();
    }
  }

  private setValue() {
    this.value = EmailActionsUtils.buildMailToString(this.options);
    if (this.value && !this.valueBodyIsSet()) {
      this.setValueBody();
    }
  }

  private setValueBody() {
    this.value = EmailActionsUtils.appendShortenBodyToMailToString(this.value, this.body);
  }

  public setMailToBodyFromText(text = '') {
    this.body = text;
  }

  private valueBodyIsSet() {
    return this.value.indexOf('body=') >= 0;
  }

  public bodyIsSet(): boolean {
    return this.body ? true : false;
  }
}

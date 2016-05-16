
module Coveo {
  export class EmailActionsUtils {
    static buildMailToString(options: MailToOptions): string {
      var mailTo = options.to ? "mailto:" + encodeURIComponent(options.to) : "mailto:";
      var parameters = EmailActionsUtils.buildMailToParametersString(options.subject, options.cc, options.bcc, options.body, mailTo);
      if (parameters) {
        mailTo += "?" + parameters;
      }
      return mailTo;
    }

    static buildMailToParametersString(subject: string, cc: string, bcc: string, body: string, mailTo: string): string {
      var parametersArray = [];
      if (subject) {
        parametersArray.push(EmailActionsUtils.buildMailToParameter("subject", subject));
      }
      if (cc) {
        parametersArray.push(EmailActionsUtils.buildMailToParameter("cc", cc));
      }
      if (bcc) {
        parametersArray.push(EmailActionsUtils.buildMailToParameter("bcc", bcc));
      }
      if (body) {
        var shortenBody = EmailActionsUtils.getShortenBody(body, mailTo + "?" + parametersArray.join('&'));
        if (shortenBody) {
          parametersArray.push(EmailActionsUtils.buildMailToParameter("body", shortenBody));
        }
      }
      return parametersArray.join('&');
    }

    static getShortenBody(body: string, mailTo: string) {
      var shortenBody = body;
      if (mailTo.length < MailTo.maxLength) {
        var maxBodyLength = MailTo.maxLength - mailTo.length - "&body=".length;
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
      return mailTo.indexOf('?') >= 0 ? mailTo + "&body=" + shortenBody : mailTo + "?body=" + shortenBody;
    }

    static removeCurrentUserEmailFromString(currentUserEmail: string, str: string): string {
      if (str && currentUserEmail) {
        return _.filter<string>(str.split(";"), (email) => {
          return email.indexOf(currentUserEmail) == -1
           }).join(";")
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
        to: result.raw.from + ";" + result.raw.to,
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
}
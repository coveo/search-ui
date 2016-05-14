/// <reference path="../../Base.ts" />
/// <reference path="../../utils/EmailActionsUtils.ts" />
/// <reference path="../Phonegap/PhonegapPlugins.ts" />
/// <reference path="../../misc/Options.ts" />

module Coveo {
  export interface MailToOptions {
    currentUserEmail?: string;
    originalFrom?: string;
    to?: string;
    subject?: string;
    cc?: string;
    bcc?: string;
    body?: string;
    bodyIsHTML?: boolean;
  }

  export class DefaultMailToOptions extends Options implements MailToOptions {
    currentUserEmail: string = "";
    originalFrom: string = "";
    to: string = "";
    subject: string = "";
    cc: string = "";
    bcc: string = "";
    body: string = "";
    bodyIsHTML: boolean = DeviceUtils.isPhonegap()
  }

  export class MailTo {
    private value: string;
    private toArray: string[];
    private ccArray: string[];
    private bccArray: string[];
    private body: string;
    private bodyHeader: string = "";
    static enter: string = '%0D%0A'; // \r\n
    static shortenBodyIndicator: string = '\r\n\r\n...';
    // Arbitrary numbers :
    static maxLength: number = 1000;
    static phonegapMaxLength: number = 15000;

    constructor(public options?: MailToOptions) {
      this.options = new DefaultMailToOptions().merge(options);
      this.removeCurrentUserFromParameters();
      if (DeviceUtils.isPhonegap()) {
        this.setRecipientsArrays();
      }
      if (this.options.originalFrom) {
        this.bodyHeader = this.options.bodyIsHTML ? "<p><br/><br/><br/>" + l("From") + ": " + this.options.originalFrom + "<hr></p>" :
        "\n\n\n" + l("From") + ": " + this.options.originalFrom + "\n_________________________________\n"
      }
    }

    private removeCurrentUserFromParameters() {
      this.options.to = EmailActionsUtils.removeCurrentUserEmailFromString(this.options.currentUserEmail, this.options.to);
      this.options.cc = EmailActionsUtils.removeCurrentUserEmailFromString(this.options.currentUserEmail, this.options.cc);
      this.options.bcc = EmailActionsUtils.removeCurrentUserEmailFromString(this.options.currentUserEmail, this.options.bcc);
    }

    private setRecipientsArrays() {
      this.toArray = this.options.to ? this.options.to.split(';') : [];
      this.ccArray = this.options.cc ? this.options.cc.split(';') : [];
      this.bccArray = this.options.bcc ? this.options.bcc.split(';') : [];
    }

    public open() {
      if (DeviceUtils.isPhonegap()) {
        var shortenBody = !this.options.bodyIsHTML ? EmailActionsUtils.shortenString(this.body, MailTo.phonegapMaxLength) : this.body;
        var emailOpenerObject =
          window.plugin.email.open(this.getEmailOpenerObject(shortenBody))
      } else {
        this.ensureValueIsSet();
        window.location.href = this.value;
      }
    }

    private getEmailOpenerObject(shortenBody: string): EmailComposerPhonegapPlugin_0_8_1_opener_object {
      var obj = {
        to: this.toArray,
        cc: this.ccArray,
        bcc: this.bccArray,
        subject: this.options.subject,
        body: shortenBody,
        isHtml: this.options.bodyIsHTML
      }
      return obj;
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

    public setMailToBodyFromText(text = "") {
      this.body = text;
      if (!DeviceUtils.isPhonegap()) {
        this.body = EmailActionsUtils.encodeMailToBody(this.body);
      }
    }

    private valueBodyIsSet() {
      return this.value.indexOf('body=') >= 0;
    }

    public bodyIsSet(): boolean {
      return this.body ? true : false;
    }
  }
}
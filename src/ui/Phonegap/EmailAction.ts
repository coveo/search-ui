


module Coveo {
  export interface EmailActionOptions {
    type: string;
    currentUserEmail?: string;
  }

  export class EmailAction extends Coveo.Component {
    static ID = 'EmailAction';

    static options: EmailActionOptions = {
      type: ComponentOptions.buildStringOption({ defaultValue: "forward" }),
      currentUserEmail: ComponentOptions.buildStringOption({ defaultValue: "" })
    };

    static forward = "forward";
    static reply = "reply";
    static replyAll = "replyAll";
    private mailTo: MailTo;

    constructor(public element: HTMLElement, private actions: EmailActions, public options?: EmailActionOptions, bindings?: IComponentBindings, private result?: IQueryResult) {
      super(element, EmailAction.ID, bindings);

      this.options = ComponentOptions.initComponentOptions(element, EmailActions, options);

      this.result = result || this.resolveResult();
      this.setMailToFromResult();
      $(this.element).click(() => {
        this.showWaitingAnimation();
        if (!this.mailTo.bodyIsSet()) {
          this.appendBodyToMailTo(() => this.openMailTo());
        } else {
          this.openMailTo();
        }
      });
    }

    private showWaitingAnimation() {
      this.actions.loadingAnimation.style.display = null;
    }

    private hideWaitingAnimation() {
      this.actions.loadingAnimation.style.display = 'none';
    }

    private setMailToFromResult() {
      switch (this.options.type) {
        case EmailAction.reply:
          this.mailTo = EmailActionsUtils.buildReplyMailToFromResult(this.result, this.options.currentUserEmail);
          $(this.element).append(l("Reply"));
          break;
        case EmailAction.replyAll:
          this.mailTo = EmailActionsUtils.buildReplyAllMailToFromResult(this.result, this.options.currentUserEmail);
          $(this.element).append(l("ReplyAll"));
          break;
        case EmailAction.forward:
          $(this.element).append(l("Forward"));
          this.mailTo = EmailActionsUtils.buildForwardMailToFromResult(this.result, this.options.currentUserEmail);
          break;
        default:
          this.mailTo = new MailTo({});
          break;
      }
    }

    private appendBodyToMailTo(callback: (res) => void) {
      if (!DeviceUtils.isPhonegap()) {
        this.queryController.getEndpoint().getDocumentText(this.result.uniqueId)
          .then((res) => this.doneRetrieveBody(res, callback))
          .catch(() => this.doneRetrieveBody("", callback));
      } else {
        var endPoint = this.queryController.getEndpoint();
        var promise: Promise<any>;
        if (DeviceUtils.isAndroid()) {
          promise = endPoint.getDocumentText(this.result.uniqueId)
            .then((res) => {
              this.doneRetrieveBody(res, callback);
            })
        } else {
          promise = endPoint.getDocumentHtml(this.result.uniqueId)
            .then((res) => {
              this.doneRetrieveBody(res.getElementsByTagName("body")[0].innerHTML, callback);
            })
        }
        promise.catch(() => {
          this.doneRetrieveBody('', callback);
        })
      }
    }

    private doneRetrieveBody(res, callback: (res) => void) {
      var text = res.content ? res.content : res;
      this.mailTo.setMailToBodyFromText(text);
      callback(res);
    }

    private openMailTo() {
      this.mailTo.open();
      this.hideWaitingAnimation();
    }
  }
}

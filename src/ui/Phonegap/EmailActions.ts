

module Coveo {
  export interface EmailActionsOptions {
    currentUserEmail?: string;
    reply?: boolean;
    replyAll?: boolean;
    forward?: boolean;
  }

  export class EmailActions extends Coveo.Component {
    static ID = 'EmailActions';

    static options: EmailActionsOptions = {
      currentUserEmail: ComponentOptions.buildStringOption({ defaultValue: '' }),
      reply: ComponentOptions.buildBooleanOption({ defaultValue: true }),
      replyAll: ComponentOptions.buildBooleanOption({ defaultValue: true }),
      forward: ComponentOptions.buildBooleanOption({ defaultValue: true })
    }

    private reply: EmailAction;
    private replyAll: EmailAction;
    private forward: EmailAction;
    public loadingAnimation: HTMLElement;

    constructor(public element: HTMLElement, public options: EmailActionsOptions, bindings?: IComponentBindings, private result?: IQueryResult) {
      super(element, EmailActions.ID, bindings);

      this.options = ComponentOptions.initComponentOptions(element, EmailActions, options);

      this.result = result || this.resolveResult();
      this.createAndAppendEmailActions();
      this.appendWaitingAnimation();
    }

    private createAndAppendEmailActions() {
      if (this.options.reply) {
        this.reply = new EmailAction($(document.createElement('div'))[0], this, {
          type: EmailAction.reply,
          currentUserEmail: this.options.currentUserEmail
        }, this.getBindings(), this.result);
        $(this.element).append(this.reply.element);
      }
      if (this.options.replyAll) {
        this.replyAll = new EmailAction($(document.createElement('div'))[0], this, {
          type: EmailAction.replyAll,
          currentUserEmail: this.options.currentUserEmail
        }, this.getBindings(), this.result);
        $(this.element).append(this.replyAll.element);
      }
      if (this.options.forward) {
        this.forward = new EmailAction($(document.createElement('div'))[0], this, {
          type: EmailAction.forward,
          currentUserEmail: this.options.currentUserEmail
        }, this.getBindings(), this.result);
        $(this.element).append(this.forward.element);
      }
    }

    private appendWaitingAnimation() {
      this.loadingAnimation = JQueryUtils.getBasicLoadingDots();
      this.loadingAnimation.style.display = "none";
      $(this.element).append(this.loadingAnimation);
      //$(this.element).append($(document.createElement('div')).addClass('coveo-wait-animation').hide());
    }
  }
  Coveo.Initialization.registerAutoCreateComponent(EmailActions);
}

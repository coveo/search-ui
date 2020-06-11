import { $$ } from '../../utils/Dom';
import { l } from '../../strings/Strings';
import { AccessibleButton } from '../../utils/AccessibleButton';
import { SVGIcons } from '../../utils/SVGIcons';

const ROOT_CLASSNAME = 'coveo-user-feedback-banner';
const CONTAINER_CLASSNAME = `${ROOT_CLASSNAME}-container`;
const LABEL_CLASSNAME = `${ROOT_CLASSNAME}-label`;
const BUTTONS_CONTAINER_CLASSNAME = `${ROOT_CLASSNAME}-buttons`;
const YES_BUTTON_CLASSNAME = `${ROOT_CLASSNAME}-yes-button`;
const NO_BUTTON_CLASSNAME = `${ROOT_CLASSNAME}-no-button`;
const BUTTON_ACTIVE_CLASSNAME = `${ROOT_CLASSNAME}-button-active`;
const THANK_YOU_BANNER_CLASSNAME = `${ROOT_CLASSNAME}-thanks`;
const THANK_YOU_BANNER_ACTIVE_CLASSNAME = `${THANK_YOU_BANNER_CLASSNAME}-active`;
const ICON_CLASSNAME = `${THANK_YOU_BANNER_CLASSNAME}-icon`;
const EXPLAIN_WHY_CLASSNAME = `${ROOT_CLASSNAME}-explain-why`;
const EXPLAIN_WHY_ACTIVE_CLASSNAME = `${EXPLAIN_WHY_CLASSNAME}-active`;

enum UsefulState {
  None,
  Yes,
  No
}

interface IButtonOptions {
  text: string;
  className: string;
  action: Function;
  icon?: {
    content: string;
    className: string;
  };
}

export enum UserFeedbackExplaination {
  NotUseful,
  Incorrect,
  HardToRead
}

export class UserFeedbackBanner {
  private isUseful = UsefulState.None;
  private yesButton: HTMLElement;
  private noButton: HTMLElement;
  private thankYouBanner: HTMLElement;
  private explainWhy: HTMLElement;

  constructor(
    private readonly sendUsefulnessAnalytics: (isUseful: boolean) => void,
    private readonly sendExplainationAnalytics: (explaination: UserFeedbackExplaination) => void
  ) {}

  public build() {
    return $$(
      'div',
      {
        className: ROOT_CLASSNAME
      },
      this.buildContainer(),
      this.buildThankYouBanner()
    ).el;
  }

  private buildContainer() {
    return $$(
      'div',
      {
        className: CONTAINER_CLASSNAME
      },
      this.buildLabel(),
      this.buildButtons()
    ).el;
  }

  private buildLabel() {
    return $$('span', { className: LABEL_CLASSNAME }, l('UsefulnessFeedbackRequest')).el;
  }

  private buildThankYouBanner() {
    return (this.thankYouBanner = $$(
      'div',
      {
        className: THANK_YOU_BANNER_CLASSNAME
      },
      $$('span', {}, l('UsefulnessFeedbackThankYou')).el,
      (this.explainWhy = this.buildButton({
        text: l('UsefulnessFeedbackExplainWhy'),
        className: EXPLAIN_WHY_CLASSNAME,
        action: () => this.requestExplaination()
      }))
    ).el);
  }

  private buildButtons() {
    return $$(
      'div',
      {
        className: BUTTONS_CONTAINER_CLASSNAME
      },
      (this.yesButton = this.buildButton({
        text: l('Yes'),
        className: YES_BUTTON_CLASSNAME,
        action: () => this.showUsefulness(true),
        icon: {
          className: ICON_CLASSNAME,
          content: SVGIcons.icons.checkYes
        }
      })),
      (this.noButton = this.buildButton({
        text: l('No'),
        className: NO_BUTTON_CLASSNAME,
        action: () => this.showUsefulness(false),
        icon: {
          className: ICON_CLASSNAME,
          content: SVGIcons.icons.clearSmall
        }
      }))
    ).el;
  }

  private buildButton(options: IButtonOptions) {
    const button = $$(
      'button',
      {
        className: options.className
      },
      ...(options.icon
        ? [$$('span', { className: options.icon.className }, options.icon.content), $$('span', {}, options.text)]
        : [options.text])
    ).el;
    new AccessibleButton()
      .withElement(button)
      .withLabel(options.text)
      .withSelectAction(() => options.action())
      .build();
    return button;
  }

  private showUsefulness(isUseful: boolean) {
    if (this.isUseful !== UsefulState.None && isUseful === (this.isUseful === UsefulState.Yes)) {
      return;
    }
    this.isUseful = isUseful ? UsefulState.Yes : UsefulState.No;
    this.yesButton.classList.toggle(BUTTON_ACTIVE_CLASSNAME, isUseful);
    this.noButton.classList.toggle(BUTTON_ACTIVE_CLASSNAME, !isUseful);
    this.thankYouBanner.classList.add(THANK_YOU_BANNER_ACTIVE_CLASSNAME);
    this.explainWhy.classList.toggle(EXPLAIN_WHY_ACTIVE_CLASSNAME, !isUseful);
    this.sendUsefulnessAnalytics(isUseful);
  }

  private requestExplaination() {
    // TODO: Add a modal with feedback options.
    this.sendExplainationAnalytics(UserFeedbackExplaination.NotUseful);
  }
}

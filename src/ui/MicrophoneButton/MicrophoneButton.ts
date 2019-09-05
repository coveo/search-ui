import { Component } from '../Base/Component';
import { exportGlobally } from '../../GlobalExports';
import { IComponentBindings } from '../Base/ComponentBindings';
import { $$ } from '../../utils/Dom';
import { SVGIcons } from '../../utils/SVGIcons';
import { SVGDom } from '../../utils/SVGDom';
import 'styling/_MicrophoneButton';
import { AccessibleButton } from '../../utils/AccessibleButton';
import { l } from '../../strings/Strings';

export interface IMicrophoneButtonOptions {}

export class MicrophoneButton extends Component {
  static ID = 'MicrophoneButton';

  static doExport = () => {
    exportGlobally({
      MicrophoneButton: MicrophoneButton
    });
  };

  static options: IMicrophoneButtonOptions = {};

  private active = false;
  private buttonElement: HTMLElement;

  constructor(public element: HTMLElement, public options?: IMicrophoneButtonOptions, bindings?: IComponentBindings) {
    super(element, MicrophoneButton.ID, bindings);
    this.buildButton();
  }

  private buildButton() {
    this.buttonElement = $$('button', { className: 'coveo-microphone-button' }, SVGIcons.icons.microphone).el;
    SVGDom.addClassToSVGInContainer(this.buttonElement, 'coveo-microphone-button-svg');
    this.element.appendChild(this.buttonElement);

    new AccessibleButton()
      .withElement(this.buttonElement)
      .withSelectAction(() => this.toggleActiveStatus())
      .withLabel(l('SpeechToText'))
      .build();
  }

  private toggleActiveStatus() {
    this.active = !this.active;
    $$(this.buttonElement).toggleClass('active', this.active);

    this.active && this.getUserMedia();
  }

  private async getUserMedia() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (!stream) {
      return this.logger.error('Could not get browser authorization to use the microphone');
    }

    this.logger.info(stream);
    // TODO: link with speech to text here.
  }
}

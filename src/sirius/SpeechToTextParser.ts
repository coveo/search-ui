interface ISpeechToTextParserOpts {
  frequency: number;
  onStart: () => void;
  onUpdate: (textHistory: ITextHistory) => void;
  onStop: (textHistory: ITextHistory) => void;
}

interface ITextHistory {
  text: string;
  isFinal: boolean;
}

export class SpeechToTextParser {
  private opts: ISpeechToTextParserOpts;
  private interval: any;
  private history: ITextHistory[] = [];
  private latest: ITextHistory;

  constructor(opts) {
    this.opts = {
      frequency: 0.5, // seconds
      onStart: () => {},
      onUpdate: () => {},
      onStop: () => {},
      ...opts
    };
  }

  public push(text: string, isFinal: boolean) {
    this.history.push({ text, isFinal });
  }

  public start() {
    if (this.interval) return;
    this.interval = setInterval(() => this.refresh(), this.opts.frequency * 1000);
    this.refresh();
  }

  public stop() {
    if (!this.interval) return;
    clearInterval(this.interval);
    this.interval = undefined;
    this.emitStop();
  }

  private refresh() {
    if (!this.interval) return;
    if (!this.history.length) return;

    this.latest = { ...this.history[this.history.length - 1] };

    if (this.latest.isFinal) {
      this.stop();
      return;
    }

    this.collateText();
    this.emitUpdate();
  }

  private collateText() {
    let i = this.history.length;

    while (this.isGoogleStillProcessing) {
      i--;
      const historyText = this.history[i].text;

      if (historyText[0] != ' ') {
        this.latest.text = historyText + this.latest.text;
      }
    }
  }

  private get isGoogleStillProcessing() {
    return this.latest.text[0] == ' ';
  }

  private emitUpdate() {
    this.opts.onUpdate(this.latest);
  }

  private emitStop() {
    this.opts.onStop(this.latest);
  }
}

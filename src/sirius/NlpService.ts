import { CoveoSpeechToText } from './SpeechToText';
import { TextIntentDetection } from './TextIntentDetection';

export class NlpService {
  private opts: any;
  private intentInstance: TextIntentDetection;
  private speechInstance: CoveoSpeechToText;

  constructor(opts) {
    this.opts = opts;
    this.initSpeechToText();
  }

  public start() {
    this.speechInstance.start();
  }

  public stop() {
    this.speechInstance.stop();
  }

  public isListening() {
    return this.speechInstance.isListening;
  }

  private initSpeechToText() {
    this.speechInstance = new CoveoSpeechToText({
      token: this.opts.tooso_t,
      language: this.opts.language,
      frequency: this.opts.frequency || 0.4,
      onStart: () => {
        this.emitOnStart();
        this.intentInstance = new TextIntentDetection({
          token: this.opts.wit_t,
          onResult: res => this.intentInstance && this.emitOnIntent(res),
          onError: err => this.intentInstance && this.emitOnError(err)
        });
      },
      onReady: () => this.emitOnReady(),
      onMessage: res => this.emitOnMessage(res),
      onStop: () => this.emitOnStop(),
      onError: e => this.emitOnError(e)
    });
  }

  private emitOnStart() {
    this.opts.onStart && this.opts.onStart();
  }

  private emitOnReady() {
    this.opts.onReady && this.opts.onReady();
  }

  private emitOnMessage(res) {
    // text, isFianl
    this.opts.onMessage && this.opts.onMessage(res);
    this.intentInstance && this.intentInstance.parse(res.text, res.isFinal);
  }

  private emitOnIntent(res) {
    // text, isFinal, entities, requestTime, intentRrquestTime, intentResponseTime
    this.opts.onIntent && this.opts.onIntent(res);
  }

  private emitOnStop() {
    this.speechInstance.stop();
    this.intentInstance = undefined;
    this.opts.onStop && this.opts.onStop();
  }

  private emitOnError(e) {
    this.opts.onError && this.opts.onError(e);
  }
}

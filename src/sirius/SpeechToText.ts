import { SpeechToTextParser } from './SpeechToTextParser';

declare global {
  interface Window {
    AudioContext: new (contextOptions?: AudioContextOptions) => AudioContext;
    webkitAudioContext: new (contextOptions?: AudioContextOptions) => AudioContext;
  }

  interface Navigator {
    webkitGetUserMedia: (
      constraints: MediaStreamConstraints,
      onSuccess: NavigatorUserMediaSuccessCallback,
      onError: NavigatorUserMediaErrorCallback
    ) => void;
    mozGetUserMedia: (
      constraints: MediaStreamConstraints,
      onSuccess: NavigatorUserMediaSuccessCallback,
      onError: NavigatorUserMediaErrorCallback
    ) => void;
    msGetUserMedia: (
      constraints: MediaStreamConstraints,
      onSuccess: NavigatorUserMediaSuccessCallback,
      onError: NavigatorUserMediaErrorCallback
    ) => void;
  }
}

const COVEO_DEFAULT_SPEECH_TO_TEXT_LANGUAGE = 'en-US';
const COVEO_DEFAULT_SPEECH_TO_TEXT_FREQUENCY = 0.4;

function getUserMedia(success, error) {
  const mediaDevices = navigator.mediaDevices;
  const getUserMediaPromise = mediaDevices && mediaDevices.getUserMedia;
  const getUserMediaCallback =
    navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

  if (getUserMediaPromise) {
    return getUserMediaPromise
      .bind(mediaDevices)({ audio: true })
      .then(success)
      .catch(error);
  }

  if (getUserMediaCallback) {
    return getUserMediaCallback.bind(navigator)({ audio: true }, success, error);
  }

  return error();
}

interface IOptions {
  language: string;
  frequency: number;
  onMessage: (data: any) => void;
  onStart: () => void;
  onReady: () => void;
  onStop: () => void;
  onError: (err: any) => void;
}

export class CoveoSpeechToText {
  public isListening = false;
  private opts: IOptions;
  private socket: WebSocket;
  private audioContext: AudioContext;

  constructor(opts = {}) {
    this.opts = {
      language: COVEO_DEFAULT_SPEECH_TO_TEXT_LANGUAGE,
      frequency: COVEO_DEFAULT_SPEECH_TO_TEXT_FREQUENCY,
      onMessage: data => {},
      onStart: () => {},
      onReady: () => {},
      onStop: () => {},
      onError: err => {},
      ...opts
    };
  }

  public start() {
    this.emitOnStart();
    this.startAudioStream();
  }

  public stop() {
    if (!this.socket) return;
    this.socket.close();
    this.socket = undefined;
    this.emitOnStop();
  }

  private startAudioStream() {
    // Used to merge and reduce the update frequency
    const textParser = this.buildSpeechToTextParser();
    this.audioContext = this.buildAudioContext();

    var mediaTrack = undefined;
    var firstMessageSent = false;
    var localError = false;

    this.socket = new WebSocket('wss://cloudspeech.goog/ws');
    this.socket.binaryType = 'arraybuffer';

    this.socket.onopen = e => {
      console.log('socket.onopen', e);
      this.sendSocketData();

      getUserMedia(
        stream => {
          textParser.start();
          const processor = this.audioContext.createScriptProcessor(4096, 1, 1);
          processor.onaudioprocess = audio => {
            if (!firstMessageSent) {
              firstMessageSent = true;
              this.emitOnReady();
              this.socket.send(JSON.stringify({ ready: true }));
            }

            const a = audio.inputBuffer.getChannelData(0) || new Float32Array(4096);
            for (var b = a.length, c = new Int16Array(b); b--; ) {
              c[b] = 32767 * Math.min(1, a[b]);
            }
            if (this.socket.readyState != 1) return;
            this.socket.send(c.buffer);
          };
          processor.connect(this.audioContext.destination);
          this.audioContext.createMediaStreamSource(stream).connect(processor);
          mediaTrack = stream.getTracks()[0];
        },
        err => {
          localError = err;
          this.socket.close();
        }
      );
    };

    this.socket.onmessage = e => {
      console.log('socket.onmessage', e);
      const payload = JSON.parse(e.data);
      textParser.push(payload.text, payload.isFinal);
    };

    this.socket.onclose = e => {
      console.log('socket.onclose', e);
      textParser.stop();
      if (mediaTrack) mediaTrack.stop();
      if (this.audioContext) this.audioContext.close();
      if (localError) this.emitOnError(localError);
      this.emitOnStop();
    };

    this.socket.onerror = err => this.emitOnError(err);
  }

  private buildSpeechToTextParser() {
    return new SpeechToTextParser({
      frequency: this.opts.frequency || COVEO_DEFAULT_SPEECH_TO_TEXT_FREQUENCY,
      onUpdate: data => this.opts.onMessage && this.opts.onMessage(data),
      onStop: data => {
        this.opts.onMessage && this.opts.onMessage(data);
        this.socket.close();
      }
    });
  }

  private buildAudioContext(): AudioContext {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    return new AudioContext();
  }

  private sendSocketData() {
    const data = JSON.stringify({
      format: 'LINEAR16',
      punctuation: false,
      rate: this.audioContext.sampleRate,
      language: this.opts.language
    });

    this.socket.send(data);
  }

  private emitOnStart() {
    this.isListening = true;
    this.opts.onStart && this.opts.onStart();
  }

  private emitOnReady() {
    this.isListening = true;
    this.opts.onReady && this.opts.onReady();
  }

  private emitOnStop() {
    this.isListening = false;
    this.opts.onStop && this.opts.onStop();
  }

  private emitOnError(err) {
    console.log('socket.onerror', err);
    this.isListening = false;
    this.opts.onError && this.opts.onError(err);
  }
}

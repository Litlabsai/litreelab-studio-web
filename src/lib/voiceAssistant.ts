// src/lib/voiceAssistant.ts
// Simple browser-based voice assistant for LiTree Lab Studio
// Uses the Web Speech API (SpeechRecognition)

export type VoiceAssistantOptions = {
  wakeWord?: string; // default: "hey verse code"
  onWake?: () => void;
  onCommand?: (command: string) => void;
  lang?: string; // default: "en-US"
  debug?: boolean;
};

export class VoiceAssistant {
  private recognition: SpeechRecognition | null = null;
  private listening = false;
  private wakeWord: string;
  private onWake?: () => void;
  private onCommand?: (command: string) => void;
  private lang: string;
  private debug: boolean;

  constructor(options: VoiceAssistantOptions = {}) {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      throw new Error('Web Speech API not supported in this browser.');
    }
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = options.lang || 'en-US';
    this.wakeWord = (options.wakeWord || 'hey verse code').toLowerCase();
    this.onWake = options.onWake;
    this.onCommand = options.onCommand;
    this.lang = this.recognition.lang;
    this.debug = !!options.debug;
    this.recognition.onresult = this.handleResult.bind(this);
    this.recognition.onerror = (e) => {
      if (this.debug) console.error('VoiceAssistant error:', e);
      this.stop();
    };
    this.recognition.onend = () => {
      if (this.listening) this.start(); // auto-restart
    };
  }

  start() {
    if (this.listening || !this.recognition) return;
    this.listening = true;
    this.recognition.start();
    if (this.debug) console.log('VoiceAssistant started');
  }

  stop() {
    if (!this.listening || !this.recognition) return;
    this.listening = false;
    this.recognition.stop();
    if (this.debug) console.log('VoiceAssistant stopped');
  }

  private handleResult(event: SpeechRecognitionEvent) {
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        const transcript = event.results[i][0].transcript.trim().toLowerCase();
        if (this.debug) console.log('VoiceAssistant heard:', transcript);
        if (transcript.includes(this.wakeWord)) {
          if (this.onWake) this.onWake();
          // Listen for next command
          this.listenForCommand();
        }
      }
    }
  }

  private listenForCommand() {
    if (!this.recognition) return;
    // Temporarily stop and restart to get the next phrase
    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const command = event.results[i][0].transcript.trim().toLowerCase();
          if (this.debug) console.log('VoiceAssistant command:', command);
          if (this.onCommand) this.onCommand(command);
          // Resume wake word listening
          this.recognition!.onresult = this.handleResult.bind(this);
        }
      }
    };
  }
}

// Usage example (in a component):
// import { VoiceAssistant } from "../lib/voiceAssistant";
// const va = new VoiceAssistant({
//   onWake: () => alert("Hey Verse Code detected!"),
//   onCommand: (cmd) => alert("Command: " + cmd),
//   debug: true
// });
// va.start();

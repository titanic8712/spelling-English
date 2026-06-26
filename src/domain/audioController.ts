type PlayableAudio = {
  play: () => Promise<unknown>;
};

type AudioControllerDeps = {
  createAudio: (src: string) => PlayableAudio;
  playTone: (tone: "success" | "error") => void;
  speakWord?: (word: string) => Promise<unknown>;
};

export function createBrowserTonePlayer() {
  return (tone: "success" | "error") => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = tone === "success" ? 660 : 180;
    gain.gain.value = 0.06;
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.16);
  };
}

export function createBrowserSpeechPlayer() {
  return (word: string) => {
    if (!window.speechSynthesis || typeof SpeechSynthesisUtterance === "undefined") {
      return Promise.reject(new Error("speech synthesis unavailable"));
    }

    return new Promise<void>((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(word);
      const voices = window.speechSynthesis.getVoices();
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      utterance.voice = voices.find((voice) => voice.lang === "en-US" && /US|United States|American/i.test(voice.name))
        ?? voices.find((voice) => voice.lang === "en-US")
        ?? null;
      utterance.onend = () => resolve();
      utterance.onerror = () => reject(new Error("speech synthesis failed"));
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    });
  };
}

export function createAudioController(deps: AudioControllerDeps) {
  return {
    async playPronunciation(src: string, fallbackWord?: string): Promise<unknown> {
      try {
        return await deps.createAudio(src).play();
      } catch (error) {
        if (fallbackWord != null && deps.speakWord != null) {
          return deps.speakWord(fallbackWord);
        }
        throw error;
      }
    },
    playSuccess(): void {
      deps.playTone("success");
    },
    playError(): void {
      deps.playTone("error");
    },
  };
}

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

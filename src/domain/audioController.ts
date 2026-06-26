type PlayableAudio = {
  play: () => Promise<unknown>;
};

type AudioControllerDeps = {
  createAudio: (src: string) => PlayableAudio;
  playTone: (tone: "success" | "error") => void;
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

export function createAudioController(deps: AudioControllerDeps) {
  return {
    playPronunciation(src: string): Promise<unknown> {
      return deps.createAudio(src).play();
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

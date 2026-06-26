import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

class TestAudio {
  src: string;

  constructor(src = "") {
    this.src = src;
  }

  play() {
    return Promise.resolve();
  }
}

vi.stubGlobal("Audio", TestAudio);

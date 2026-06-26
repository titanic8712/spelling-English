import { useState } from "react";
import type { PracticeSettings } from "../domain/types";

type SettingsPanelProps = {
  settings: PracticeSettings;
  onSave: (settings: PracticeSettings) => void;
};

export function SettingsPanel({ settings, onSave }: SettingsPanelProps) {
  const [dailyTarget, setDailyTarget] = useState(String(settings.dailyTarget));
  const [countdownSeconds, setCountdownSeconds] = useState(String(settings.countdownSeconds));
  const [autoplayPronunciation, setAutoplayPronunciation] = useState(settings.autoplayPronunciation);
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(settings.soundEffectsEnabled);

  function saveSettings() {
    onSave({
      dailyTarget: Math.max(1, Number(dailyTarget) || settings.dailyTarget),
      countdownSeconds: Math.max(1, Number(countdownSeconds) || settings.countdownSeconds),
      autoplayPronunciation,
      soundEffectsEnabled,
    });
  }

  return (
    <section className="settings-panel" aria-label="Practice settings">
      <label>
        Daily target
        <input
          min={1}
          type="number"
          value={dailyTarget}
          onChange={(event) => setDailyTarget(event.target.value)}
        />
      </label>
      <label>
        Countdown seconds
        <input
          min={1}
          type="number"
          value={countdownSeconds}
          onChange={(event) => setCountdownSeconds(event.target.value)}
        />
      </label>
      <label>
        <input
          type="checkbox"
          checked={autoplayPronunciation}
          onChange={(event) => setAutoplayPronunciation(event.target.checked)}
        />
        Autoplay pronunciation
      </label>
      <label>
        <input
          type="checkbox"
          checked={soundEffectsEnabled}
          onChange={(event) => setSoundEffectsEnabled(event.target.checked)}
        />
        Sound effects
      </label>
      <button type="button" onClick={saveSettings}>Save settings</button>
    </section>
  );
}

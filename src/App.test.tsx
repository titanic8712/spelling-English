import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StrictMode } from "react";
import App from "./App";

beforeEach(() => {
  window.localStorage.clear();
});

it("starts a daily session from the dashboard", async () => {
  const user = userEvent.setup();
  render(
    <StrictMode>
      <App />
    </StrictMode>,
  );

  expect(screen.getByText("30 total questions")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Start practice" }));

  expect(screen.getByText("/əˈbændən/")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Replay pronunciation" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Show hint" })).toBeInTheDocument();
});

it("updates settings from the dashboard", async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.clear(screen.getByLabelText("Daily target"));
  await user.type(screen.getByLabelText("Daily target"), "12");
  await user.clear(screen.getByLabelText("Countdown seconds"));
  await user.type(screen.getByLabelText("Countdown seconds"), "3");
  await user.click(screen.getByLabelText("Autoplay pronunciation"));
  await user.click(screen.getByLabelText("Sound effects"));
  await user.click(screen.getByRole("button", { name: "Save settings" }));

  expect(screen.getByText("12 total questions")).toBeInTheDocument();
});

it("shows a wrong attempt, clears cells, and then accepts the correct spelling", async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole("button", { name: "Start practice" }));

  await user.keyboard("abandox");
  expect(screen.getByText("Try again")).toBeInTheDocument();

  await user.keyboard("abandon");
  expect(screen.getByText("放弃")).toBeInTheDocument();
  expect(screen.getByText("They had to abandon the plan after the storm.")).toBeInTheDocument();
});

it("reveals a hint and marks the word as assisted", async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole("button", { name: "Start practice" }));
  await user.click(screen.getByRole("button", { name: "Show hint" }));

  expect(screen.getByText("abandon")).toBeInTheDocument();
  await user.keyboard("abandon");
  expect(screen.getByText("Completed with help")).toBeInTheDocument();
});

it("advances once to the next word after the result countdown", async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.clear(screen.getByLabelText("Countdown seconds"));
  await user.type(screen.getByLabelText("Countdown seconds"), "1");
  await user.click(screen.getByLabelText("Autoplay pronunciation"));
  await user.click(screen.getByRole("button", { name: "Save settings" }));
  await user.click(screen.getByRole("button", { name: "Start practice" }));

  await user.keyboard("abandon");
  expect(screen.getByText("Clean success")).toBeInTheDocument();

  expect(await screen.findByText("/əˈbeɪt/", {}, { timeout: 2500 })).toBeInTheDocument();
  await new Promise((resolve) => {
    window.setTimeout(resolve, 1500);
  });
  expect(screen.getByText("/əˈbeɪt/")).toBeInTheDocument();
  expect(screen.queryByText("Session complete")).not.toBeInTheDocument();
  expect(screen.queryByText("/əˈbrʌpt/")).not.toBeInTheDocument();
});

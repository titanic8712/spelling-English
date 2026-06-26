import { render, screen } from "@testing-library/react";
import App from "./App";

it("renders the practice dashboard", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: "IELTS Vocabulary Trainer" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Start practice" })).toBeInTheDocument();
});

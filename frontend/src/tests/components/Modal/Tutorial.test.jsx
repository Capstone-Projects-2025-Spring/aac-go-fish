import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Tutorial from "../../../components/Modal/Tutorial";

beforeAll(() => {
  const portal = document.createElement("div");
  portal.id = "portal-game";
  document.body.appendChild(portal);
});

afterAll(() => document.getElementById("portal-game")?.remove());

const DummyUI = () => (
  <>
    <div className="LeftColumn">left</div>
    <div className="ChopButton">chop</div>
    <div className="SendButton">send</div>
  </>
);

describe("Tutorial modal navigation & highlighting", () => {
  const originalAudio = global.Audio;

  beforeEach(() => {
    global.Audio = jest.fn().mockImplementation(() => ({ play: jest.fn() }));
  });

  afterEach(() => {
    global.Audio = originalAudio;
    jest.resetAllMocks();
  });

  const renderTutorial = () =>
    render(
      <>
        <DummyUI />
        <Tutorial
          classNames={["LeftColumn", "ChopButton", "SendButton"]}
          audioSourceFolder="/audio/tutorial"
        />
      </>
    );

  it("shows banner at step 0 and Close (✕) button is present", () => {
    renderTutorial();
    expect(screen.getByText("How to Play")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "✕" })).toBeInTheDocument();
  });

  it("advances to step 1, plays audio, highlights element, hides banner", () => {
    renderTutorial();
    fireEvent.click(screen.getByRole("button", { name: "→" }));
    expect(global.Audio).toHaveBeenCalledWith("/audio/tutorial/LeftColumn.mp3");
    const highlighted = document.querySelector(".LeftColumn.highlighted");
    expect(highlighted).not.toBeNull();
    expect(screen.queryByText("How to Play")).toBeNull();
  });

  it("shows ✓ on final step and closes modal after click", () => {
    renderTutorial();
    const next = () =>
      fireEvent.click(screen.getByRole("button", { name: "→" }));
    next();
    next();
    next();
    expect(screen.getByRole("button", { name: "✓" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "✓" }));
    expect(document.querySelector(".modal-overlay")).toBeNull();
  });

  it("Help button resets to step 0 and re-shows banner", () => {
    renderTutorial();
    fireEvent.click(screen.getByRole("button", { name: "→" }));
    fireEvent.click(screen.getByRole("button", { name: "?" }));
    expect(screen.getByText("How to Play")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "✕" })).toBeInTheDocument();
  });
});

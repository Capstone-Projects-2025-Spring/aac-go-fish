import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import DrinkBuilder from "../components/Drinks/DrinkBuilder";
import { WebSocketContext } from "../WebSocketContext";
import { playSendSound } from "../components/SoundEffects/playSendSound";
import { playPopSound } from "../components/SoundEffects/playPopSound";

jest.mock("../components/SoundEffects/playSendSound", () => ({
  playSendSound: jest.fn(),
}));
jest.mock("../components/SoundEffects/playPopSound", () => ({
  playPopSound: jest.fn(),
}));
jest.mock("../components/Modal/StationStartModal", () => ({
  stationName,
  handleClick,
}) => (
  <div data-testid="station-start-modal" onClick={handleClick}>
    {stationName}
  </div>
));
jest.mock("../components/Score/Score", () => ({ score, day }) => (
  <div data-testid="score-component">Score {score} Day {day}</div>
));
jest.mock(
  "../components/Drinks/DrinkDisplay",
  () =>
    ({ color, fillPercentage, cupSize, cupPosition }) =>
      (
        <div
          data-testid="drink-display"
          data-color={color}
          data-fill={fillPercentage}
          data-size={cupSize}
          data-position={cupPosition}
        />
      )
);

beforeAll(() => {
  const portalRoot = document.createElement("div");
  portalRoot.setAttribute("id", "portal-game");
  document.body.appendChild(portalRoot);
});

afterAll(() => {
  const portalRoot = document.getElementById("portal-game");
  if (portalRoot) document.body.removeChild(portalRoot);
});

describe("DrinkBuilder", () => {
  let sendMock;
  const originalAudio = global.Audio;

  beforeEach(() => {
    jest.useFakeTimers();
    sendMock = jest.fn();
    global.Audio = jest.fn().mockImplementation((src) => ({
      src,
      play: jest.fn().mockResolvedValue(),
      pause: jest.fn(),
      loop: false,
    }));
  });

  afterEach(() => {
    jest.useRealTimers();
    global.Audio = originalAudio;
    jest.resetAllMocks();
  });

  const renderBuilder = () =>
    render(
      <WebSocketContext.Provider value={{ send: sendMock }}>
        <DrinkBuilder score="$1.00" day={2} />
      </WebSocketContext.Provider>
    );

  it("shows and hides StationStartModal", () => {
    renderBuilder();
    expect(screen.getByTestId("station-start-modal")).toBeInTheDocument();
    act(() => jest.advanceTimersByTime(5_000));
    expect(screen.queryByTestId("station-start-modal")).toBeNull();
  });

  it("selects color and plays audio", () => {
    renderBuilder();
    fireEvent.click(screen.getByAltText("Medium Cup").closest("button"));
    fireEvent.click(screen.getByRole("button", { name: "Red" }));
    expect(playPopSound).toHaveBeenCalled();
    expect(global.Audio).toHaveBeenCalledWith("/audio/red.mp3");

    act(() => jest.advanceTimersByTime(50));
    expect(screen.getByTestId("drink-display")).toHaveAttribute(
      "data-color",
      "#FF0000"
    );
  });

  it("selects cup size and plays audio", () => {
    renderBuilder();
    fireEvent.click(screen.getByAltText("Small Cup").closest("button"));
    expect(playPopSound).toHaveBeenCalled();
    expect(global.Audio).toHaveBeenCalledWith("/audio/small.mp3");
    expect(screen.getByTestId("drink-display")).toHaveAttribute(
      "data-size",
      "small"
    );
  });

  it("fills cup while holding fill button", () => {
    renderBuilder();
    fireEvent.click(screen.getByAltText("Medium Cup").closest("button"));
    fireEvent.click(screen.getByRole("button", { name: "Blue" }));
    act(() => jest.advanceTimersByTime(50));

    const fillBtn = screen.getByRole("button", { name: /Fill Cup/i });
    fireEvent.mouseDown(fillBtn);
    act(() => jest.advanceTimersByTime(175));
    expect(screen.getByTestId("drink-display")).toHaveAttribute(
      "data-fill",
      "5"
    );

    fireEvent.mouseUp(fillBtn);
    const fillingAudio = global.Audio.mock.results.find(
      (r) => r.value.src === "/audio/filling.mp3"
    ).value;
    expect(fillingAudio.pause).toHaveBeenCalled();
  });

  it("sends drink and shows confirmation", () => {
    renderBuilder();
    fireEvent.click(screen.getByAltText("Medium Cup").closest("button"));
    fireEvent.click(screen.getByRole("button", { name: "Green" }));
    act(() => jest.advanceTimersByTime(50));

    fireEvent.click(screen.getByText("Send"));
    expect(sendMock).toHaveBeenCalledWith({
      data: expect.objectContaining({ component_type: "drink" }),
    });
    expect(playSendSound).toHaveBeenCalled();
    expect(screen.getByText("Drink sent to manager!")).toBeInTheDocument();

    act(() => jest.advanceTimersByTime(3_000));
    expect(
      screen.queryByText("Drink sent to manager!")
    ).not.toBeInTheDocument();
  });
});

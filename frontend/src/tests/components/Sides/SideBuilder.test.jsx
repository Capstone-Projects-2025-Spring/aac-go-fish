import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
} from "@testing-library/react";
import SideBuilder from "../../../components/Sides/SideBuilder";
import { WebSocketContext } from "../../../WebSocketContext";
import { playPopSound } from "../../../components/SoundEffects/playPopSound";

jest.mock(
  "../../../components/Sides/SideDisplay",
  () =>
    ({ tableState, fryTimeLeft }) =>
      (
        <div
          data-testid="side-display"
          data-table-state={tableState}
          data-fry-time-left={fryTimeLeft}
        />
      )
);
jest.mock("../../../components/Score/Score", () => ({ score, day }) => (
  <div data-testid="score-component" data-score={score} data-day={day} />
));
jest.mock("../../../components/Modal/StationStartModal", () => ({
  stationName,
  handleClick,
}) => (
  <div data-testid="station-start-modal" onClick={handleClick}>
    {stationName}
  </div>
));
jest.mock("../../../components/SoundEffects/playPopSound", () => ({
  playPopSound: jest.fn(),
}));
jest.mock("../../../components/SoundEffects/playSendSound", () => ({
  playSendSound: jest.fn(),
}));

beforeAll(() => {
  const portalRoot = document.createElement("div");
  portalRoot.setAttribute("id", "portal-game");
  document.body.appendChild(portalRoot);
});

afterAll(() => {
  const portalRoot = document.getElementById("portal-game");
  if (portalRoot) document.body.removeChild(portalRoot);
});

describe("SideBuilder", () => {
  const originalAudio = global.Audio;
  let sendMock;

  beforeEach(() => {
    jest.useFakeTimers();
    sendMock = jest.fn();
    global.Audio = jest.fn().mockImplementation((src) => ({
      src,
      play: jest.fn(),
      volume: 1,
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
        <SideBuilder score={42} day={3} />
      </WebSocketContext.Provider>
    );

  it("cleans up frying intervals on unmount", () => {
    const clearIntervalSpy = jest.spyOn(window, "clearInterval");

    const { unmount } = renderBuilder();

    fireEvent.click(screen.getByRole("button", { name: /potatoes/i }));
    fireEvent.click(screen.getByRole("button", { name: /chop/i }));
    act(() => jest.advanceTimersByTime(2_000));

    const fryer = screen.getByAltText("Fryer").closest("div");
    const dataTransfer = { getData: jest.fn().mockReturnValue("choppedPotatoes") };
    fireEvent.drop(fryer, { dataTransfer });

    act(() => jest.advanceTimersByTime(5_000));

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it("shows correct overlay image while frying onions", () => {
    renderBuilder();
    fireEvent.click(screen.getByRole("button", { name: /onions/i }));
    fireEvent.click(screen.getByRole("button", { name: /chop/i }));
    act(() => jest.advanceTimersByTime(2_000));

    const fryer = screen.getByAltText("Fryer").parentElement;
    const dt = { getData: jest.fn().mockReturnValue("choppedOnions") };
    fireEvent.drop(fryer, { dataTransfer: dt });

    const overlay = fryer.querySelector("img[alt='']");
    expect(overlay).toHaveAttribute(
      "src",
      "/images/food_side_view/sliced_onion.png"
    );
  });

  it("drag-dropping the Reset button clears table state", () => {
    renderBuilder();
    fireEvent.click(screen.getByRole("button", { name: /cheese/i }));
    fireEvent.click(screen.getByRole("button", { name: /chop/i }));
    act(() => jest.advanceTimersByTime(2_000));

    const resetBtn = screen.getByRole("button", { name: /reset/i });
    const dt = { getData: jest.fn().mockReturnValue("something") };
    fireEvent.dragOver(resetBtn);
    fireEvent.drop(resetBtn, { dataTransfer: dt });

    expect(playPopSound).toHaveBeenCalled();
    expect(screen.getByTestId("side-display").dataset.tableState).toBe("empty");
  });

  it("Send button onDrop path submits component", () => {
    renderBuilder();
    fireEvent.click(screen.getByRole("button", { name: /potatoes/i }));
    fireEvent.click(screen.getByRole("button", { name: /chop/i }));
    act(() => jest.advanceTimersByTime(2_000));

    const sendBtn = screen.getByRole("button", { name: /send/i });
    const dt = { getData: jest.fn().mockReturnValue("choppedPotatoes") };
    fireEvent.dragOver(sendBtn);
    fireEvent.drop(sendBtn, { dataTransfer: dt });

    expect(playPopSound).toHaveBeenCalled();
    expect(sendMock).toHaveBeenCalledTimes(1);
  });

  it("Left-column raw buttons become disabled after placing a side", () => {
    renderBuilder();
    const potatoBtn = screen.getByRole("button", { name: /potatoes/i });
    fireEvent.click(potatoBtn);
    const onionBtn = screen.getByRole("button", { name: /onions/i });
    expect(onionBtn).toBeDisabled();
  });
  it("drag-dropping a raw ingredient onto the table places that side", () => {
    renderBuilder();
    const table = screen.getByTestId("side-display").parentElement;
    const dt = { getData: jest.fn().mockReturnValue("cheese") };
    fireEvent.dragOver(table);
    expect(table.classList).toContain("drop-hover");
    fireEvent.drop(table, { dataTransfer: dt });
    expect(table.classList).not.toContain("drop-hover");
    expect(screen.getByTestId("side-display").dataset.tableState).toBe("cheese");
  });

  it("shows and then removes overlay image while frying chopped cheese", () => {
    renderBuilder();
    fireEvent.click(screen.getByRole("button", { name: /cheese/i }));
    fireEvent.click(screen.getByRole("button", { name: /chop/i }));
    act(() => jest.advanceTimersByTime(2_000));

    const fryer = screen.getByAltText("Fryer").parentElement;
    const dt = { getData: jest.fn().mockReturnValue("choppedCheese") };
    fireEvent.drop(fryer, { dataTransfer: dt });

    const overlayDuringFry = fryer.querySelector("img[alt='']");
    expect(overlayDuringFry).toHaveAttribute(
      "src",
      "/images/food_side_view/SlicedMozzarella.png"
    );

    act(() => jest.advanceTimersByTime(5_000));
    expect(fryer.querySelector("img[alt='']")).toBeNull();
  });

  it("Chop button disables once side is chopped", () => {
    renderBuilder();
    const chopBtn = screen.getByRole("button", { name: /chop/i });
    fireEvent.click(screen.getByRole("button", { name: /potatoes/i }));
    expect(chopBtn).not.toBeDisabled();
    fireEvent.click(chopBtn);
    act(() => jest.advanceTimersByTime(2_000));
    expect(chopBtn).toBeDisabled();
  });

  it("fryer drop-hover class is removed on dragLeave", () => {
    renderBuilder();
    const fryer = screen.getByAltText("Fryer").parentElement;
    fireEvent.dragOver(fryer);
    expect(fryer.classList).toContain("drop-hover");
    fireEvent.dragLeave(fryer);
    expect(fryer.classList).not.toContain("drop-hover");
  });

});

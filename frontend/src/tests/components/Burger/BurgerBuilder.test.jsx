import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import BurgerBuilder from "../../../components/Burger/BurgerBuilder";
import { WebSocketContext } from "../../../WebSocketContext";
import { playSendSound } from "../../../components/SoundEffects/playSendSound";
import { playPopSound } from "../../../components/SoundEffects/playPopSound";

jest.mock("../../../components/SoundEffects/playSendSound", () => ({
  playSendSound: jest.fn(),
}));
jest.mock("../../../components/SoundEffects/playPopSound", () => ({
  playPopSound: jest.fn(),
}));
jest.mock("../../../menuItems", () => ({
  menu: [
    {
      children: [
        {
          name: "Ingredient1",
          image: "img1.png",
          sideImage: "side1.png",
          audio: "/audio/ingredient1.mp3",
        },
        {
          name: "Ingredient2",
          image: "img2.png",
          sideImage: "side2.png",
          audio: "/audio/ingredient2.mp3",
        },
      ],
    },
  ],
}));
jest.mock("../../../components/Modal/StationStartModal", () => ({
  stationName,
  handleClick,
}) => (
  <div data-testid="station-start-modal" onClick={handleClick}>
    {stationName}
  </div>
));
jest.mock("../../../components/Score/Score", () => ({ score, day }) => (
  <div data-testid="score-component">
    Score {score} Day {day}
  </div>
));
jest.mock("../../../components/Burger/BurgerStation", () => ({ imagePaths }) => (
  <div data-testid="burger-station" data-paths={JSON.stringify(imagePaths)} />
));

beforeAll(() => {
  const portalRoot = document.createElement("div");
  portalRoot.setAttribute("id", "portal-game");
  document.body.appendChild(portalRoot);
});

afterAll(() => {
  const portalRoot = document.getElementById("portal-game");
  if (portalRoot) document.body.removeChild(portalRoot);
});


describe("BurgerBuilder", () => {
  let sendMock;
  const originalAudio = global.Audio;

  beforeEach(() => {
    jest.useFakeTimers();
    sendMock = jest.fn();
    global.Audio = jest.fn().mockImplementation((src) => ({
      src,
      play: jest.fn().mockResolvedValue(),
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
        <BurgerBuilder score="$2.00" day={3} />
      </WebSocketContext.Provider>
    );

  it("shows and hides StationStartModal after 10 s", () => {
    renderBuilder();
    expect(screen.getByTestId("station-start-modal")).toBeInTheDocument();
    act(() => jest.advanceTimersByTime(10_000));
    expect(screen.queryByTestId("station-start-modal")).toBeNull();
  });

  it("adds ingredients, plays sounds, and updates station", () => {
    renderBuilder();
    fireEvent.click(screen.getByText("Ingredient1"));
    expect(playPopSound).toHaveBeenCalled();
    expect(global.Audio).toHaveBeenCalledWith("/audio/ingredient1.mp3");
    expect(screen.getByTestId("burger-station")).toHaveAttribute(
      "data-paths",
      JSON.stringify(["side1.png"])
    );
  });

  it("removes last ingredient on undo", () => {
    renderBuilder();
    fireEvent.click(screen.getByText("Ingredient1"));
    fireEvent.click(screen.getByText("Ingredient2"));
    fireEvent.click(screen.getByText("Undo"));
    expect(screen.getByTestId("burger-station")).toHaveAttribute(
      "data-paths",
      JSON.stringify(["side1.png"])
    );
  });

  it("clears plate on delete", () => {
    renderBuilder();
    fireEvent.click(screen.getByText("Ingredient1"));
    fireEvent.click(screen.getByText("Delete Burger"));
    expect(screen.getByTestId("burger-station")).toHaveAttribute(
      "data-paths",
      JSON.stringify([])
    );
  });

  it("sends order and plays send sound", () => {
    renderBuilder();
    fireEvent.click(screen.getByText("Ingredient1"));
    fireEvent.click(screen.getByAltText("Send Order").closest("button"));
    expect(sendMock).toHaveBeenCalledWith({
      data: {
        type: "game_state",
        game_state_update_type: "order_component",
        component_type: "burger",
        component: { ingredients: ["Ingredient1"] },
      },
    });
    expect(playSendSound).toHaveBeenCalled();
  });

  it("shows full-plate message after exceeding max size", () => {
    renderBuilder();
    const btn = screen.getByText("Ingredient1");
    for (let i = 0; i < 11; i++) fireEvent.click(btn);
    expect(screen.getByText("Plate is Full!")).toBeInTheDocument();
  });
});

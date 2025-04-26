import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import App from "../App";
import { WebSocketContext, useWebSocket } from "../WebSocketContext";

jest.mock("../WebSocketContext", () => {
  const React = require("react");
  return {
    __esModule: true,
    WebSocketContext: React.createContext({ send: jest.fn() }),
    useWebSocket: jest.fn(),
  };
});

jest.mock("../components/SoundEffects/playPopSound", () => ({
  playPopSound: jest.fn(),
}));

jest.mock("../components/HomePage", () => () => (
  <div data-testid="home-page" />
));
jest.mock("../components/Burger/BurgerBuilder", () => () => (
  <div data-testid="burger-builder" />
));
jest.mock("../components/Drinks/DrinkBuilder", () => () => (
  <div data-testid="drink-builder" />
));
jest.mock("../components/Sides/SideBuilder", () => () => (
  <div data-testid="side-builder" />
));
jest.mock("../components/AACBoard/AACBoard", () => () => (
  <div data-testid="aac-board" />
));
jest.mock("../components/Manager/MiniOrderDisplay", () => () => (
  <div data-testid="mini-order" />
));
jest.mock("../components/Score/Score", () => ({ score, day }) => (
  <div data-testid="score">{`Score:${score} Day:${day}`}</div>
));
jest.mock("../components/Modal/GameCompleteModal", () => () => (
  <div data-testid="game-complete-modal" />
));
jest.mock("../components/Modal/DayCompleteModal", () => ({
  score,
  customers,
}) => <div data-testid="day-complete-modal">{`DayScore:${score} Cust:${customers}`}</div>);
jest.mock("../components/Modal/StationStartModal", () => ({
  stationName,
}) => <div data-testid="station-start-modal">{stationName}</div>);

beforeAll(() => {
  const portalRoot = document.createElement("div");
  portalRoot.setAttribute("id", "portal-game");
  document.body.appendChild(portalRoot);
});

afterAll(() => {
  const portalRoot = document.getElementById("portal-game");
  if (portalRoot) document.body.removeChild(portalRoot);
});

describe("App component", () => {
  let wsCallback;
  const sendMock = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(Math, "random").mockReturnValue(0);
    useWebSocket.mockImplementation((cb) => {
      wsCallback = cb;
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.resetAllMocks();
    Math.random.mockRestore();
  });

  const renderApp = () =>
    render(
      <WebSocketContext.Provider value={{ send: sendMock }}>
        <App />
      </WebSocketContext.Provider>
    );

  it("renders HomePage by default", () => {
    renderApp();
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });

  it("switches to BurgerBuilder on role_assignment", () => {
    renderApp();
    act(() => {
      wsCallback({
        data: {
          type: "game_state",
          game_state_update_type: "role_assignment",
          role: "burger",
        },
      });
    });
    expect(screen.getByTestId("burger-builder")).toBeInTheDocument();
  });

  it("switches to SideBuilder on role_assignment", () => {
    renderApp();
    act(() => {
      wsCallback({
        data: {
          type: "game_state",
          game_state_update_type: "role_assignment",
          role: "side",
        },
      });
    });
    expect(screen.getByTestId("side-builder")).toBeInTheDocument();
  });

  it("switches to DrinkBuilder on role_assignment", () => {
    renderApp();
    act(() => {
      wsCallback({
        data: {
          type: "game_state",
          game_state_update_type: "role_assignment",
          role: "drink",
        },
      });
    });
    expect(screen.getByTestId("drink-builder")).toBeInTheDocument();
  });

  it("switches to manager view on role_assignment and shows start modal", () => {
    renderApp();
    act(() => {
      wsCallback({
        data: {
          type: "game_state",
          game_state_update_type: "role_assignment",
          role: "manager",
        },
      });
    });
    expect(screen.getByTestId("station-start-modal")).toHaveTextContent(
      "Manager"
    );
    expect(screen.getByTestId("aac-board")).toBeInTheDocument();
    act(() => jest.advanceTimersByTime(5_000));
    expect(screen.queryByTestId("station-start-modal")).toBeNull();
  });

  it("opens GameCompleteModal on game_end", () => {
    renderApp();
    act(() => {
      wsCallback({
        data: { type: "lobby_lifecycle", lifecycle_type: "game_end" },
      });
    });
    expect(screen.getByTestId("game-complete-modal")).toBeInTheDocument();
  });

  it("opens and auto-closes DayCompleteModal on day_end", () => {
    renderApp();
    act(() => {
      wsCallback({
        data: {
          type: "game_state",
          game_state_update_type: "day_end",
          score: 500,
          customers_served: 3,
          day: 2,
        },
      });
    });
    expect(screen.getByTestId("day-complete-modal")).toHaveTextContent(
      "DayScore:$5.00 Cust:3"
    );
    act(() => jest.advanceTimersByTime(10_000));
    expect(screen.queryByTestId("day-complete-modal")).toBeNull();
  });

  it("updates displayed score on order_score message", () => {
    renderApp();
    act(() => {
      wsCallback({
        data: {
          type: "game_state",
          game_state_update_type: "role_assignment",
          role: "manager",
        },
      });
      wsCallback({
        data: {
          type: "game_state",
          game_state_update_type: "order_score",
          score: 1234,
        },
      });
    });
    expect(screen.getByTestId("score")).toHaveTextContent(
      "Score:$12.34 Day:1"
    );
  });

  it("submits order on send click in manager view", () => {
    renderApp();
    act(() => {
      wsCallback({
        data: {
          type: "game_state",
          game_state_update_type: "role_assignment",
          role: "manager",
        },
      });
    });
    fireEvent.click(screen.getByAltText("send customer order"));
    expect(sendMock).toHaveBeenCalledWith({
      data: {
        type: "game_state",
        game_state_update_type: "order_submission",
        order: {
          burger: { ingredients: null },
          drink: null,
          side: null,
        },
      },
    });
  });

  it("handles new_order lifecycle and displays order after delay", () => {
    renderApp();
    act(() => {
      wsCallback({
        data: {
          type: "game_state",
          game_state_update_type: "role_assignment",
          role: "manager",
        },
      });
      wsCallback({
        data: {
          type: "game_state",
          game_state_update_type: "new_order",
          order: {
            burger: { ingredients: ["A"] },
            drink: "D",
            side: "S",
          },
        },
      });
    });
    expect(screen.queryAllByTestId("mini-order").length).toBe(1);
    act(() => jest.advanceTimersByTime(2_000));
    expect(screen.getAllByTestId("mini-order").length).toBe(2);
  });

  it("handles order_component updates for burger, drink, and side", () => {
    renderApp();
    act(() => {
      wsCallback({
        data: {
          type: "game_state",
          game_state_update_type: "role_assignment",
          role: "manager",
        },
      });
      wsCallback({
        data: {
          type: "game_state",
          game_state_update_type: "order_component",
          component_type: "burger",
          component: { ingredients: ["X"] },
        },
      });
      wsCallback({
        data: {
          type: "game_state",
          game_state_update_type: "order_component",
          component_type: "drink",
          component: "DRINK",
        },
      });
      wsCallback({
        data: {
          type: "game_state",
          game_state_update_type: "order_component",
          component_type: "side",
          component: "SIDE",
        },
      });
    });
    expect(screen.getAllByTestId("mini-order").length).toBeGreaterThanOrEqual(
      1
    );
  });

  it("does not render send button for non-manager roles", () => {
    renderApp();
    expect(screen.queryByAltText("send customer order")).toBeNull();

    act(() => {
      wsCallback({
        data: {
          type: "game_state",
          game_state_update_type: "role_assignment",
          role: "burger",
        },
      });
    });
    expect(screen.queryByAltText("send customer order")).toBeNull();
  });

  it("calls playPopSound on Help button click", () => {
    renderApp();
    act(() => {
      wsCallback({
        data: {
          type: "game_state",
          game_state_update_type: "role_assignment",
          role: "manager",
        },
      });
    });

    const { playPopSound } = require("../components/SoundEffects/playPopSound");
    fireEvent.click(screen.getByRole("button", { name: /Help/i }));
    expect(playPopSound).toHaveBeenCalled();
  });

  it("ignores unknown message types without throwing", () => {
    renderApp();
    expect(() => {
      act(() => {
        wsCallback({ data: { type: "something_completely_different" } });
        wsCallback({
          data: {
            type: "game_state",
            game_state_update_type: "bogus_update",
          },
        });
      });
    }).not.toThrow();
  });
});

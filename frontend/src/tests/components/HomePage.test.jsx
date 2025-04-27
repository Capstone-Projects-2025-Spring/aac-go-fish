import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HomePage from '../../components/HomePage';
import { WebSocketContext } from '../../WebSocketContext';

jest.mock('../../components/IngredientScrollPicker/IngredientScrollPicker', () => ({ selected, setSelected }) => (
  <div data-testid="ingredient-picker" data-selected={selected} />
));
jest.mock('../../components/Modal/ErrorModal', () => ({ msg }) => <div data-testid="error-modal">{msg}</div>);
jest.mock('../../components/Lobby/Lobby', () => ({ lobbyCode }) => <div data-testid="lobby">{lobbyCode}</div>);
jest.mock('../../components/SoundEffects/playPopSound', () => ({ playPopSound: jest.fn() }));

describe('<HomePage /> (from tests/ folder)', () => {
  let mockSend;

  beforeEach(() => {
    mockSend = jest.fn();
    global.fetch = jest.fn();
    delete window.location;
    window.location = { pathname: '/' };
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.resetAllMocks();
  });

  it('renders header, 3 pickers, and both buttons enabled', () => {
    render(
      <WebSocketContext.Provider value={{ send: mockSend }}>
        <HomePage />
      </WebSocketContext.Provider>
    );

    expect(screen.getByRole('heading', { name: /order up!/i })).toBeInTheDocument();
    expect(screen.getAllByTestId('ingredient-picker')).toHaveLength(3);
    expect(screen.getByRole('button', { name: /create lobby/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /join lobby/i })).toBeEnabled();
  });

  it('uses URL pathname to prefill ingredients and then Join Lobby works', async () => {
    window.location.pathname = '/A-B-C';
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 456 }),
    });

    render(
      <WebSocketContext.Provider value={{ send: mockSend }}>
        <HomePage />
      </WebSocketContext.Provider>
    );

    const pickers = screen.getAllByTestId('ingredient-picker');
    expect(pickers[0]).toHaveAttribute('data-selected', 'A');
    expect(pickers[1]).toHaveAttribute('data-selected', 'B');
    expect(pickers[2]).toHaveAttribute('data-selected', 'C');

    fireEvent.click(screen.getByRole('button', { name: /join lobby/i }));

    await waitFor(() =>
      expect(mockSend).toHaveBeenCalledWith({
        data: { type: 'initializer', code: ['A', 'B', 'C'], id: 456 },
      })
    );

    expect(screen.getByTestId('lobby')).toHaveTextContent('A-B-C');
  });

  it('Create Lobby → POST and then shows images + Lobby', async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ code: ['X', 'Y', 'Z'] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 789 }),
      });

    render(
      <WebSocketContext.Provider value={{ send: mockSend }}>
        <HomePage />
      </WebSocketContext.Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /create lobby/i }));

    await waitFor(() =>
      expect(mockSend).toHaveBeenCalledWith({
        data: { type: 'initializer', code: ['X', 'Y', 'Z'], id: 789 },
      })
    );

    ['X', 'Y', 'Z'].forEach((letter) => {
      expect(screen.getByAltText(letter)).toBeInTheDocument();
    });
    expect(screen.getByTestId('lobby')).toHaveTextContent('X-Y-Z');
  });

  it('Join Lobby failure → shows error modal', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ detail: 'join failed!' }),
    });

    render(
      <WebSocketContext.Provider value={{ send: mockSend }}>
        <HomePage />
      </WebSocketContext.Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /join lobby/i }));

    await waitFor(() => expect(screen.getByTestId('error-modal')).toBeInTheDocument());
    expect(screen.getByTestId('error-modal')).toHaveTextContent('join failed!');
  });

  it('Create Lobby failure → shows generic error modal', async () => {
    global.fetch.mockRejectedValueOnce(new Error('server down'));

    render(
      <WebSocketContext.Provider value={{ send: mockSend }}>
        <HomePage />
      </WebSocketContext.Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /create lobby/i }));

    await waitFor(() => expect(screen.getByTestId('error-modal')).toBeInTheDocument());
    expect(screen.getByTestId('error-modal')).toHaveTextContent('Failed to create lobby.');
  });
});

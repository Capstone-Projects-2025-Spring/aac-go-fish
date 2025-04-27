import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Lobby from '../../../components/Lobby/Lobby';
import { WebSocketContext, useWebSocket } from '../../../WebSocketContext';
import { playPopSound } from '../../../components/SoundEffects/playPopSound';

jest.mock('../../../WebSocketContext', () => {
  const React = require('react');
  return {
    WebSocketContext: React.createContext({ send: jest.fn() }),
    useWebSocket: jest.fn(),
  };
});

jest.mock('../../../components/SoundEffects/playPopSound', () => ({ playPopSound: jest.fn() }));

describe('Lobby', () => {
  let sendMock;
  const originalClipboard = { ...global.navigator.clipboard };
  const originalAudio = global.Audio;

  beforeEach(() => {
    jest.useFakeTimers();
    sendMock = jest.fn();
    navigator.clipboard = { writeText: jest.fn() };
    delete window.location;
    window.location = { protocol: 'https:', hostname: 'example.com' };
    global.Audio = jest.fn().mockImplementation(src => {
      const instance = {
        src,
        play: jest.fn().mockResolvedValue(),
        addEventListener: jest.fn((event, cb) => {
          if (event === 'ended') instance._ended = cb;
        })
      };
      return instance;
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.resetAllMocks();
    navigator.clipboard = originalClipboard;
    global.Audio = originalAudio;
  });

  function renderLobby() {
    return render(
      <WebSocketContext.Provider value={{ send: sendMock }}>
        <Lobby lobbyCode="A-B-C" />
      </WebSocketContext.Provider>
    );
  }

  it('starts with 1 player and shows waiting text', () => {
    useWebSocket.mockImplementationOnce(() => {});
    renderLobby();
    expect(screen.getByText(/Players in Lobby: 1 \/ 4/)).toBeInTheDocument();
    expect(screen.getByText(/Waiting for more players to join/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start Game/i })).toBeDisabled();
  });

  it('updates player count when message arrives', () => {
    useWebSocket.mockImplementationOnce(cb => {
      cb({ data: { type: 'lobby_lifecycle', lifecycle_type: 'player_count', count: 3 } });
    });
    renderLobby();
    expect(screen.getByText(/Players in Lobby: 3 \/ 4/)).toBeInTheDocument();
    expect(screen.getByText(/You have company/)).toBeInTheDocument();
  });

  it('enables Start Game at >=2 players and sends start', () => {
    useWebSocket.mockImplementationOnce(cb => {
      cb({ data: { type: 'lobby_lifecycle', lifecycle_type: 'player_count', count: 2 } });
    });
    renderLobby();
    const btn = screen.getByRole('button', { name: /Start Game/i });
    fireEvent.click(btn);
    expect(sendMock).toHaveBeenCalledWith({ data: { type: 'lobby_lifecycle', lifecycle_type: 'game_start' } });
    expect(playPopSound).toHaveBeenCalled();
  });

  it('copies link then resets icon after 2s', () => {
    useWebSocket.mockImplementationOnce(() => {});
    renderLobby();
    const copyBtn = screen.getByRole('button', { name: '🔗' });
    fireEvent.click(copyBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://example.com/A-B-C');
    expect(copyBtn.textContent).toBe('✅');
    act(() => jest.advanceTimersByTime(2000));
    expect(copyBtn.textContent).toBe('🔗');
  });

  it('plays audio tracks sequentially', () => {
    useWebSocket.mockImplementationOnce(() => {});
    renderLobby();
    const playBtn = screen.getByRole('button', { name: '🔊' });
    fireEvent.click(playBtn);
    expect(global.Audio).toHaveBeenCalledTimes(1);
    const audio = global.Audio.mock.results[0].value;
    expect(audio.play).toHaveBeenCalledTimes(1);
    act(() => audio._ended());
    expect(audio.src).toBe('/audio/b.mp3');
    expect(audio.play).toHaveBeenCalledTimes(2);
    act(() => audio._ended());
    expect(audio.src).toBe('/audio/c.mp3');
    expect(audio.play).toHaveBeenCalledTimes(3);
  });
});

import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import SideBuilder from '../components/Sides/SideBuilder';
import { WebSocketContext } from '../WebSocketContext';
import { playPopSound } from '../components/SoundEffects/playPopSound';
import { playSendSound } from '../components/SoundEffects/playSendSound';

jest.mock('../components/Sides/SideDisplay', () => ({ tableState, fryTimeLeft, onDragStart }) => (
  <div data-testid="side-display" data-table-state={tableState} data-fry-time-left={fryTimeLeft} />
));
jest.mock('../components/Score/Score', () => ({ score, day }) => (
  <div data-testid="score-component" data-score={score} data-day={day} />
));
jest.mock('../components/Modal/StationStartModal', () => ({ stationName, handleClick }) => (
  <div data-testid="station-start-modal" onClick={handleClick}>{stationName}</div>
));
jest.mock('../components/SoundEffects/playPopSound', () => ({ playPopSound: jest.fn() }));
jest.mock('../components/SoundEffects/playSendSound', () => ({ playSendSound: jest.fn() }));

describe('SideBuilder', () => {
  const originalAudio = global.Audio;
  let sendMock;

  beforeEach(() => {
    jest.useFakeTimers();
    sendMock = jest.fn();
    global.Audio = jest.fn().mockImplementation(src => ({
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

  const renderBuilder = () => render(
    <WebSocketContext.Provider value={{ send: sendMock }}>
      <SideBuilder score={42} day={3} />
    </WebSocketContext.Provider>
  );

  it('shows StationStartModal initially then hides after 5s', () => {
    renderBuilder();
    expect(screen.getByTestId('station-start-modal')).toBeInTheDocument();
    act(() => jest.advanceTimersByTime(5000));
    expect(screen.queryByTestId('station-start-modal')).toBeNull();
  });

  it('places side when raw button clicked and updates display', () => {
    renderBuilder();
    const potatoBtn = screen.getByRole('button', { name: /potatoes/i });
    fireEvent.click(potatoBtn);
    expect(playPopSound).toHaveBeenCalled();
    expect(global.Audio).toHaveBeenCalledWith('/audio/potatoes.mp3');
    const potatoAudio = global.Audio.mock.results
      .find(r => r.value.src === '/audio/potatoes.mp3').value;
    expect(potatoAudio.play).toHaveBeenCalled();
    expect(screen.getByTestId('side-display')).toHaveAttribute('data-table-state', 'potatoes');
  });

  it('chops side after delay and plays chopping sound', () => {
    renderBuilder();
    fireEvent.click(screen.getByRole('button', { name: /onions/i }));
    const chopBtn = screen.getByRole('button', { name: /chop/i });
    fireEvent.click(chopBtn);
    expect(global.Audio).toHaveBeenCalledWith('/audio/chopping.mp3');
    const chopAudio = global.Audio.mock.results
      .find(r => r.value.src === '/audio/chopping.mp3').value;
    expect(chopAudio.play).toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(2000));
    expect(screen.getByTestId('side-display')).toHaveAttribute('data-table-state', 'choppedOnions');
  });

  it('sends side when Send clicked and resets state with confirmation', async () => {
    renderBuilder();
    fireEvent.click(screen.getByRole('button', { name: /cheese/i }));
    fireEvent.click(screen.getByRole('button', { name: /chop/i }));
    act(() => jest.advanceTimersByTime(2000));

    const sendBtn = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendBtn);
    expect(sendMock).toHaveBeenCalledWith({
      data: expect.objectContaining({ component_type: 'side' })
    });
    expect(playSendSound).toHaveBeenCalled();
    expect(screen.getByText('Side sent to manager!')).toBeInTheDocument();
    act(() => jest.advanceTimersByTime(3000));
    await waitFor(() => {
      expect(screen.queryByText('Side sent to manager!')).toBeNull();
    });
  });

  it('handles StationStartModal click', () => {
    renderBuilder();
    const modal = screen.getByTestId('station-start-modal');
    fireEvent.click(modal);
    expect(screen.queryByTestId('station-start-modal')).toBeNull();
  });

  it('ignores placeSide when table is not empty', () => {
    renderBuilder();
    fireEvent.click(screen.getByRole('button', { name: /potatoes/i }));
    expect(screen.getByTestId('side-display')).toHaveAttribute('data-table-state', 'potatoes');

    fireEvent.click(screen.getByRole('button', { name: /onions/i }));
    expect(screen.getByTestId('side-display')).toHaveAttribute('data-table-state', 'potatoes');
  });

  it('handles frying process correctly', () => {
    renderBuilder();
    fireEvent.click(screen.getByRole('button', { name: /potatoes/i }));
    fireEvent.click(screen.getByRole('button', { name: /chop/i }));
    act(() => jest.advanceTimersByTime(2000));

    const fryer = screen.getByAltText('Fryer').closest('div');
    fireEvent.dragOver(fryer);
    expect(fryer.classList).toContain('drop-hover');

    const dataTransfer = {
      getData: jest.fn().mockReturnValue('choppedPotatoes')
    };

    fireEvent.drop(fryer, { dataTransfer });
    expect(global.Audio).toHaveBeenCalledWith('/audio/frying.mp3');
    expect(screen.getByTestId('side-display')).toHaveAttribute('data-table-state', 'frying');
    expect(screen.getByTestId('side-display')).toHaveAttribute('data-fry-time-left', '5');

    act(() => jest.advanceTimersByTime(1000));
    expect(screen.getByTestId('side-display')).toHaveAttribute('data-fry-time-left', '4');

    act(() => jest.advanceTimersByTime(4000));
    expect(screen.getByTestId('side-display')).toHaveAttribute('data-table-state', 'fries');
    expect(screen.getByTestId('side-display')).toHaveAttribute('data-fry-time-left', '0');
  });

  it('handles reset button click', () => {
    renderBuilder();
    fireEvent.click(screen.getByRole('button', { name: /onions/i }));
    expect(screen.getByTestId('side-display')).toHaveAttribute('data-table-state', 'onions');

    const resetButton = screen.getByRole('button', { name: /reset/i });
    fireEvent.click(resetButton);
    expect(playPopSound).toHaveBeenCalled();
    expect(screen.getByTestId('side-display')).toHaveAttribute('data-table-state', 'empty');
  });

  it('prevents sending when table is empty or frying', () => {
    renderBuilder();
    const sendButton = screen.getByRole('button', { name: /send/i });
    expect(sendButton).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: /potatoes/i }));
    fireEvent.click(screen.getByRole('button', { name: /chop/i }));
    act(() => jest.advanceTimersByTime(2000));

    const fryer = screen.getByAltText('Fryer').closest('div');
    const dataTransfer = {
      getData: jest.fn().mockReturnValue('choppedPotatoes')
    };
    fireEvent.drop(fryer, { dataTransfer });

    expect(sendButton).toBeDisabled();
  });

  it('plays help audio when Help button clicked', () => {
    renderBuilder();
    const helpButton = screen.getByRole('button', { name: /help/i });
    fireEvent.click(helpButton);
    expect(playPopSound).toHaveBeenCalled();
    expect(global.Audio).toHaveBeenCalledWith('/audio/side_help.mp3');
    const helpAudio = global.Audio.mock.results
      .find(r => r.value.src === '/audio/side_help.mp3').value;
    expect(helpAudio.play).toHaveBeenCalled();
  });

  it('plays repeat order audio when Repeat Order button clicked', () => {
    renderBuilder();
    const repeatButton = screen.getByRole('button', { name: /repeat order/i });
    fireEvent.click(repeatButton);
    expect(playPopSound).toHaveBeenCalled();
    expect(global.Audio).toHaveBeenCalledWith('/audio/repeat_order.mp3');
    const repeatAudio = global.Audio.mock.results
      .find(r => r.value.src === '/audio/repeat_order.mp3').value;
    expect(repeatAudio.play).toHaveBeenCalled();
  });

  it('handles drag and drop operations for chopping', () => {
    renderBuilder();
    fireEvent.click(screen.getByRole('button', { name: /onions/i }));

    const tableBorder = screen.getByTestId('side-display').closest('div');
    const dataTransfer = {
      getData: jest.fn().mockReturnValue('knife')
    };

    fireEvent.dragOver(tableBorder);

    fireEvent.drop(tableBorder, { dataTransfer });
    expect(global.Audio).toHaveBeenCalledWith('/audio/chopping.mp3');

    act(() => jest.advanceTimersByTime(2000));
    expect(screen.getByTestId('side-display'))
      .toHaveAttribute('data-table-state', 'choppedOnions');
  });

  it('handles drag leave events properly (no class assertions)', () => {
    renderBuilder();
    const tableBorder = screen.getByTestId('side-display').closest('div');

    fireEvent.dragOver(tableBorder);
    fireEvent.dragLeave(tableBorder);

    expect(screen.getByTestId('side-display'))
      .toHaveAttribute('data-table-state', 'empty');
  });

  it('cleans up frying interval (or timeout) on unmount', () => {
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
    const clearTimeoutSpy  = jest.spyOn(window, 'clearTimeout');

    const { unmount } = renderBuilder();

    fireEvent.click(screen.getByRole('button', { name: /potatoes/i }));
    fireEvent.click(screen.getByRole('button', { name: /chop/i }));
    act(() => jest.advanceTimersByTime(2000));

    const fryer = screen.getByAltText('Fryer').closest('div');
    const dataTransfer = { getData: jest.fn().mockReturnValue('choppedPotatoes') };
    fireEvent.drop(fryer, { dataTransfer });

    unmount();

    expect(
      clearIntervalSpy.mock.calls.length + clearTimeoutSpy.mock.calls.length
    ).toBeGreaterThan(0);
  });
});

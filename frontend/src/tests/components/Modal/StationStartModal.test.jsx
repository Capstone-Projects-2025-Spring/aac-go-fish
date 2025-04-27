import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StationStartModal from '../../../components/Modal/StationStartModal';
import { playPopSound } from '../../../components/SoundEffects/playPopSound';

jest.mock('../../../components/SoundEffects/playPopSound', () => ({
  playPopSound: jest.fn(),
}));

describe('StationStartModal', () => {
  const handleClick = jest.fn();
  beforeEach(() => {
    const portal = document.createElement('div');
    portal.id = 'portal-station';
    document.body.appendChild(portal);
    jest.spyOn(global.console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    const portal = document.getElementById('portal-station');
    if (portal) document.body.removeChild(portal);
    jest.resetAllMocks();
    console.error.mockRestore();
  });

  it('renders station name and sub-text correctly', () => {
    render(<StationStartModal stationName="Side" handleClick={handleClick} />);
    expect(screen.getByText(/🧑‍🍳 Side Station 👩‍🍳/)).toBeInTheDocument();
    expect(screen.getByText(/Let’s get started!/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
  });

  it('calls handleClick and playPopSound on Start button click', () => {
    render(<StationStartModal stationName="Manager" handleClick={handleClick} />);
    const button = screen.getByRole('button', { name: /start/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalled();
    expect(playPopSound).toHaveBeenCalled();
  });
});

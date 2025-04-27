import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GameCompleteModal from '../../../components/Modal/GameCompleteModal';
import { playPopSound } from '../../../components/SoundEffects/playPopSound';

jest.mock('../../../components/SoundEffects/playPopSound', () => ({
  playPopSound: jest.fn(),
}));

describe('GameCompleteModal', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    const portal = document.createElement('div');
    portal.id = 'portal-game';
    document.body.appendChild(portal);
    jest.spyOn(global.console, 'error').mockImplementation(() => {});
    delete window.location;
    window.location = {
      href: '',
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
    window.location = originalLocation;
    const portal = document.getElementById('portal-game');
    if (portal) document.body.removeChild(portal);
    console.error.mockRestore();
  });

  it('renders modal with correct text and score', () => {
    render(<GameCompleteModal score="$500.00" />);
    expect(screen.getByText(/🎉Great Job!🎉/)).toBeInTheDocument();
    expect(screen.getByText('$500.00')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to home/i })).toBeInTheDocument();
  });

  it('plays pop sound and navigates home on button click', () => {
    render(<GameCompleteModal score="$0.00" />);
    const button = screen.getByRole('button', { name: /back to home/i });
    fireEvent.click(button);
    expect(playPopSound).toHaveBeenCalled();
    expect(window.location.href).toBe('/');
  });
});

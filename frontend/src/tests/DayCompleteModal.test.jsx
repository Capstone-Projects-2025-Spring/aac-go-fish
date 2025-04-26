jest.mock('../components/SoundEffects/playPopSound', () => ({
    playPopSound: jest.fn(),
  }));

  import React from 'react';
  import { render, screen, fireEvent } from '@testing-library/react';
  import DayCompleteModal from '../components/Modal/DayCompleteModal';
  import { playPopSound } from '../components/SoundEffects/playPopSound';

  describe('DayCompleteModal', () => {
    const handleClick = jest.fn();

    beforeEach(() => {
      const portal = document.createElement('div');
      portal.id = 'portal-day';
      document.body.appendChild(portal);
      jest.spyOn(global.console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      const portal = document.getElementById('portal-day');
      if (portal) document.body.removeChild(portal);
      jest.resetAllMocks();
      console.error.mockRestore();
    });

    it('renders modal with correct text for multiple customers', () => {
      render(<DayCompleteModal score="$200.00" customers={3} handleClick={handleClick} />);
      expect(screen.getByText(/🎉Day Complete!🎉/)).toBeInTheDocument();
      expect(screen.getByText('3 Happy Customers!')).toBeInTheDocument();
      expect(screen.getByText('$200.00')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next day/i })).toBeInTheDocument();
    });

    it('renders singular customer text when customers is 1', () => {
      render(<DayCompleteModal score="$50.00" customers={1} handleClick={handleClick} />);
      expect(screen.getByText('1 Happy Customer!')).toBeInTheDocument();
    });

    it('calls handleClick and playPopSound on button click', () => {
      render(<DayCompleteModal score="$0.00" customers={0} handleClick={handleClick} />);
      const button = screen.getByRole('button', { name: /next day/i });
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalled();
      expect(playPopSound).toHaveBeenCalled();
    });
  });

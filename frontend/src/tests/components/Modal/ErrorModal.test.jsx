import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorModal from '../../../components/Modal/ErrorModal';

describe('ErrorModal', () => {
  const handleClick = jest.fn();
  beforeEach(() => {
    const portal = document.createElement('div');
    portal.id = 'portal-error';
    document.body.appendChild(portal);
    jest.spyOn(global.console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.resetAllMocks();
    const portal = document.getElementById('portal-error');
    if (portal) document.body.removeChild(portal);
    console.error.mockRestore();
  });

  it('renders the error message and OK button', () => {
    render(<ErrorModal msg="Test error" handleClick={handleClick} />);
    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ok/i })).toBeInTheDocument();
  });

  it('calls handleClick when OK button is clicked', () => {
    render(<ErrorModal msg="Error occurred" handleClick={handleClick} />);
    const button = screen.getByRole('button', { name: /ok/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalled();
  });
});

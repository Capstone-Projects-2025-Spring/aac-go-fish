import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ItemButton from '../components/AACBoard/ItemButton';
import { playPopSound } from '../components/SoundEffects/playPopSound';

jest.mock('../components/SoundEffects/playPopSound', () => ({ playPopSound: jest.fn() }));

describe('ItemButton component', () => {
  const item = { name: 'TestItem', image: '/images/test.png' };
  const handleClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with correct class, image, and name', () => {
    render(<ItemButton item={item} onClick={handleClick} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('aacboard-item-btn');
    const img = screen.getByAltText('TestItem');
    expect(img).toHaveAttribute('src', '/images/test.png');
    expect(button).toHaveTextContent('TestItem');
  });

  it('invokes playPopSound and onClick when clicked', () => {
    render(<ItemButton item={item} onClick={handleClick} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(playPopSound).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

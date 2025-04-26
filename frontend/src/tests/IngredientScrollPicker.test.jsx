import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import IngredientScrollPicker from '../components/IngredientScrollPicker/IngredientScrollPicker';

jest.mock('../menuItems', () => ({
  menu: [
    {
      children: [
        { name: 'A', image: 'a.png' },
        { name: 'B', image: 'b.png' },
        { name: 'C', image: 'c.png' }
      ]
    }
  ]
}));

describe('IngredientScrollPicker', () => {
  it('renders with initial selected and image alt', () => {
    const setSelected = jest.fn();
    render(<IngredientScrollPicker selected="B" setSelected={setSelected} />);
    const img = screen.getByAltText('B');
    expect(img).toHaveAttribute('src', 'b.png');
  });

  it('cycles up when scrollUp button clicked', () => {
    const setSelected = jest.fn();
    render(<IngredientScrollPicker selected="A" setSelected={setSelected} />);
    const upBtn = screen.getByRole('button', { name: '▲' });
    fireEvent.click(upBtn);
    expect(setSelected).toHaveBeenCalledWith('C');
  });

  it('cycles down when scrollDown button clicked', () => {
    const setSelected = jest.fn();
    render(<IngredientScrollPicker selected="C" setSelected={setSelected} />);
    const downBtn = screen.getByRole('button', { name: '▼' });
    fireEvent.click(downBtn);
    expect(setSelected).toHaveBeenCalledWith('A');
  });

  it('updates currentIndex when selected prop changes', () => {
    const setSelected = jest.fn();
    const { rerender } = render(<IngredientScrollPicker selected="A" setSelected={setSelected} />);
    let img = screen.getByAltText('A');
    expect(img).toHaveAttribute('src', 'a.png');
    rerender(<IngredientScrollPicker selected="C" setSelected={setSelected} />);
    img = screen.getByAltText('C');
    expect(img).toHaveAttribute('src', 'c.png');
  });
});

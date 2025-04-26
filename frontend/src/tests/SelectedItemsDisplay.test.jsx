import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SelectedItemsDisplay from '../components/AACBoard/SelectedItemsDisplay';

describe('SelectedItemsDisplay', () => {
  const items = [
    { name: 'Item1', image: 'img1.png' },
    { name: 'Item2', image: null },
    { name: 'Item3', image: 'img3.png' }
  ];
  let onDelete, onClear, onPlayAll;

  beforeEach(() => {
    onDelete = jest.fn();
    onClear = jest.fn();
    onPlayAll = jest.fn();
  });

  it('renders no action buttons when selectedItems is empty', () => {
    render(<SelectedItemsDisplay selectedItems={[]} onDelete={onDelete} onClear={onClear} onPlayAll={onPlayAll} />);
    expect(screen.queryByText('Clear All')).toBeNull();
    expect(screen.queryByText('Play All')).toBeNull();
  });

  it('renders each selected item with image and delete button', () => {
    render(<SelectedItemsDisplay selectedItems={items} onDelete={onDelete} onClear={onClear} onPlayAll={onPlayAll} />);
    items.forEach((item, index) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
      if (item.image) {
        const img = screen.getByAltText(item.name);
        expect(img).toHaveAttribute('src', item.image);
      }
    });
    const deleteButtons = screen.getAllByText('×');
    expect(deleteButtons).toHaveLength(items.length);
  });

  it('calls onDelete with correct index when delete button clicked', () => {
    render(<SelectedItemsDisplay selectedItems={items} onDelete={onDelete} onClear={onClear} onPlayAll={onPlayAll} />);
    const deleteButtons = screen.getAllByText('×');
    fireEvent.click(deleteButtons[1]);
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('renders action buttons and calls callbacks', () => {
    render(<SelectedItemsDisplay selectedItems={items} onDelete={onDelete} onClear={onClear} onPlayAll={onPlayAll} />);
    const clearBtn = screen.getByText('Clear All');
    const playAllBtn = screen.getByText('Play All');
    fireEvent.click(clearBtn);
    fireEvent.click(playAllBtn);
    expect(onClear).toHaveBeenCalled();
    expect(onPlayAll).toHaveBeenCalled();
  });
});

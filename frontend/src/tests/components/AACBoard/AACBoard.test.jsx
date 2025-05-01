import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AACBoard from '../../../components/AACBoard/AACBoard';

jest.mock('../../../menuItems', () => ({ menu: [
  { name: 'Item1', audio: '/audio/1.mp3' },
  { name: 'Item2', audio: null },
] }));

jest.mock('../../../components/AACBoard/ItemGrid', () => ({ items, onClick }) => (
  <div>
    {items.map(item => (
      <button key={item.name} data-testid={`grid-${item.name}`} onClick={() => onClick(item)}>
        {item.name}
      </button>
    ))}
  </div>
));

jest.mock('../../../components/AACBoard/SelectedItemsDisplay', () => ({ selectedItems, onDelete, onClear, onPlayAll }) => (
  <div data-testid="selected-display" data-selected={JSON.stringify(selectedItems)} />
));

describe('AACBoard', () => {
  let onSelectItem, onItemClick, onDeleteItem, onClearAll, onPlayAll;
  const originalAudio = global.Audio;

  beforeEach(() => {
    global.Audio = jest.fn().mockImplementation(src => ({
      src,
      play: jest.fn().mockResolvedValue(),
    }));
    onSelectItem = jest.fn();
    onItemClick = jest.fn();
    onDeleteItem = jest.fn();
    onClearAll = jest.fn();
    onPlayAll = jest.fn();
  });

  afterEach(() => {
    global.Audio = originalAudio;
    jest.resetAllMocks();
  });

  it('renders SelectedItemsDisplay with provided selectedItems', () => {
    const items = [{ name: 'foo' }];
    render(
      <AACBoard
        selectedItems={items}
        onSelectItem={onSelectItem}
        onItemClick={onItemClick}
        onDeleteItem={onDeleteItem}
        onClearAll={onClearAll}
        onPlayAll={onPlayAll}
      />
    );
    const display = screen.getByTestId('selected-display');
    expect(display).toHaveAttribute('data-selected', JSON.stringify(items));
  });

  it('clicks item with audio: plays audio and calls handlers', () => {
    render(
      <AACBoard
        selectedItems={[]}
        onSelectItem={onSelectItem}
        onItemClick={onItemClick}
        onDeleteItem={onDeleteItem}
        onClearAll={onClearAll}
        onPlayAll={onPlayAll}
      />
    );
    const btn = screen.getByTestId('grid-Item1');
    fireEvent.click(btn);
    expect(global.Audio).toHaveBeenCalledWith('/audio/1.mp3');
    const audioInstance = global.Audio.mock.results[0].value;
    expect(audioInstance.play).toHaveBeenCalled();
  });

  it('clicks item without audio: skips audio and calls handlers', () => {
    render(
      <AACBoard
        selectedItems={[]}
        onSelectItem={onSelectItem}
        onItemClick={onItemClick}
        onDeleteItem={onDeleteItem}
        onClearAll={onClearAll}
        onPlayAll={onPlayAll}
      />
    );
    const btn = screen.getByTestId('grid-Item2');
    fireEvent.click(btn);
    expect(global.Audio).not.toHaveBeenCalled();
  });
});

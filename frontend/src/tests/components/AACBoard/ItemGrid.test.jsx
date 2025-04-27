import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ItemGrid from '../../../components/AACBoard/ItemGrid';

jest.mock('../../../components/AACBoard/ItemButton', () => ({ item, onClick }) => (
  <button data-testid={`item-btn-${item.name}`} onClick={onClick}>
    {item.name}
  </button>
));

describe('ItemGrid component', () => {
  const items = [
    { parent: { id: 'p1', name: 'Parent1', image: 'img1' }, children: [
        { id: 'c1', name: 'Child1', image: 'imgc1' },
        { id: 'c2', name: 'Child2', image: 'imgc2' }
      ]
    },
    { parent: { id: 'p2', name: 'Parent2', image: 'img2' }, children: [
        { id: 'c3', name: 'Child3', image: 'imgc3' }
      ]
    }
  ];
  let onClick;

  beforeEach(() => {
    onClick = jest.fn();
  });

  it('renders parent buttons when closed', () => {
    render(<ItemGrid items={items} onClick={onClick} />);
    expect(screen.getByTestId('item-btn-Parent1')).toBeInTheDocument();
    expect(screen.getByTestId('item-btn-Parent2')).toBeInTheDocument();
    expect(screen.queryByTestId('item-btn-Back')).toBeNull();
  });

  it('opens children and back on parent click', () => {
    render(<ItemGrid items={items} onClick={onClick} />);
    fireEvent.click(screen.getByTestId('item-btn-Parent1'));
    expect(screen.getByTestId('item-btn-Back')).toBeInTheDocument();
    expect(screen.getByTestId('item-btn-Child1')).toBeInTheDocument();
    expect(screen.getByTestId('item-btn-Child2')).toBeInTheDocument();
    expect(screen.queryByTestId('item-btn-Parent2')).toBeNull();
  });

  it('returns to parent view on Back click', () => {
    render(<ItemGrid items={items} onClick={onClick} />);
    fireEvent.click(screen.getByTestId('item-btn-Parent2'));
    fireEvent.click(screen.getByTestId('item-btn-Back'));
    expect(screen.getByTestId('item-btn-Parent1')).toBeInTheDocument();
    expect(screen.getByTestId('item-btn-Parent2')).toBeInTheDocument();
  });

  it('calls onClick with child item when child button clicked', () => {
    render(<ItemGrid items={items} onClick={onClick} />);
    fireEvent.click(screen.getByTestId('item-btn-Parent1'));
    fireEvent.click(screen.getByTestId('item-btn-Child2'));
    expect(onClick).toHaveBeenCalledWith(items[0].children[1]);
  });
});

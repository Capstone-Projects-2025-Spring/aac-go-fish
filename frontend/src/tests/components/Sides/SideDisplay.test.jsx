import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SideDisplay from '../../../components/Sides/SideDisplay';

describe('SideDisplay', () => {
  const renderDisplay = (props) => render(<SideDisplay {...props} />);

  it('renders empty state text', () => {
    renderDisplay({ tableState: 'empty', fryTimeLeft: 0, onDragStart: jest.fn() });
    expect(screen.getByText(/table is empty/i)).toBeInTheDocument();
  });

  it('renders potatoes image', () => {
    renderDisplay({ tableState: 'potatoes', fryTimeLeft: 0, onDragStart: jest.fn() });
    const img = screen.getByAltText(/potato/i);
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/images/aac_icons/potato.png');
  });

  it('renders onions image', () => {
    renderDisplay({ tableState: 'onions', fryTimeLeft: 0, onDragStart: jest.fn() });
    const img = screen.getByAltText(/onions/i);
    expect(img).toHaveAttribute('src', '/images/aac_icons/onion.png');
  });

  it('renders cheese image', () => {
    renderDisplay({ tableState: 'cheese', fryTimeLeft: 0, onDragStart: jest.fn() });
    const img = screen.getByAltText(/cheese/i);
    expect(img).toHaveAttribute('src', '/images/food_side_view/Mozzarella.png');
  });

  it('renders chained draggable choppedPotatoes with drag event', () => {
    const onDragStart = jest.fn();
    renderDisplay({ tableState: 'choppedPotatoes', fryTimeLeft: 0, onDragStart });
    const container = screen.getByRole('img', { name: /choppedpotatoes/i }).closest('div');
    expect(container).toHaveClass('DraggableItem');
    fireEvent.dragStart(container);
    expect(onDragStart).toHaveBeenCalled();
  });

  it('renders choppedOnions draggable', () => {
    const onDragStart = jest.fn();
    renderDisplay({ tableState: 'choppedOnions', fryTimeLeft: 0, onDragStart });
    const container = screen.getByRole('img', { name: /choppedonions/i }).closest('div');
    fireEvent.dragStart(container);
    expect(onDragStart).toHaveBeenCalled();
  });

  it('renders choppedCheese draggable', () => {
    const onDragStart = jest.fn();
    renderDisplay({ tableState: 'choppedCheese', fryTimeLeft: 0, onDragStart });
    const container = screen.getByRole('img', { name: /choppedcheese/i }).closest('div');
    fireEvent.dragStart(container);
    expect(onDragStart).toHaveBeenCalled();
  });

  it('renders frying state with time left', () => {
    renderDisplay({ tableState: 'frying', fryTimeLeft: 4, onDragStart: jest.fn() });
    expect(screen.getByText(/time left: 4 seconds/i)).toBeInTheDocument();
  });

  it('renders fries state with correct style', () => {
    renderDisplay({ tableState: 'fries', fryTimeLeft: 0, onDragStart: jest.fn() });
    const img = screen.getByAltText(/fries/i);
    expect(img).toHaveAttribute('src', '/images/aac_icons/fries.png');
    expect(img).toHaveStyle('transform: scale(0.8)');
  });

  it('renders onionRings state', () => {
    renderDisplay({ tableState: 'onionRings', fryTimeLeft: 0, onDragStart: jest.fn() });
    expect(screen.getByAltText(/onionRings/i)).toHaveAttribute('src', '/images/aac_icons/OnionRings.png');
  });

  it('renders mozzarellaSticks state', () => {
    renderDisplay({ tableState: 'mozzarellaSticks', fryTimeLeft: 0, onDragStart: jest.fn() });
    expect(screen.getByAltText(/Mozzarella Sticks/i)).toHaveAttribute('src', '/images/aac_icons/mozzarella_sticks.png');
  });

  it('applies manager width style when manager prop is true', () => {
    const { container } = render(<SideDisplay tableState="empty" fryTimeLeft={0} onDragStart={() => {}} manager />);
    expect(container.firstChild).toHaveStyle('width: 5rem');
  });
});

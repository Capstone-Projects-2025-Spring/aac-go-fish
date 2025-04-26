import React from 'react';
import { render, screen } from '@testing-library/react';
import MiniOrderDisplay from '../components/Manager/MiniOrderDisplay';

jest.mock('../components/Burger/BurgerDisplay', () => ({ imagePaths }) => (
  <div data-testid="burger-display" data-paths={JSON.stringify(imagePaths)} />
));
jest.mock('../components/Drinks/DrinkDisplay', () => ({ color, fillPercentage, cupSize, mini, cupPosition }) => (
  <div data-testid="drink-display" data-color={color} data-fill={fillPercentage} data-cup-size={cupSize} data-mini={mini} data-cup-position={cupPosition} />
));
jest.mock('../components/Sides/SideDisplay', () => ({ tableState, manager }) => (
  <div data-testid="side-display" data-state={tableState} data-manager={manager} />
));
jest.mock('../menuItems', () => ({
  menuMap: {
    Burger: {
      Tomato: { sideImage: 'tomato.png' },
      Lettuce: { sideImage: 'lettuce.png' }
    }
  }
}));

describe('MiniOrderDisplay', () => {
  it('renders nothing when no items', () => {
    const { container } = render(<MiniOrderDisplay burger={[]} drink={null} side={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders only burger and applies style', () => {
    const { container } = render(<MiniOrderDisplay burger={[ 'Tomato' ]} drink={null} side={null} />);
    const wrapper = container.querySelector('.mini-order-display');
    expect(wrapper).toBeInTheDocument();
    const burgerDiv = wrapper.querySelector('.burger');
    expect(burgerDiv).toHaveStyle('transform: scale(1.2)');
    const burgerDisplay = screen.getByTestId('burger-display');
    expect(burgerDisplay).toHaveAttribute('data-paths', '["tomato.png"]');
  });

  it('renders only drink without burger style override', () => {
    const drink = { color: 'blue', fill: 75, size: 'large' };
    const { container } = render(<MiniOrderDisplay burger={[]} drink={drink} side={null} />);
    const wrapper = container.querySelector('.mini-order-display');
    expect(wrapper).toBeInTheDocument();
    const burgerDiv = wrapper.querySelector('.burger');
    expect(burgerDiv).not.toHaveStyle('transform: scale(1.2)');
    const drinkDisplay = screen.getByTestId('drink-display');
    expect(drinkDisplay).toHaveAttribute('data-color', 'blue');
    expect(drinkDisplay).toHaveAttribute('data-fill', '75');
    expect(drinkDisplay).toHaveAttribute('data-cup-size', 'large');
    expect(drinkDisplay).toHaveAttribute('data-mini', 'false');
    expect(drinkDisplay).toHaveAttribute('data-cup-position', '0');
  });

  it('renders only side', () => {
    const side = { table_state: 'choppedPotatoes' };
    const { container } = render(<MiniOrderDisplay burger={[]} drink={null} side={side} />);
    const wrapper = container.querySelector('.mini-order-display');
    expect(wrapper).toBeInTheDocument();
    const sideDisplay = screen.getByTestId('side-display');
    expect(sideDisplay).toHaveAttribute('data-state', 'choppedPotatoes');
    expect(sideDisplay).toHaveAttribute('data-manager', 'true');
  });

  it('renders all items when provided', () => {
    const burger = [ 'Tomato', 'Lettuce' ];
    const drink = { color: 'red', fill: 50, size: 'medium' };
    const side = { table_state: 'fries' };
    const { container } = render(<MiniOrderDisplay burger={burger} drink={drink} side={side} />);
    const wrapper = container.querySelector('.mini-order-display');
    expect(wrapper).toBeInTheDocument();
    expect(screen.getByTestId('burger-display')).toBeInTheDocument();
    expect(screen.getByTestId('drink-display')).toBeInTheDocument();
    expect(screen.getByTestId('side-display')).toBeInTheDocument();
  });
  it('maps ingredient objects and unknown strings correctly', () => {
    const burger = [
      { sideImage: 'pickle.png' }, // object form
      'Bacon'                       // unknown string → empty string
    ];
    render(<MiniOrderDisplay burger={burger} drink={null} side={null} />);
    const burgerDisplay = screen.getByTestId('burger-display');
    expect(burgerDisplay).toHaveAttribute('data-paths', JSON.stringify(['pickle.png', '']));
  });

  it('does not scale burger when a side is also present', () => {
    const burger = ['Tomato'];
    const side = { table_state: 'fries' };
    const { container } = render(<MiniOrderDisplay burger={burger} drink={null} side={side} />);
    const burgerDiv = container.querySelector('.burger');
    expect(burgerDiv).not.toHaveStyle('transform: scale(1.2)');
  });
});

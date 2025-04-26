import React from 'react';
import { render, screen } from '@testing-library/react';
import BurgerStation from '../components/Burger/BurgerStation';

jest.mock('../components/Burger/BurgerDisplay', () => ({ imagePaths }) => (
  <div data-testid="burger-display" data-paths={JSON.stringify(imagePaths)} />
));

describe('BurgerStation', () => {
  it('renders grill image and passes imagePaths to BurgerDisplay', () => {
    const paths = ['a.png', 'b.png'];
    const { container } = render(<BurgerStation imagePaths={paths} />);
    const grillImg = screen.getByAltText('grill station');
    expect(grillImg).toHaveAttribute('src', '/images/station_specific/kitchenPlate.png');
    expect(grillImg).toHaveClass('GrillImage');
    const burgerDisplay = screen.getByTestId('burger-display');
    expect(burgerDisplay).toHaveAttribute('data-paths', JSON.stringify(paths));
  });
});

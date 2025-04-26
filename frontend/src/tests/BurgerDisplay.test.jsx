import React from 'react';
import { render, screen } from '@testing-library/react';
import BurgerDisplay from '../components/Burger/BurgerDisplay';

describe('BurgerDisplay component', () => {
  it('renders no img tags when imagePaths is empty', () => {
    render(<BurgerDisplay imagePaths={[]} />);
    const images = screen.queryAllByRole('img');
    expect(images).toHaveLength(0);
  });

  it('renders images for each path with correct attributes', () => {
    const paths = [
      '/images/ingredients/tomato_side.png',
      '/images/ingredients/lettuce_side.png',
    ];
    render(<BurgerDisplay imagePaths={paths} />);

    paths.forEach((path, idx) => {
      const ingredientName = path.split('/').pop().replace('_side.png', '');
      const img = screen.getByAltText(ingredientName);
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', path);
      expect(img).toHaveClass(`IngredientOnGrill`, `${ingredientName}-Ingredient`);
      expect(img).toHaveStyle(`z-index: ${idx + 1}`);
    });
  });
});

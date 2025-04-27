import React from 'react';
import { render, screen } from '@testing-library/react';
import DrinkDisplay from '../../../components/Drinks/DrinkDisplay';

describe('DrinkDisplay', () => {
  it('renders cup container with correct classes and transform', () => {
    const { container } = render(
      <DrinkDisplay
        color="#ABCDEF"
        fillPercentage={0}
        cupSize="small"
        cupPosition={10}
        mini={true}
      />
    );
    const cupContainer = container.firstChild;
    expect(cupContainer).toHaveClass('CupContainer', 'small', 'mini');
    expect(cupContainer).toHaveStyle('transform: translateX(10px)');
    expect(cupContainer).toHaveStyle('transition: transform 0.4s ease-in-out');
  });

  it('renders fill overlay with correct height, width, background, and maxHeight', () => {
    const { container } = render(
      <DrinkDisplay
        color="123456"
        fillPercentage={50}
        cupSize="medium"
        cupPosition={0}
        mini={false}
      />
    );
    const overlay = container.querySelector('.FillOverlay');
    expect(overlay).toHaveClass('FillOverlay', 'medium');
    expect(overlay).toHaveStyle('height: 3.36rem');
    expect(overlay).toHaveStyle('width: 4.7rem');
    expect(overlay).toHaveStyle('background-color: #123456');
    expect(overlay).toHaveStyle('max-height: 6.72rem');
  });

  it('clamps height to maxFillHeight for over 100% fill', () => {
    const { container } = render(
      <DrinkDisplay
        color="#000000"
        fillPercentage={150}
        cupSize="large"
        cupPosition={0}
        mini={false}
      />
    );
    const overlay = container.querySelector('.FillOverlay');
    expect(overlay).toHaveStyle('height: 7.8125rem');
    expect(overlay).toHaveStyle('max-height: 7.8125rem');
  });

  it('renders cup image with correct src and class', () => {
    render(
      <DrinkDisplay
        color="#ABCDEF"
        fillPercentage={0}
        cupSize="medium"
        cupPosition={0}
        mini={false}
      />
    );
    const img = screen.getByAltText('Cup');
    expect(img).toHaveClass('CupImages', 'medium');
    expect(img).toHaveAttribute('src', '/images/drink_sizes/cup-medium.png');
  });
});

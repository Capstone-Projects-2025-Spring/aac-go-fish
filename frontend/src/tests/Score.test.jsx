import React from 'react';
import { render, screen } from '@testing-library/react';
import Score from '../components/Score/Score';

describe('Score component', () => {
  it('renders score and day text correctly', () => {
    render(<Score score="$123.45" day={7} />);
    const text = screen.getByText(/Day 7 - \$123\.45/);
    expect(text).toBeInTheDocument();
  });

  it('applies correct class names', () => {
    const { container } = render(<Score score="$0.00" day={1} />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('Score');
    const paragraph = wrapper.querySelector('p');
    expect(paragraph).toHaveClass('ScoreText');
  });

  it('updates when props change', () => {
    const { rerender } = render(<Score score="$0.00" day={1} />);
    expect(screen.getByText(/Day 1 - \$0\.00/)).toBeInTheDocument();
    rerender(<Score score="$99.99" day={5} />);
    expect(screen.getByText(/Day 5 - \$99\.99/)).toBeInTheDocument();
  });
});

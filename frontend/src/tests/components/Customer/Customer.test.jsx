import React from 'react';
import { render, screen } from '@testing-library/react';
import Customer from '../../../components/Customer/Customer';

describe('Customer component', () => {
  it('renders customer image with provided src and alt text', () => {
    render(<Customer customerImage="/images/customers/test.png" />);
    const img = screen.getByAltText('Customer');
    expect(img).toHaveAttribute('src', '/images/customers/test.png');
    expect(img).toHaveClass('customer-image');
  });
});

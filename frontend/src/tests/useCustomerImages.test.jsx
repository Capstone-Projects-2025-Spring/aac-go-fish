import React from 'react';
import { render } from '@testing-library/react';
import { act } from 'react';
import { useCustomerImages } from '../useCustomerImages';

describe('useCustomerImages hook', () => {
  let result;
  const TestComponent = () => {
    result = useCustomerImages();
    return null;
  };

  it('initializes with empty customer image', () => {
    render(<TestComponent />);
    expect(result.customerImage).toBe('/images/customers/empty.png');
  });

  it('setRandomCustomerImage chooses an image from the list', () => {
    const customerImages = [
      '/images/customers/customer1.png',
      '/images/customers/customer2.png',
      '/images/customers/customer3.png',
      '/images/customers/customer4.png',
      '/images/customers/customer5.png',
    ];

    render(<TestComponent />);
    act(() => {
      result.setRandomCustomerImage();
    });

    expect(customerImages).toContain(result.customerImage);
  });
});

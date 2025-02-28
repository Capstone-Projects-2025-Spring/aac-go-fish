import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/chat/i);
  expect(linkElement).toBeInTheDocument();
  const sliderElement = screen.getAllByRole("slider");
  expect(sliderElement.length).toBeGreaterThan(0);
  const sendButton = screen.getAllByRole('button', { name: /send/i });
  expect(sendButton[0]).toBeInTheDocument();
  expect(sendButton[1]).toBeInTheDocument();
});

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders element with id "title" and verifies its text content', () => {
  render(<App />);
  const titleElement = screen.getByTestId('title');
  expect(titleElement).toBeInTheDocument();
  expect(titleElement.textContent).toBe('Planpal');
});

import { render, screen } from '@testing-library/react';
import App from './App';

test('user logs in, searches for a task, deletes it, and logs out', async () => {
  // Render the app
  render(<App />);

  // Simulate user logging in
  const emailInput = screen.getByPlaceholderText('Email');
  fireEvent.change(emailInput, { target: { value: 'user@example.com' } });

  const passwordInput = screen.getByPlaceholderText('Password');
  fireEvent.change(passwordInput, { target: { value: 'password123' } });

  const loginButton = screen.getByText('Sign In');
  fireEvent.click(loginButton);

  // Verify that the dashboard page is displayed
  const dashboardTitle = await screen.findByText(/Today, September 20th, 2024/i);
  expect(dashboardTitle).toBeInTheDocument();

  // Find the search bar and enter a search term
  const searchBar = screen.getByPlaceholderText('Search');
  fireEvent.change(searchBar, { target: { value: 'Frontend Task Name' } });

  // Ensure the task is found in the list
  const task = await screen.findByText(/Frontend Task Name/i);
  expect(task).toBeInTheDocument();

  // Click the delete button for the task
  const deleteButton = screen.getByText('Delete');
  fireEvent.click(deleteButton);

  // Verify that the task is removed from the list
  expect(screen.queryByText(/Frontend Task Name/i)).not.toBeInTheDocument();

  // Simulate user logging out
  const logoutButton = screen.getByText('Logout');
  fireEvent.click(logoutButton);

  // Verify that the user is logged out and the login page is displayed
  const signInButton = await screen.findByText('Sign In');
  expect(signInButton).toBeInTheDocument();
});
